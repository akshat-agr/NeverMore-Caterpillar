import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing NeverMore Caterpillar API...")
    print("=" * 50)
    
    # Test root endpoint
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Root endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
    
    # Test health endpoint
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Health endpoint failed: {e}")
    
    # Test equipment endpoint
    try:
        response = requests.get(f"{BASE_URL}/api/v1/equipment/")
        print(f"✅ Equipment endpoint: {response.status_code} - Found {len(response.json())} equipment")
    except Exception as e:
        print(f"❌ Equipment endpoint failed: {e}")
    
    # Test sites endpoint
    try:
        response = requests.get(f"{BASE_URL}/api/v1/site/")
        print(f"✅ Sites endpoint: {response.status_code} - Found {len(response.json())} sites")
    except Exception as e:
        print(f"❌ Sites endpoint failed: {e}")
    
    # Test rentals endpoint
    try:
        response = requests.get(f"{BASE_URL}/api/v1/rental/")
        print(f"✅ Rentals endpoint: {response.status_code} - Found {len(response.json())} rentals")
    except Exception as e:
        print(f"❌ Rentals endpoint failed: {e}")
    
    # Test status endpoint
    try:
        response = requests.get(f"{BASE_URL}/api/v1/status/")
        print(f"✅ Status endpoint: {response.status_code} - Found {len(response.json())} statuses")
    except Exception as e:
        print(f"❌ Status endpoint failed: {e}")
    
    print("=" * 50)
    print("API testing completed!")

if __name__ == "__main__":
    test_api()
