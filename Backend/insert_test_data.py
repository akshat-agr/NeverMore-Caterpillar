import sqlite3
from datetime import datetime

# Connect to the database
conn = sqlite3.connect("app.db")
cursor = conn.cursor()

print("=== INSERTING TEST DATA FOR IDLE ALERT TESTING ===\n")

# First, let's check if equipment 101 exists in the equipment table
cursor.execute("SELECT eq_id FROM equipment WHERE eq_id = 101")
if not cursor.fetchone():
    print("Equipment 101 doesn't exist. Creating it first...")
    cursor.execute("""
    INSERT INTO equipment (eq_id, type, manufactured_date, last_maintenance_date, condition)
    VALUES (101, 'Excavator', '2020-03-15', '2024-01-20', 'Good')
    """)
    print("Equipment 101 created successfully!")

# Insert the test data for equipment 101
test_data = [
    (1000, 101, 28.6139, 77.2090, 28.6130, 77.2100, 'idle', '2025-08-21'),
    (1001, 101, 28.6139, 77.2090, 28.6130, 77.2100, 'idle', '2025-08-22'),
    (1002, 101, 28.6139, 77.2090, 28.6130, 77.2100, 'idle', '2025-08-23'),
    (1003, 101, 28.6139, 77.2090, 28.6130, 77.2100, 'idle', '2025-08-24'),
    (1004, 101, 28.6139, 77.2090, 28.6130, 77.2100, 'idle', '2025-08-25'),
    (1005, 101, 28.6139, 77.2090, 28.6130, 77.2100, 'idle', '2025-08-26'),
    (1006, 101, 28.6139, 77.2090, 28.6130, 77.2100, 'idle', '2025-08-27'),
    (1007, 101, 28.6139, 77.2090, 28.6130, 77.2100, 'idle', '2025-08-28'),
    (1008, 101, 28.6139, 77.2090, 28.6130, 77.2100, 'idle', '2025-08-29'),
]

print("Inserting test data for equipment 101...")
for data in test_data:
    try:
        cursor.execute("""
        INSERT INTO eq_live_status
        (status_id, eq_id, latitude, longitude, assigned_latitude, assigned_longitude, live_stat, last_logged_in)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, data)
        print(f"Inserted record {data[0]} for equipment {data[1]} on {data[7]}")
    except sqlite3.IntegrityError as e:
        print(f"Record {data[0]} already exists, skipping...")

conn.commit()
print("\nTest data insertion completed!")

# Verify the data was inserted
print("\nVerifying inserted data:")
cursor.execute("""
SELECT eq_id, live_stat, last_logged_in, status_id
FROM eq_live_status
WHERE eq_id = 101
ORDER BY last_logged_in
""")
results = cursor.fetchall()
for row in results:
    print(f"Equipment {row[0]}: {row[1]} on {row[2]} (ID: {row[3]})")

conn.close()
print("\nTest data ready for idle alert testing!")
