import sqlite3
import pandas as pd
from datetime import datetime, timedelta

# Connect to the database
conn = sqlite3.connect("app.db")
cursor = conn.cursor()

print("=== DEBUGGING IDLE ALERT SYSTEM ===\n")

# Check if the test data exists
print("1. Checking current data in eq_live_status table:")
query = """
SELECT eq_id, live_stat, last_logged_in, status_id
FROM eq_live_status
ORDER BY eq_id, last_logged_in
"""
df = pd.read_sql(query, conn)
print(df.to_string(index=False))
print(f"\nTotal records: {len(df)}")

# Check the idle threshold logic
print("\n2. Testing idle streak calculation:")
idle_threshold_days = 7

def check_idle_streak(group, threshold=7):
    group = group.sort_values("last_logged_in").reset_index(drop=True)
    max_streak = 0
    streak = 0
    last_date = None
    
    print(f"  Processing equipment {group['eq_id'].iloc[0]}:")
    for _, row in group.iterrows():
        if row["live_stat"] == "idle":
            current_date = pd.to_datetime(row["last_logged_in"], format='mixed').date()
            print(f"    Date: {current_date}, Status: {row['live_stat']}, Last date: {last_date}")
            
            if last_date is None or (current_date - last_date).days == 1:
                streak += 1
                print(f"      Streak continues: {streak}")
            else:
                streak = 1
                print(f"      New streak starts: {streak}")
            last_date = current_date
            max_streak = max(max_streak, streak)
        else:
            streak = 0
            last_date = None
            print(f"    Date: {pd.to_datetime(row['last_logged_in'], format='mixed').date()}, Status: {row['live_stat']}, Streak reset to 0")
    
    print(f"  Max streak for equipment {group['eq_id'].iloc[0]}: {max_streak}")
    return max_streak

# Test the streak calculation for each equipment
for eq_id, group in df.groupby("eq_id"):
    streak = check_idle_streak(group)
    if streak >= idle_threshold_days:
        print(f"  ✅ ALERT SHOULD BE TRIGGERED for equipment {eq_id} (streak: {streak})")
    else:
        print(f"  ❌ No alert for equipment {eq_id} (streak: {streak})")

# Check the date range filter
print("\n3. Testing date range filter:")
current_date = datetime.now().date()
thirty_days_ago = current_date - timedelta(days=30)
print(f"Current date: {current_date}")
print(f"30 days ago: {thirty_days_ago}")

# Check if any records are outside the 30-day window
df["last_logged_in_date"] = pd.to_datetime(df["last_logged_in"], format='mixed').dt.date
outside_range = df[df["last_logged_in_date"] < thirty_days_ago]
if not outside_range.empty:
    print(f"Records outside 30-day window: {len(outside_range)}")
    print(outside_range[["eq_id", "last_logged_in_date"]].to_string(index=False))
else:
    print("All records are within 30-day window")

# Check the alerts log table
print("\n4. Checking idle_alerts_log table:")
try:
    alerts_log = pd.read_sql("SELECT * FROM idle_alerts_log", conn)
    print(alerts_log.to_string(index=False))
except:
    print("idle_alerts_log table doesn't exist yet")

conn.close()
