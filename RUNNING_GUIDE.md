# SafeRoute - Running Guide

## 🚀 Quick Start

### Prerequisites
- Node.js installed (v14 or higher)
- MongoDB Atlas account (already configured)
- Two terminal windows

---

## 📦 Installation (First Time Only)

### Backend
```powershell
cd backend
npm install
```

### Frontend
```powershell
cd frontend
npm install
```

---

## ▶️ Running the Application

### 1. Start Backend Server

Open **Terminal 1** and run:
```powershell
cd backend
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node server.js`
🚀 SafeRoute API server running on port 5004
📍 Environment: development
✅ MongoDB connected successfully
```

The backend will be available at: **http://localhost:5004**

---

### 2. Start Frontend Server

Open **Terminal 2** and run:
```powershell
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v7.1.11  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

The frontend will be available at: **http://localhost:5173**

---

## 🗄️ MongoDB Atlas Connection

### Current Configuration

Your backend is connected to **MongoDB Atlas** (cloud database):

**Connection Details:**
- **Cluster:** cluster0.ipuhunm.mongodb.net
- **Database:** saferoute
- **Username:** gbnimthera_db_user
- **Password:** Binuri123
- **Connection Status:** ✅ Connected

### Connection String Location
File: `backend/.env`
```env
MONGO_URI=mongodb+srv://gbnimthera_db_user:Binuri123@cluster0.ipuhunm.mongodb.net/saferoute?retryWrites=true&w=majority&appName=Cluster0
```

### How It Works
1. Backend server starts
2. Mongoose connects to MongoDB Atlas using `MONGO_URI`
3. Connection success message appears: "✅ MongoDB connected successfully"
4. All data is stored in the cloud database

---

## 📊 Database Collections

Your MongoDB Atlas database will automatically create these collections:

- **users** - User accounts (from Register/Login)
- **hazards** - Reported hazards
- **routes** - Calculated routes
- **aboutcontents** - About page content
- **teammembers** - Team member profiles
- **faqs** - Frequently asked questions

---

## 🔍 Verify MongoDB Connection

### Option 1: Check Backend Terminal
Look for this message when backend starts:
```
✅ MongoDB connected successfully
```

### Option 2: MongoDB Atlas Dashboard
1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. Click on your cluster (cluster0)
4. Click "Browse Collections"
5. You should see the "saferoute" database

### Option 3: Test API Health
Open browser and visit:
```
http://localhost:5004/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "SafeRoute API is running",
  "timestamp": "2025-10-23T..."
}
```

---

## 🌐 Available API Endpoints

Once backend is running, these APIs are available:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Hazards
- `POST /api/hazards` - Report hazard
- `GET /api/hazards` - Get all hazards
- `GET /api/hazards/nearby` - Get nearby hazards

### Routes
- `POST /api/routes/calculate` - Calculate safe route
- `GET /api/routes/history` - Get route history

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/my-hazards` - Get user's hazards

### Admin Dashboard
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/hazards` - All hazards (admin)
- `GET /api/admin/users` - All users (admin)

### About Page
- `GET /api/about/content` - About page content
- `GET /api/about/team` - Team members
- `GET /api/about/faq` - FAQs

### Upload & Location
- `POST /api/upload/hazard-photo` - Upload photo
- `GET /api/location/search` - Search locations
- `GET /api/location/reverse` - Reverse geocode

---

## 🔐 Test the Full Flow

### 1. Register a User
1. Open frontend: http://localhost:5173
2. Click "Get Started" or "Register"
3. Fill in the form and submit
4. Check MongoDB Atlas - you should see a new user in the `users` collection

### 2. Login
1. Login with the credentials you just created
2. You should be redirected to the dashboard
3. JWT token is stored in localStorage

### 3. Report a Hazard
1. Click "Report Hazard" button
2. Fill in hazard details
3. Submit the report
4. Check MongoDB Atlas - you should see a new document in the `hazards` collection

---

## ⚙️ Environment Variables

### Backend (.env)
```env
PORT=5004
MONGO_URI=mongodb+srv://gbnimthera_db_user:Binuri123@cluster0.ipuhunm.mongodb.net/saferoute
JWT_SECRET=saferoute_secret_key_2025_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5004/api
```

---

## 🛠️ Troubleshooting

### Backend Won't Start
**Problem:** Port 5004 already in use
```
Error: listen EADDRINUSE: address already in use :::5004
```

**Solution:** Kill the process using port 5004
```powershell
# Find the process
netstat -ano | findstr :5004

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
**Problem:** 
```
❌ MongoDB connection error
```

**Solutions:**
1. Check internet connection (MongoDB Atlas requires internet)
2. Verify credentials in `.env` file
3. Check MongoDB Atlas whitelist (add your IP: 0.0.0.0/0 for testing)
4. Ensure password doesn't have special characters

### Frontend API Calls Failing
**Problem:** Network errors or 404

**Solutions:**
1. Ensure backend is running on port 5004
2. Check `.env.local` has correct API URL
3. Open browser console to see error details
4. Verify CORS is enabled in backend (already configured)

---

## 📝 Development Workflow

### Terminal 1 - Backend
```powershell
cd backend
npm run dev
# Leave this running - auto-reloads on file changes
```

### Terminal 2 - Frontend
```powershell
cd frontend
npm run dev
# Leave this running - auto-reloads on file changes
```

### Both servers should be running simultaneously!

---

## 🎯 What's Working Now

✅ Backend API server (Port 5004)
✅ MongoDB Atlas connection
✅ User authentication (Register/Login)
✅ JWT token generation
✅ Password hashing
✅ All API endpoints ready
✅ Frontend development server
✅ CORS enabled
✅ Static file serving (uploads)

---

## 📱 Accessing the Application

1. **Frontend:** http://localhost:5173
2. **Backend API:** http://localhost:5004/api
3. **Health Check:** http://localhost:5004/api/health
4. **Uploaded Files:** http://localhost:5004/uploads/hazards/

---

## 🔄 Stopping the Servers

Press `Ctrl + C` in each terminal to stop the servers.

---

## 📚 Next Steps

1. **Test Registration:** Create a new user account
2. **Test Login:** Login with created credentials
3. **Explore Dashboard:** Navigate through the application
4. **Report Hazard:** Create a test hazard report
5. **Check MongoDB:** View data in MongoDB Atlas dashboard
6. **Test Routes:** Try the safe route calculation feature

---

## 💡 Tips

- Keep both terminals visible to see server logs
- Backend logs show all API requests
- Frontend console shows errors (F12 in browser)
- MongoDB Atlas shows real-time data
- Nodemon auto-restarts backend on code changes
- Vite auto-reloads frontend on code changes

---

## 🆘 Need Help?

If you see errors:
1. Check both terminal windows for error messages
2. Verify MongoDB connection string
3. Ensure both servers are running
4. Check browser console (F12)
5. Verify `.env` and `.env.local` files exist
