import sqlite3  # replace with your DB library if needed
from datetime import datetime, timedelta
import smtplib
import pandas as pd
import time

# --- Configuration ---
idle_threshold_days = 7
poll_interval_seconds = 3600 * 24  # check once per day (adjustable)
alert_email_sender = "alert@yourcompany.com"
alert_email_receivers = ["ops-team@yourcompany.com"]

# --- Database connection ---
conn = sqlite3.connect("equipment.db")  # adjust for your DB
cursor = conn.cursor()

# --- Ensure alerts log table exists ---
cursor.execute("""
CREATE TABLE IF NOT EXISTS idle_alerts_log (
    Eq_id INTEGER PRIMARY KEY,
    last_alert_date DATE
)
""")
conn.commit()

# --- Function to check continuous idle streaks ---
def check_idle_streak(group, threshold=7):
    group = group.sort_values("timestamp").reset_index(drop=True)
    max_streak = 0
    streak = 0
    last_date = None
    for _, row in group.iterrows():
        if row["Live_stat"] == "idle":
            current_date = row["timestamp"].date()
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

# --- Polling loop ---
while True:
    print(f"[{datetime.now()}] Polling for idle machines...")

    # --- Load recent live status from DB (last 30 days) ---
    query = """
    SELECT Eq_id, Live_stat, timestamp
    FROM Eq_live_status
    WHERE timestamp >= date('now','-30 day')
    ORDER BY Eq_id, timestamp
    """
    df = pd.read_sql(query, conn)
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    # --- Load last alerts ---
    alerts_log = pd.read_sql("SELECT * FROM idle_alerts_log", conn)

    # --- Check each machine ---
    alerts = []
    for eq_id, group in df.groupby("Eq_id"):
        streak = check_idle_streak(group)
        if streak >= idle_threshold_days:
            last_alert = alerts_log.loc[alerts_log["Eq_id"] == eq_id, "last_alert_date"]
            if last_alert.empty or (datetime.now().date() - pd.to_datetime(last_alert.values[0]).date()).days >= 7:
                alerts.append(eq_id)

    # --- Send alert if needed ---
    if alerts:
        message = f"""Subject: Equipment Idle Alert 🚨

The following machines have been idle for more than {idle_threshold_days} consecutive days:
{alerts}
"""
        with smtplib.SMTP("localhost") as server:
            server.sendmail(alert_email_sender, alert_email_receivers, message)

        # --- Update alerts log ---
        for eq_id in alerts:
            cursor.execute("""
            INSERT INTO idle_alerts_log (Eq_id, last_alert_date)
            VALUES (?, ?)
            ON CONFLICT(Eq_id) DO UPDATE SET last_alert_date=excluded.last_alert_date
            """, (eq_id, datetime.now().date()))
        conn.commit()

        print(f"Alerts sent for machines: {alerts}")
    else:
        print("No alerts needed this cycle.")

    # --- Wait until next poll ---
    time.sleep(poll_interval_seconds)
