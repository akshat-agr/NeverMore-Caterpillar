#!/usr/bin/env python3
"""
Utility script to generate test QR codes with sample equipment data.
This helps test the QR scanner application.
"""

import json
import qrcode
from datetime import date
import os

def generate_test_qr_codes():
    """Generate test QR codes with sample equipment data"""
    
    # Sample equipment data
    sample_equipment = [
        {
            "eq_id": 1001,
            "type": "Excavator",
            "manufactured_date": "2020-03-15",
            "last_maintenance_date": "2024-01-20",
            "condition": "Good"
        },
        {
            "eq_id": 1002,
            "type": "Bulldozer",
            "manufactured_date": "2019-07-22",
            "last_maintenance_date": "2024-02-10",
            "condition": "Excellent"
        },
        {
            "eq_id": 1003,
            "type": "Crane",
            "manufactured_date": "2021-11-08",
            "last_maintenance_date": None,
            "condition": "New"
        },
        {
            "eq_id": 1004,
            "type": "Wheel Loader",
            "manufactured_date": "2018-05-12",
            "last_maintenance_date": "2024-03-01",
            "condition": "Fair"
        },
        {
            "eq_id": 1005,
            "type": "Dump Truck",
            "manufactured_date": "2022-09-30",
            "last_maintenance_date": "2024-01-15",
            "condition": "Good"
        }
    ]
    
    # Create output directory
    output_dir = "test_qr_codes"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    print(f"Generating test QR codes in '{output_dir}' directory...")
    
    for i, equipment in enumerate(sample_equipment, 1):
        # Convert to JSON string
        json_data = json.dumps(equipment, indent=2)
        
        # Create QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(json_data)
        qr.make(fit=True)
        
        # Create QR code image
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # Save image
        filename = f"{output_dir}/equipment_{equipment['eq_id']}.png"
        qr_image.save(filename)
        
        print(f"Generated: {filename}")
        print(f"Data: {json_data}")
        print("-" * 50)
    
    print(f"\nAll test QR codes generated successfully!")
    print(f"Use these QR codes to test the scanner application.")
    print(f"Files saved in: {os.path.abspath(output_dir)}")

def generate_custom_qr():
    """Generate a custom QR code with user input"""
    
    print("\nGenerate Custom QR Code")
    print("=" * 30)
    
    try:
        eq_id = int(input("Enter Equipment ID: "))
        eq_type = input("Enter Equipment Type: ")
        manufactured_date = input("Enter Manufactured Date (YYYY-MM-DD): ")
        
        # Validate date format
        date.fromisoformat(manufactured_date)
        
        last_maintenance = input("Enter Last Maintenance Date (YYYY-MM-DD) or press Enter for None: ")
        if last_maintenance.strip():
            date.fromisoformat(last_maintenance)
        else:
            last_maintenance = None
        
        condition = input("Enter Condition (or press Enter for None): ")
        if not condition.strip():
            condition = None
        
        equipment = {
            "eq_id": eq_id,
            "type": eq_type,
            "manufactured_date": manufactured_date,
            "last_maintenance_date": last_maintenance,
            "condition": condition
        }
        
        # Generate QR code
        json_data = json.dumps(equipment, indent=2)
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(json_data)
        qr.make(fit=True)
        
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # Save image
        filename = f"custom_equipment_{eq_id}.png"
        qr_image.save(filename)
        
        print(f"\nCustom QR code generated: {filename}")
        print(f"Data: {json_data}")
        
    except ValueError as e:
        print(f"Error: {e}")
        print("Please enter valid data.")
    except Exception as e:
        print(f"Error generating QR code: {e}")

if __name__ == "__main__":
    print("QR Code Generator for Equipment Scanner")
    print("=" * 40)
    
    while True:
        print("\nOptions:")
        print("1. Generate sample test QR codes")
        print("2. Generate custom QR code")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == "1":
            generate_test_qr_codes()
        elif choice == "2":
            generate_custom_qr()
        elif choice == "3":
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")
