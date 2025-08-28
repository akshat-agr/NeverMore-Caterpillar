# Troubleshooting Data Fetching Issues

## 🚨 Problem: Dashboard Not Loading Data from Backend

If you're seeing sample data instead of real data from the backend, follow these steps:

## 🔍 Step 1: Check Backend Status

1. **Look for the status banner** at the top of your dashboard
2. **Check browser console** (F12 → Console tab) for error messages
3. **Look for the backend status indicator** in the dashboard

## 🖥️ Step 2: Start the Backend Server

### Option A: Using the existing script
```bash
# Windows
start_services.bat

# Mac/Linux
./start_services.sh
```

### Option B: Manual backend start
```bash
cd Backend
python run.py
```

### Option C: Using uvicorn directly
```bash
cd Backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## ✅ Step 3: Verify Backend is Running

1. **Open your browser** and go to: `http://localhost:8000`
2. **You should see**: `{"message": "Welcome to the Smart Rental System API 🚜"}`
3. **Check health endpoint**: `http://localhost:8000/health`
4. **Check API docs**: `http://localhost:8000/docs`

## 🐛 Step 4: Common Issues & Solutions

### Issue: "Backend server is not running"
**Solution**: Start the backend server using one of the methods above

### Issue: "Cannot connect to backend server"
**Solution**: 
- Check if port 8000 is already in use
- Kill any existing processes on port 8000
- Restart the backend server

### Issue: "CORS error"
**Solution**: 
- Ensure backend is running with CORS enabled
- Check that frontend is running on the correct port (5173)

### Issue: "Module not found" errors
**Solution**: 
- Install Python dependencies: `pip install -r requirements.txt`
- Activate virtual environment if using one

## 🔧 Step 5: Test Backend API

Run the test script to verify all endpoints work:
```bash
cd Backend
python test_api.py
```

**Expected output:**
```
Testing NeverMore Caterpillar API...
==================================================
✅ Root endpoint: 200 - {'message': 'Welcome to the Smart Rental System API 🚜'}
✅ Health endpoint: 200 - {'status': 'healthy', 'message': 'API is running'}
✅ Equipment endpoint: 200 - Found 6 equipment
✅ Sites endpoint: 200 - Found 4 sites
✅ Rentals endpoint: 200 - Found 6 rentals
✅ Status endpoint: 200 - Found 6 statuses
==================================================
API testing completed!
```

## 🌐 Step 6: Check Frontend Console

1. **Open browser console** (F12 → Console)
2. **Look for these messages:**
   - ✅ `Backend connection successful`
   - ✅ `Fetching assets from backend...`
   - ✅ `API Success: [data]`

3. **If you see errors:**
   - ❌ `Backend connection failed`
   - ❌ `API request failed`
   - ❌ `Cannot connect to backend server`

## 📊 Step 7: Verify Data Flow

### When Backend is Working:
- **Status Banner**: Shows "✅ Connected - Real-time data active"
- **Asset List**: Shows real equipment data from database
- **KPI Cards**: Shows calculated metrics from real data
- **Console**: Shows API request/response logs

### When Backend is Not Working:
- **Status Banner**: Shows "❌ Disconnected - Using sample data"
- **Asset List**: Shows sample data (6 equipment items)
- **KPI Cards**: Shows sample metrics
- **Console**: Shows connection errors

## 🚀 Quick Fix Commands

### Windows:
```cmd
cd Backend
python run.py
```

### Mac/Linux:
```bash
cd Backend
python3 run.py
```

### Alternative (if run.py doesn't work):
```bash
cd Backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 🔄 After Starting Backend

1. **Wait 5-10 seconds** for server to fully start
2. **Refresh your frontend** (F5 or Ctrl+R)
3. **Check the status banner** - should turn green
4. **Data should automatically refresh** from backend

## 📱 Still Having Issues?

1. **Check both terminals** - ensure both services are running
2. **Verify ports**: Backend on 8000, Frontend on 5173
3. **Check firewall** - ensure ports aren't blocked
4. **Restart both services** completely
5. **Check Python version** - ensure you have Python 3.8+

## 🎯 Expected Result

Once working, you should see:
- ✅ Green status banner: "Connected - Real-time data active"
- ✅ Real equipment data (6 items from database)
- ✅ Real KPI calculations
- ✅ Console logs showing successful API calls
- ✅ No error messages in browser console

---

**Need more help?** Check the browser console for specific error messages and refer to the main README.md for complete setup instructions.
