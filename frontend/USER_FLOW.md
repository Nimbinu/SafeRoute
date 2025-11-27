# 🚗 SafeRoute - User Flow & Navigation Guide

## Complete User Journey

### 🏠 Step 1: Home Page (`/` or `/home`)
**What you see:**
- SafeRoute logo and branding
- Headline: "Your Guide to Safer Journeys"
- Description about real-time hazard reporting

**Actions available:**
- ✅ Click **"Login"** button → Goes to `/login`
- ✅ Click **"Register"** button → Goes to `/register`

---

### 📝 Step 2: Create an Account (New Users) (`/register`)
**What you see:**
- Registration form with fields:
  - Full Name
  - Email
  - Password (with show/hide toggle)
  - Confirm Password
  - Role dropdown (User/Admin/Moderator)

**Actions available:**
- Fill in all required fields
- ✅ Click **"Sign Up"** button → Creates account and redirects to `/login`
- ✅ Already have account? Click **"Sign in here"** → Goes to `/login`

---

### 🔐 Step 3: Login to Website (`/login`)
**What you see:**
- Login form with:
  - Email field
  - Password field
  - "Forgot Password?" link
  - Google login option
  - Guest mode option

**Actions available:**
- Enter email and password
- ✅ Click **"Login"** button → Goes to `/dashboard` (Map Dashboard)
- ✅ Click **"Login with Google"** → Goes to `/dashboard`
- ✅ Click **"Continue as Guest"** → Goes to `/dashboard`
- ✅ Don't have account? Click **"Sign up here"** → Goes to `/register`

---

### 🗺️ Step 4: Map Dashboard (`/dashboard`)
**What you see:**
- Left Sidebar:
  - SafeRoute logo (clickable)
  - Live Alerts section
  - My Routes
  - Saved Locations
  - Recent Reports list
  - **"Report Hazard"** button (orange)
- Main Area:
  - Search bar
  - Filter pills (All, Pothole, Accident, Flood, Construction, Road Closure)
  - Interactive map with hazard markers
  - Map controls (zoom in/out, location)
- Top Right:
  - **"Safe Route"** button
  - Settings icon
  - Profile icon

**Actions available:**
- ✅ Click **SafeRoute logo** → Goes to `/` (Home)
- ✅ Click **"Report Hazard"** button → Opens Report Hazard Modal
- ✅ Click **"Safe Route"** button → Goes to `/safe-route`
- ✅ Click **Profile icon (👤)** → Goes to `/profile`
- ✅ Click any **hazard icon on map** → View hazard details
- ✅ Use **filter pills** → Filter hazards by type
- ✅ Use **search bar** → Search locations

---

### ⚠️ Step 5: Report a Hazard (Modal)
**What you see:**
- Modal popup with form:
  - Hazard Type dropdown
  - Description textarea
  - Photo upload (optional)
  - Location map (auto-fetched)
  - Submit button

**Actions available:**
- Select hazard type (Pothole, Debris, Flooding, Ice, Accident, etc.)
- Add description
- Upload photo (optional)
- Adjust location on map
- ✅ Click **"Submit Report"** → Submits hazard and closes modal
- ✅ Click **X button** or outside modal → Closes modal
- Returns to Map Dashboard after submission

---

### 🚘 Step 6: Safe Route Planner (`/safe-route`)
**What you see:**
- Left Sidebar:
  - SafeRoute logo (clickable)
  - "Find a Safe Route" form
  - From/To input fields
  - "Find Safe Route" button
  - Route Information cards:
    - Safe Route (distance, time)
    - Normal Route (distance, time)
  - Legend (route colors, hazard zones)
- Main Area:
  - Map showing routes

**Actions available:**
- ✅ Click **SafeRoute logo** → Goes to `/dashboard`
- Enter starting location
- Enter destination
- ✅ Click **"Find Safe Route"** → Calculates and displays safest route
- View route comparison (safe vs normal)
- See hazard zones to avoid

---

### 👤 Step 7: User Profile (`/profile`)
**What you see:**
- Header Navigation:
  - SafeRoute logo
  - Links: Home, Live Map, Safe Route
  - "My Profile" button
  - User avatar (clickable for admin)
- Left Side:
  - Profile card with avatar
  - User name and email
  - "Edit Profile" button
- Right Side:
  - "My Reported Hazards" table
  - Columns: Hazard Type, Date Reported, Status
  - Status badges (Verified, Pending, Resolved)

**Actions available:**
- ✅ Click **"Home"** → Goes to `/` (Home page)
- ✅ Click **"Live Map"** → Goes to `/dashboard`
- ✅ Click **"Safe Route"** → Goes to `/safe-route`
- ✅ Click **User Avatar** → Goes to `/admin` (Admin Dashboard)
- ✅ Click **"Edit Profile"** → Edit profile (to be implemented)
- View all hazards you've reported
- Check status of your reports

