import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000"

def test_endpoint(method, endpoint, expected_status=200, data=None):
    """Test a single endpoint and return the result"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        
        success = response.status_code == expected_status
        result = {
            "success": success,
            "status_code": response.status_code,
            "expected": expected_status,
            "response": response.json() if response.headers.get('content-type') == 'application/json' else response.text,
            "error": None
        }
        
        if not success:
            result["error"] = f"Expected {expected_status}, got {response.status_code}"
            
    except requests.exceptions.ConnectionError:
        result = {
            "success": False,
            "status_code": None,
            "expected": expected_status,
            "response": None,
            "error": "Connection failed - Backend server not running"
        }
    except Exception as e:
        result = {
            "success": False,
            "status_code": None,
            "expected": expected_status,
            "response": None,
            "error": str(e)
        }
    
    return result

def print_result(method, endpoint, result):
    """Print a formatted result"""
    if result["success"]:
        print(f"✅ {method} {endpoint} - {result['status_code']}")
        if result["response"]:
            if isinstance(result["response"], list):
                print(f"   📊 Response: {len(result['response'])} items")
            else:
                print(f"   📊 Response: {result['response']}")
    else:
        print(f"❌ {method} {endpoint} - FAILED")
        print(f"   🚨 Error: {result['error']}")
        if result["status_code"]:
            print(f"   📡 Status: {result['status_code']}")

def test_all_endpoints():
    """Test all API endpoints"""
    print("🧪 Testing NeverMore Caterpillar API Endpoints")
    print("=" * 60)
    
    # Test basic endpoints
    print("\n🔍 Basic Endpoints:")
    print_result("GET", "/", test_endpoint("GET", "/"))
    print_result("GET", "/health", test_endpoint("GET", "/health"))
    
    # Test equipment endpoints
    print("\n🚜 Equipment Endpoints:")
    print_result("GET", "/api/v1/equipment/", test_endpoint("GET", "/api/v1/equipment/"))
    print_result("GET", "/api/v1/equipment/1", test_endpoint("GET", "/api/v1/equipment/1"))
    
    # Test site endpoints
    print("\n🏗️ Site Endpoints:")
    print_result("GET", "/api/v1/sites/", test_endpoint("GET", "/api/v1/sites/"))
    print_result("GET", "/api/v1/sites/1", test_endpoint("GET", "/api/v1/sites/1"))
    
    # Test rental endpoints
    print("\n📋 Rental Endpoints:")
    print_result("GET", "/api/v1/rentals/", test_endpoint("GET", "/api/v1/rentals/"))
    print_result("GET", "/api/v1/rentals/1", test_endpoint("GET", "/api/v1/rentals/1"))
    
    # Test status endpoints
    print("\n📡 Status Endpoints:")
    print_result("GET", "/api/v1/status/", test_endpoint("GET", "/api/v1/status/"))
    print_result("GET", "/api/v1/status/1", test_endpoint("GET", "/api/v1/status/1"))
    
    # Test API documentation
    print("\n📚 API Documentation:")
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ GET /docs - 200 (Swagger UI available)")
        else:
            print(f"❌ GET /docs - {response.status_code}")
    except:
        print("❌ GET /docs - Connection failed")
    
    print("\n" + "=" * 60)
    print("🎯 API Testing Complete!")

if __name__ == "__main__":
    print("🚀 Starting API endpoint tests...")
    print("💡 Make sure your backend server is running on port 8000")
    print()
    
    # Wait a moment for server to be ready
    time.sleep(1)
    
    test_all_endpoints()
