import sqlite3
from datetime import datetime, timedelta
import smtplib
import pandas as pd
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# --- Configuration ---
idle_threshold_days = 7
poll_interval_seconds = 60  # check once per minute for demo; set to 86400 for daily
smtp_server = "smtp.gmail.com"
smtp_port = 587
smtp_user = "akshattanmay2004@gmail.com"
smtp_password = "jfrp mcns fmon xhcw"  # Use Gmail App Password if 2FA is enabled
alert_email_sender = smtp_user
alert_email_receivers = ["agrawalakshat1204@gmail.com"]

# --- Database connection ---
# Use the same database as your FastAPI app
conn = sqlite3.connect("app.db")  # Changed from equipment.db to app.db
cursor = conn.cursor()

# --- Ensure alerts log table exists ---
cursor.execute("""
CREATE TABLE IF NOT EXISTS idle_alerts_log (
    eq_id INTEGER PRIMARY KEY,
    last_alert_date DATE
)
""")
conn.commit()

def check_idle_streak(group, threshold=7):
    group = group.sort_values("last_logged_in").reset_index(drop=True)  # Changed from timestamp
    max_streak = 0
    streak = 0
    last_date = None
    for _, row in group.iterrows():
        if row["live_stat"] == "idle":  # Changed from Live_stat
            current_date = row["last_logged_in"].date()  # Changed from timestamp
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

while True:
    print(f"[{datetime.now()}] Polling for idle machines...")

    query = """
    SELECT eq_id, live_stat, last_logged_in
    FROM eq_live_status
    WHERE last_logged_in >= date('now','-30 day')
    ORDER BY eq_id, last_logged_in
    """
    df = pd.read_sql(query, conn)
    # Handle mixed date formats (both YYYY-MM-DD and YYYY-MM-DD HH:MM:SS)
    df["last_logged_in"] = pd.to_datetime(df["last_logged_in"], format='mixed')

    alerts_log = pd.read_sql("SELECT * FROM idle_alerts_log", conn)

    alerts = []
    for eq_id, group in df.groupby("eq_id"):  # Changed from Eq_id
        streak = check_idle_streak(group)
        print(f"Equipment {eq_id}: {streak} consecutive idle days")
        if streak >= idle_threshold_days:
            print(f"  ✅ ALERT TRIGGERED for equipment {eq_id} (streak: {streak})")
            alerts.append(eq_id)
        else:
            print(f"  ❌ No alert needed for equipment {eq_id} (streak: {streak})")

    if alerts:
        # --- Compose HTML email ---
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Equipment Idle Notice - Caterpillar</title>
<style>
  * {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }}

  body {{
    font-family: "Arial", sans-serif;
    background-color: #f5f5f5;
    padding: 20px;
  }}

  .email-container {{
    max-width: 400px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }}

  .header {{
    background-color: #FFCD11;
    padding: 20px;
    text-align: center;
    border-bottom: 2px solid #000000;
  }}

  .logo {{
    font-size: 24px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 8px;
    font-family: "Arial", sans-serif;
  }}

  .title {{
    font-size: 14px;
    color: #000000;
    font-weight: 600;
    font-family: "Arial", sans-serif;
  }}

  .content {{
    padding: 20px;
    font-family: "Arial", sans-serif;
  }}

  .greeting {{
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #000000;
  }}

  .message {{
    font-size: 13px;
    line-height: 1.5;
    color: #333333;
    margin-bottom: 15px;
  }}

  .equipment-box {{
    background-color: #f8f9fa;
    border-left: 4px solid #FFCD11;
    padding: 12px;
    margin: 15px 0;
    font-size: 12px;
  }}

  .detail-line {{
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
  }}

  .detail-label {{
    font-weight: 600;
    color: #000000;
  }}

  .detail-value {{
    color: #333333;
  }}

  .idle-status {{
    background-color: #fff3cd;
    border: 2px solid #FFCD11;
    border-radius: 6px;
    padding: 12px;
    margin: 15px 0;
    text-align: center;
  }}

  .idle-icon {{
    font-size: 24px;
    margin-bottom: 8px;
  }}

  .idle-title {{
    font-size: 13px;
    font-weight: 600;
    color: #856404;
    margin-bottom: 5px;
  }}

  .idle-text {{
    font-size: 12px;
    color: #856404;
  }}

  .button-section {{
    text-align: center;
    margin: 20px 0;
  }}

  .main-button {{
    background-color: #FFCD11;
    color: #000000 !important;
    text-decoration: none;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 4px;
    border: 2px solid #000000;
    display: inline-block;
    text-transform: uppercase;
    margin-bottom: 10px;
  }}

  .main-button:hover {{
    background-color: #000000;
    color: #FFCD11 !important;
  }}

  .secondary-buttons {{
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 12px;
  }}

  .secondary-button {{
    background-color: transparent;
    color: #000000;
    text-decoration: none;
    padding: 8px 16px;
    font-size: 12px;
    border: 1px solid #FFCD11;
    border-radius: 4px;
    font-weight: 600;
  }}

  .secondary-button:hover {{
    background-color: #FFCD11;
  }}

  .cost-info {{
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 12px;
    margin: 15px 0;
    text-align: center;
  }}

  .cost-title {{
    font-size: 12px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 5px;
  }}

  .cost-amount {{
    font-size: 16px;
    font-weight: 700;
    color: #dc3545;
  }}

  .contact-section {{
    background-color: #f8f9fa;
    padding: 15px;
    text-align: center;
    border-top: 2px solid #FFCD11;
  }}

  .contact-title {{
    font-size: 13px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 10px;
  }}

  .contact-grid {{
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    font-size: 11px;
  }}

  .contact-item {{
    text-align: center;
  }}

  .contact-label {{
    color: #666666;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 2px;
  }}

  .contact-value {{
    color: #000000;
    font-weight: 600;
  }}

  .footer {{
    background-color: #000000;
    color: #ffffff;
    padding: 15px;
    text-align: center;
  }}

  .footer-logo {{
    font-size: 18px;
    font-weight: 700;
    color: #FFCD11;
    margin-bottom: 8px;
  }}

  .footer-text {{
    font-size: 11px;
    color: #cccccc;
    margin-bottom: 8px;
  }}

  .footer-links {{
    font-size: 10px;
  }}

  .footer-link {{
    color: #FFCD11;
    text-decoration: none;
    margin: 0 8px;
  }}

  @media only screen and (max-width: 480px) {{
    .email-container {{
      margin: 0;
      max-width: 100%;
    }}
    
    .secondary-buttons {{
      flex-direction: column;
      align-items: center;
    }}
  }}