---

### 📊 Step 8: Admin Dashboard (`/admin`) - Admin Only
**What you see:**
- Left Sidebar:
  - Admin profile (avatar, name, email)
  - Navigation:
    - Dashboard (active)
    - User Management
    - Settings
  - Logout button (orange)
- Main Area:
  - Stats Cards:
    - Total Reports (1,234)
    - Verified Reports (876)
    - Resolved Reports (543)
  - Filters:
    - Status dropdown (All, Pending, Verified, Resolved)
    - Location search
  - Reports Table:
    - Columns: Report ID, Location, Hazard Type, Reported By, Status, Actions
    - Action buttons: Verify, Resolve, Delete

**Actions available:**
- ✅ Click **"User Management"** → Goes to `/dashboard`
- ✅ Click **"Settings"** → Goes to `/profile`
- ✅ Click **"Logout"** → Goes to `/` (Home page)
- Filter reports by status
- Search reports by location
- ✅ Click **"Verify"** → Changes status to Verified
- ✅ Click **"Resolve"** → Changes status to Resolved
- ✅ Click **"Delete"** → Removes report from system

---

## 📢 Real-Time Features (Automated)

### Notifications & Alerts
- **Live hazard updates**: When someone reports a hazard near your location or saved routes
- **Map updates**: Real-time marker updates as new hazards are reported
- **Status changes**: Get notified when admin verifies or resolves your reports

---

## Complete Navigation Map

```
Home (/)
├─ Login Button → Login (/login)
│                 ├─ Login Success → Map Dashboard (/dashboard)
│                 └─ Sign up link → Register (/register)
│
└─ Register Button → Register (/register)
                     └─ Sign Up Success → Login (/login)

Map Dashboard (/dashboard)
├─ Logo → Home (/)
├─ Report Hazard Button → Report Hazard Modal
│                          └─ Submit → Returns to Dashboard
├─ Safe Route Button → Safe Route Planner (/safe-route)
│                      └─ Logo → Map Dashboard (/dashboard)
├─ Profile Icon → Profile (/profile)
│                 ├─ Home link → Home (/)
│                 ├─ Live Map link → Map Dashboard (/dashboard)
│                 ├─ Safe Route link → Safe Route Planner (/safe-route)
│                 └─ Avatar → Admin Dashboard (/admin)
│                             ├─ User Management → Map Dashboard (/dashboard)
│                             ├─ Settings → Profile (/profile)
│                             └─ Logout → Home (/)
└─ Filter/Search → View filtered hazards on map
```

---

## Page URLs Summary

| Page | URL | Access |
|------|-----|--------|
| Home | `/` or `/home` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Map Dashboard | `/dashboard` | Protected (Login Required) |
| Safe Route Planner | `/safe-route` | Protected (Login Required) |
| User Profile | `/profile` | Protected (Login Required) |
| Admin Dashboard | `/admin` | Protected (Admin Only) |
| About | `/about` | Public |
| Report Hazard | Modal (no route) | Protected (Login Required) |

---

## Key Features by Page

### 🏠 Home
- Brand introduction
- Call-to-action buttons
- Access to login/register

### 🔐 Login
- Email/password authentication
- Google OAuth option
- Guest mode
- Redirect to Map Dashboard

### 📝 Register
- Account creation
- Role selection
- Password validation
- Redirect to Login

### 🗺️ Map Dashboard
- Real-time hazard map
- Filter by hazard type
- Search locations
- Report new hazards
- View recent reports
- Live alerts

### ⚠️ Report Hazard Modal
- Hazard type selection
- Description input
- Photo upload
- Auto-location detection
- Quick submission

### 🚘 Safe Route Planner
- Route input (from/to)
- Safe route calculation
- Route comparison
- Hazard zone visualization
- Distance & time estimates

### 👤 Profile
- User information
- Report history
- Status tracking
- Profile editing

### 📊 Admin Dashboard
- Report management
- Verification system
- User administration
- Statistics overview

---

## Usage Tips

1. **First-time users**: Start at Home → Register → Login → Map Dashboard
2. **Returning users**: Home → Login → Map Dashboard
3. **Report hazards**: Map Dashboard → Report Hazard button
4. **Find safe routes**: Map Dashboard → Safe Route button
5. **Check your reports**: Map Dashboard → Profile icon
6. **Admin tasks**: Profile → Avatar → Admin Dashboard

---

## Technical Notes

- All protected routes require authentication
- Guest mode provides limited access
- Admin access requires admin role
- Real-time updates use Socket.IO (to be connected)
- Google Maps integration (API key needed in .env.local)
- Form validation on all input pages
- Responsive design for mobile/tablet/desktop

---

*Last Updated: October 22, 2025*
