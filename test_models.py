#!/usr/bin/env python3
"""
Test script to verify Pydantic models work correctly.
Run this to test the data validation before using the main application.
"""

from datetime import date
from pydantic import BaseModel, ConfigDict, ValidationError
from typing import Optional

# Pydantic models (same as in main application)
class EquipmentBase(BaseModel):
    type: str
    manufactured_date: date
    last_maintenance_date: Optional[date] = None
    condition: Optional[str] = None

class EquipmentCreate(EquipmentBase):
    eq_id: int

class EquipmentUpdate(BaseModel):
    type: Optional[str] = None
    manufactured_date: Optional[date] = None
    last_maintenance_date: Optional[date] = None
    condition: Optional[str] = None

class EquipmentResponse(EquipmentBase):
    eq_id: int
    model_config = ConfigDict(from_attributes=True)

def test_valid_equipment():
    """Test valid equipment data"""
    print("Testing valid equipment data...")
    
    valid_data = {
        "eq_id": 1001,
        "type": "Excavator",
        "manufactured_date": "2020-03-15",
        "last_maintenance_date": "2024-01-20",
        "condition": "Good"
    }
    
    try:
        equipment = EquipmentCreate(**valid_data)
        print(f"✅ Valid equipment created: {equipment}")
        return True
    except ValidationError as e:
        print(f"❌ Validation failed: {e}")
        return False

def test_invalid_equipment():
    """Test invalid equipment data"""
    print("\nTesting invalid equipment data...")
    
    invalid_data = {
        "eq_id": "not_a_number",  # Invalid: should be int
        "type": "",  # Invalid: empty string
        "manufactured_date": "invalid-date",  # Invalid: not a date
        "last_maintenance_date": "2024-01-20",
        "condition": "Good"
    }
    
    try:
        equipment = EquipmentCreate(**invalid_data)
        print(f"❌ Invalid data was accepted: {equipment}")
        return False
    except ValidationError as e:
        print(f"✅ Validation correctly rejected invalid data:")
        print(f"   {e}")
        return True

def test_optional_fields():
    """Test equipment with optional fields"""
    print("\nTesting equipment with optional fields...")
    
    minimal_data = {
        "eq_id": 1002,
        "type": "Bulldozer",
        "manufactured_date": "2019-07-22"
        # last_maintenance_date and condition are optional
    }
    
    try:
        equipment = EquipmentCreate(**minimal_data)
        print(f"✅ Equipment with optional fields created: {equipment}")
        print(f"   last_maintenance_date: {equipment.last_maintenance_date}")
        print(f"   condition: {equipment.condition}")
        return True
    except ValidationError as e:
        print(f"❌ Validation failed: {e}")
        return False

def test_equipment_update():
    """Test equipment update model"""
    print("\nTesting equipment update model...")
    
    update_data = {
        "condition": "Excellent",
        "last_maintenance_date": "2024-03-01"
    }
    
    try:
        update = EquipmentUpdate(**update_data)
        print(f"✅ Equipment update created: {update}")
        return True
    except ValidationError as e:
        print(f"❌ Validation failed: {e}")
        return False

def test_json_serialization():
    """Test JSON serialization and deserialization"""
    print("\nTesting JSON serialization...")
    
    equipment_data = {
        "eq_id": 1003,
        "type": "Crane",
        "manufactured_date": "2021-11-08",
        "last_maintenance_date": None,
        "condition": "New"
    }
    
    try:
        # Create from dict
        equipment = EquipmentCreate(**equipment_data)
        
        # Convert to dict
        equipment_dict = equipment.model_dump()
        
        # Convert to JSON string
        equipment_json = equipment.model_dump_json()
        
        print(f"✅ Equipment object: {equipment}")
        print(f"✅ Equipment dict: {equipment_dict}")
        print(f"✅ Equipment JSON: {equipment_json}")
        
        # Test parsing JSON back
        parsed_equipment = EquipmentCreate.model_validate_json(equipment_json)
        print(f"✅ Parsed from JSON: {parsed_equipment}")
        
        return True
    except Exception as e:
        print(f"❌ JSON serialization failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Pydantic Models for Equipment Scanner")
    print("=" * 50)
    
    tests = [
        test_valid_equipment,
        test_invalid_equipment,
        test_optional_fields,
        test_equipment_update,
        test_json_serialization
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {e}")
    
    print("\n" + "=" * 50)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Models are working correctly.")
    else:
        print("⚠️  Some tests failed. Check the output above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