</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">CATERPILLAR</div>
      <div class="title">Equipment Idle Notice</div>
    </div>

    <div class="content">
      <div class="greeting">Dear Valued Customer,</div>
      
      <div class="message">
        Our monitoring systems indicate that your rented equipment has been idle for an extended period. We would like to discuss your current requirements and optimize your rental arrangement.
      </div>

      <div class="equipment-box">
        <div class="detail-line">
          <span class="detail-label">Equipment Type:</span>
          <span class="detail-value">Excavator CAT 320</span>
        </div>
        <div class="detail-line">
          <span class="detail-label">Rental ID:</span>
          <span class="detail-value">#CAT-2025-08947</span>
        </div>
        <div class="detail-line">
          <span class="detail-label">Idle Duration:</span>
          <span class="detail-value">7 Days</span>
        </div>
        <div class="detail-line">
          <span class="detail-label">Last Activity:</span>
          <span class="detail-value">August 22, 2025</span>
        </div>
        <div class="detail-line">
          <span class="detail-label">Location:</span>
          <span class="detail-value">Construction Site Alpha</span>
        </div>
      </div>

      <div class="idle-status">
        <div class="idle-icon">⚠</div>
        <div class="idle-title">Equipment Currently Idle</div>
        <div class="idle-text">No operational activity detected for the past week</div>
      </div>

      <div class="cost-info">
        <div class="cost-title">Accumulated Idle Charges</div>
        <div class="cost-amount">$2,450.00</div>
      </div>

      <div class="message">
        <strong>Options Available:</strong> If the equipment is no longer needed, we can arrange for immediate pickup to stop further charges. Alternatively, if you require the equipment for upcoming work, please confirm to continue the rental.
      </div>

      <div class="button-section">
        <a href="https://www.caterpillar.com/en.html" class="main-button">Contact Us Now</a>
        
        <div class="secondary-buttons">
          <a href="#" class="secondary-button">Schedule Pickup</a>
          <a href="#" class="secondary-button">Extend Rental</a>
        </div>
      </div>

      <div class="message">
        We appreciate your business with <strong>Caterpillar</strong> and want to ensure you receive maximum value from your equipment rental. Please contact us at your earliest convenience.
      </div>
    </div>

    <div class="contact-section">
      <div class="contact-title">Immediate Response Required</div>
      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-label">Priority Line</div>
          <div class="contact-value">1-800-CAT-IDLE</div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Account Manager</div>
          <div class="contact-value">accounts@caterpillar.com</div>
        </div>
        <div class="contact-item">
          <div class="contact-label">24/7 Support</div>
          <div class="contact-value">1-800-CAT-HELP</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-logo">CATERPILLAR</div>
      <div class="footer-text">Building the World's Infrastructure</div>
      <div class="footer-text">&copy; 2025 Caterpillar Inc. All rights reserved.</div>
      <div class="footer-links">
        <a href="#" class="footer-link">Privacy Policy</a>
        <a href="#" class="footer-link">Terms of Service</a>
        <a href="#" class="footer-link">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>
"""


        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Equipment Idle Alert ��"
        msg["From"] = alert_email_sender
        msg["To"] = ", ".join(alert_email_receivers)
        msg.attach(MIMEText(html_content, "html"))

        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(alert_email_sender, alert_email_receivers, msg.as_string())
            server.quit()
            print("Alert email sent successfully via Gmail!")
        except Exception as e:
            print(f"Failed to send alert email: {e}")

        # --- Update alerts log ---
        for eq_id in alerts:
            cursor.execute("""
            INSERT INTO idle_alerts_log (eq_id, last_alert_date)
            VALUES (?, ?)
            ON CONFLICT(eq_id) DO UPDATE SET last_alert_date=excluded.last_alert_date
            """, (eq_id, datetime.now().date()))
        conn.commit()

        print(f"Alerts sent for machines: {alerts}")
    else:
        print("No alerts needed this cycle.")

    time.sleep(poll_interval_seconds)