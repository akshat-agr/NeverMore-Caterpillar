# Setup Guide - NeverMore Caterpillar

This guide will walk you through setting up and running the NeverMore Caterpillar system step by step.

## 🚀 Quick Setup (Windows)

1. **Double-click `start_services.bat`** - This will start both backend and frontend automatically
2. **Wait for both services to start** (about 10-15 seconds)
3. **Open your browser** and go to `http://localhost:5173`

## 🚀 Quick Setup (Mac/Linux)

1. **Make the script executable**: `chmod +x start_services.sh`
2. **Run the script**: `./start_services.sh`
3. **Wait for both services to start** (about 10-15 seconds)
4. **Open your browser** and go to `http://localhost:5173`

## 📋 Manual Setup

### Prerequisites

- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Backend Setup

1. **Open a terminal/command prompt**
2. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

3. **Create a Python virtual environment**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   ```bash
   # Windows
   copy env_example.txt .env
   
   # Mac/Linux
   cp env_example.txt .env
   ```

6. **Edit the .env file** with your actual values (optional for basic setup)

7. **Start the backend server**:
   ```bash
   python run.py
   ```

8. **Verify backend is running** by opening `http://localhost:8000` in your browser

### Step 2: Frontend Setup

1. **Open a new terminal/command prompt**
2. **Navigate to the Frontend directory**:
   ```bash
   cd "Caterpillar FrontEnd"
   ```

3. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   # Windows
   copy env_example.txt .env
   
   # Mac/Linux
   cp env_example.txt .env
   ```

5. **Edit the .env file** with your Clerk publishable key (required for authentication)

6. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

7. **Verify frontend is running** by opening `http://localhost:5173` in your browser

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
DATABASE_URL=sqlite:///./app.db
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Environment Variables (.env)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 🔑 Clerk Authentication Setup

1. **Go to [Clerk.com](https://clerk.com)** and create an account
2. **Create a new application**
3. **Copy your publishable key** from the Clerk dashboard
4. **Paste it in your frontend .env file**

## 🧪 Testing the Setup

### Test Backend API

1. **Navigate to Backend directory**
2. **Run the test script**:
   ```bash
   python test_api.py
   ```

3. **Check the output** - all endpoints should show ✅

### Test Frontend

1. **Open `http://localhost:5173`** in your browser
2. **You should see the login page** (Clerk authentication)
3. **Sign in or create an account**
4. **Navigate to the dashboard** to see real-time data

## 📊 What You'll See

### Dashboard
- **Live Asset List**: Real-time equipment status
- **KPI Cards**: Total assets, utilization rate, overdue items, alerts
- **Construction Map**: Interactive map with equipment locations

### Data
- **6 sample equipment** (Excavators, Bulldozers, Loaders, Crane)
- **4 sample sites** (Construction sites, Mining operations, Depot)
- **6 sample rentals** with operational metrics
- **Real-time status updates** for all equipment

## 🚨 Troubleshooting

### Backend Issues

1. **Port 8000 already in use**:
   ```bash
   # Windows
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:8000 | xargs kill -9
   ```

2. **Database errors**: Delete `app.db` file and restart
3. **Import errors**: Ensure you're in the Backend directory with activated virtual environment

### Frontend Issues

1. **Port 5173 already in use**:
   ```bash
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5173 | xargs kill -9
   ```

2. **Clerk authentication errors**: Check your publishable key in .env
3. **API connection errors**: Ensure backend is running on port 8000

### General Issues

1. **Check both services are running**:
   - Backend: `http://localhost:8000/health`
   - Frontend: `http://localhost:5173`

2. **Check browser console** for JavaScript errors
3. **Check terminal output** for Python errors

## 📱 Accessing the System

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs` (Swagger UI)
- **Health Check**: `http://localhost:8000/health`

## 🔄 Development Workflow

1. **Backend changes**: Save Python files, server auto-reloads
2. **Frontend changes**: Save React files, browser auto-reloads
3. **Database changes**: Restart backend server
4. **New dependencies**: Restart respective service

## 📚 Next Steps

1. **Explore the dashboard** and understand the data flow
2. **Check the API documentation** at `http://localhost:8000/docs`
3. **Modify components** to customize the interface
4. **Add new features** using the existing API structure
5. **Deploy to production** when ready

## 🆘 Need Help?

- **Check the main README.md** for comprehensive documentation
- **Review the API endpoints** in the Swagger documentation
- **Check the browser console** for frontend errors
- **Check the terminal** for backend errors
- **Create an issue** in the repository

---

**🎉 Congratulations!** You now have a fully functional construction equipment rental and tracking system running locally.
