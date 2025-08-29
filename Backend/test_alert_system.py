import sqlite3
from datetime import datetime, timedelta
import smtplib
import pandas as pd
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# --- Configuration ---
idle_threshold_days = 7
smtp_server = "smtp.gmail.com"
smtp_port = 587
smtp_user = "akshattanmay2004@gmail.com"
smtp_password = "jfrp mcns fmon xhcw"
alert_email_sender = smtp_user
alert_email_receivers = ["agrawalakshat1204@gmail.com"]

# --- Database connection ---
conn = sqlite3.connect("app.db")
cursor = conn.cursor()

print("=== TESTING IDLE ALERT SYSTEM ===\n")

# Clear the alerts log to test fresh
print("1. Clearing previous alerts log...")
cursor.execute("DELETE FROM idle_alerts_log")
conn.commit()
print("✅ Alerts log cleared")

# --- Ensure alerts log table exists ---
cursor.execute("""
CREATE TABLE IF NOT EXISTS idle_alerts_log (
    eq_id INTEGER PRIMARY KEY,
    last_alert_date DATE
)
""")
conn.commit()

def check_idle_streak(group, threshold=7):
    group = group.sort_values("last_logged_in").reset_index(drop=True)
    max_streak = 0
    streak = 0
    last_date = None
    for _, row in group.iterrows():
        if row["live_stat"] == "idle":
            current_date = pd.to_datetime(row["last_logged_in"], format='mixed').date()
            if last_date is None or (current_date - last_date).days == 1:
                streak += 1
            else:
                streak = 1
            last_date = current_date
            max_streak = max(max_streak, streak)
        else:
            streak = 0
            last_date = None
    return max_streak

print(f"2. Running idle alert check at {datetime.now()}...")

query = """
SELECT eq_id, live_stat, last_logged_in
FROM eq_live_status
WHERE last_logged_in >= date('now','-30 day')
ORDER BY eq_id, last_logged_in
"""
df = pd.read_sql(query, conn)
df["last_logged_in"] = pd.to_datetime(df["last_logged_in"], format='mixed')

print(f"   Found {len(df)} records in the last 30 days")

alerts_log = pd.read_sql("SELECT * FROM idle_alerts_log", conn)

alerts = []
for eq_id, group in df.groupby("eq_id"):
    streak = check_idle_streak(group)
    print(f"   Equipment {eq_id}: {streak} consecutive idle days")
    if streak >= idle_threshold_days:
        last_alert = alerts_log.loc[alerts_log["eq_id"] == eq_id, "last_alert_date"]
        if last_alert.empty or (datetime.now().date() - pd.to_datetime(last_alert.values[0]).date()).days >= 7:
            alerts.append(eq_id)
            print(f"     ✅ ALERT TRIGGERED for equipment {eq_id} (streak: {streak})")
        else:
            print(f"     ⚠️ Alert already sent recently for equipment {eq_id}")
    else:
        print(f"     ❌ No alert needed for equipment {eq_id} (streak: {streak})")

if alerts:
    print(f"\n3. 🚨 SENDING ALERTS for equipment: {alerts}")
    
    # --- Compose HTML email ---
    html_content = f"""
    <html>
    <body>
    <h2>Equipment Idle Alert 🚨</h2>
    <p>The following machines have been idle for more than {idle_threshold_days} consecutive days:</p>
    <ul>
    {''.join(f'<li>Equipment ID: {eq_id}</li>' for eq_id in alerts)}
    </ul>
    <p>Please check and take necessary action.</p>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Equipment Idle Alert 🚨"
    msg["From"] = alert_email_sender
    msg["To"] = ", ".join(alert_email_receivers)
    msg.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(alert_email_sender, alert_email_receivers, msg.as_string())
        server.quit()
        print("   ✅ Alert email sent successfully via Gmail!")
    except Exception as e:
        print(f"   ❌ Failed to send alert email: {e}")

    # --- Update alerts log ---
    for eq_id in alerts:
        cursor.execute("""
        INSERT INTO idle_alerts_log (eq_id, last_alert_date)
        VALUES (?, ?)
        ON CONFLICT(eq_id) DO UPDATE SET last_alert_date=excluded.last_alert_date
        """, (eq_id, datetime.now().date()))
    conn.commit()

    print(f"   ✅ Alerts sent and logged for machines: {alerts}")
else:
    print("   ✅ No alerts needed this cycle.")

# Show final alerts log
print("\n4. Final alerts log:")
cursor.execute("SELECT * FROM idle_alerts_log")
results = cursor.fetchall()
if results:
    for row in results:
        print(f"   Equipment {row[0]}: Alert sent on {row[1]}")
else:
    print("   No alerts in log")

conn.close()
print("\n✅ Test completed!")
