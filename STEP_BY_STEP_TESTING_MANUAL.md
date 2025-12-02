# 🧪 SafeRoute - Step-by-Step Testing Manual

## 📋 What You'll Need

Before starting, make sure:
- ✅ Backend server is running on http://localhost:5004
- ✅ Frontend server is running on http://localhost:3000
- ✅ MongoDB is connected
- ✅ You have a browser open (Chrome/Firefox recommended)

---

## 🎯 STEP-BY-STEP TESTING GUIDE

---

## PART 1: REGISTRATION PAGE

### Step 1: Open Registration Page
1. Open browser
2. Go to: `http://localhost:3000/register`
3. You should see a registration form

### Step 2: Test Valid Registration
**What to type:**
- Full Name: `John Smith`
- Email: `john.smith@gmail.com`
- Password: `Test123456`
- Confirm Password: `Test123456`

**What to click:**
1. Click "Register" button

**What should happen:**
✅ Success message appears
✅ You are redirected to dashboard page
✅ You see "Welcome, John Smith" at the top

---

### Step 3: Test Empty Form (Error Testing)
1. Click browser back button OR logout
2. Go to: `http://localhost:3000/register`

**What to type:**
- Leave ALL fields empty

**What to click:**
1. Click "Register" button

**What should happen:**
❌ Error messages appear under each field:
- "Full name is required"
- "Email is required"  
- "Password is required"
- "Please confirm password"

---

### Step 4: Test Password Mismatch
**What to type:**
- Full Name: `Test User`
- Email: `test.user@gmail.com`
- Password: `Password123`
- Confirm Password: `Password456` (different!)

**What to click:**
1. Click "Register" button

**What should happen:**
❌ Error message: "Passwords do not match"

---

### Step 5: Test Duplicate Email
**What to type:**
- Full Name: `Another User`
- Email: `john.smith@gmail.com` (already registered!)
- Password: `Test123456`
- Confirm Password: `Test123456`

**What to click:**
1. Click "Register" button

**What should happen:**
❌ Error message: "Email already exists" or "User already registered"

---

## PART 2: LOGIN PAGE

### Step 6: Test Valid Login
1. Go to: `http://localhost:3000/login`

**What to type:**
- Email: `john.smith@gmail.com`
- Password: `Test123456`

**What to click:**
1. Click "Login" button

**What should happen:**
✅ Success message
✅ Redirected to dashboard
✅ See "Welcome, John Smith"

---

### Step 7: Test Wrong Password
1. Logout (click your name → Logout)
2. Go to: `http://localhost:3000/login`

**What to type:**
- Email: `john.smith@gmail.com`
- Password: `WrongPassword123` (incorrect!)

**What to click:**
1. Click "Login" button

**What should happen:**
❌ Error message: "Invalid email or password"
❌ Stay on login page

---

### Step 8: Test Non-Existent Email
**What to type:**
- Email: `nobody@gmail.com` (not registered!)
- Password: `Test123456`

**What to click:**
1. Click "Login" button

**What should happen:**
❌ Error message: "Invalid email or password"

---

### Step 9: Test Empty Login
**What to type:**
- Leave both fields empty

**What to click:**
1. Click "Login" button

**What should happen:**
❌ Error messages appear

---

## PART 3: MAP DASHBOARD (Main Page)

### Step 10: Access Dashboard
1. Login with: `john.smith@gmail.com` / `Test123456`
2. You should be on dashboard automatically

**What you should see:**
✅ A map (Leaflet or Google Maps)
✅ "Report Hazard" button
✅ Your name in header
✅ Navigation menu

---

### Step 11: Test Location Permission - ALLOW
**What to do:**
1. When browser asks "Allow location access?"
2. Click "Allow"

**What should happen:**
✅ Map centers on your current location
✅ Blue marker appears where you are
✅ Nearby hazards appear on map
✅ Location name shown (e.g., "Colombo, Sri Lanka")

---

### Step 12: Test Location Permission - BLOCK
**What to do:**
1. Refresh the page (F5)
2. When browser asks "Allow location access?"
3. Click "Block" or "Deny"

**What should happen:**
✅ Map shows default location (probably center of Colombo)
✅ Message: "Location access denied" or similar
✅ You can still use the map manually

---

## PART 4: REPORT HAZARD

### Step 13: Report Your First Hazard - Pothole
**What to click:**
1. Click "Report Hazard" button

**What you should see:**
✅ Modal/popup opens with a form

**What to type/select:**
- Type: Select "Pothole" from dropdown
- Description: `Large pothole on Main Street causing damage to vehicles`
- Severity: Select "High"
- Location: Click "Use My Current Location" button
  OR manually enter:
  - Latitude: `6.9271`
  - Longitude: `79.8612`
  - Address: `Main Street, Colombo`

**Optional:**
- Upload a photo (any image from your computer)

**What to click:**
1. Click "Submit" or "Report Hazard" button

**What should happen:**
✅ Success message: "Hazard reported successfully"
✅ Modal closes
✅ New marker appears on map (orange/yellow color)
✅ Status is "Pending"

---

### Step 14: Report Second Hazard - Accident
**What to click:**
1. Click "Report Hazard" button again

**What to type/select:**
- Type: Select "Accident"
- Description: `Two-vehicle collision blocking left lane`
- Severity: Select "High"
- Location: Click on a different spot on the map
  OR enter different coordinates:
  - Latitude: `6.9312`
  - Longitude: `79.8508`

**What to click:**
1. Click "Submit"

**What should happen:**
✅ Another marker appears
✅ Different icon/color for accident

---

### Step 15: Report Third Hazard - Traffic Jam
**What to type/select:**
- Type: Select "Traffic Jam"
- Description: `Heavy traffic due to construction`
- Severity: Select "Medium"

**What should happen:**
✅ Third marker on map
✅ Different color for medium severity

---

### Step 16: View Hazard Details
**What to click:**
1. Click on any hazard marker on the map

**What should happen:**
✅ Popup appears showing:
- Hazard type and icon
- Description
- Location/address
- Severity level
- Status (Pending/Verified)
- Reported by (your name)
- Time (e.g., "2 hours ago")

---

## PART 5: FILTER & SEARCH

### Step 17: Filter Hazards
**What to click:**
1. Look for "Filter" button or dropdown

**What to select:**
- Check: ✓ Pothole
- Check: ✓ Accident
- Uncheck: ☐ Traffic Jam
- Uncheck: ☐ Construction

**What should happen:**
✅ Only pothole and accident markers visible
✅ Traffic jam markers hidden
✅ Count updates (e.g., "Showing 2 of 3 hazards")

---

### Step 18: Search for Location
**What to type:**
1. Find the search bar
2. Type: `Galle Face Green`

**What should happen:**
✅ Suggestions appear as you type
✅ Click on suggestion
✅ Map jumps to that location
✅ Map centers on Galle Face Green

---

### Step 19: Search Invalid Location
**What to type:**
1. Type: `XYZ12345InvalidPlace`

**What should happen:**
❌ No suggestions OR
❌ "Location not found"

---

## PART 6: SAFE ROUTE PLANNING

### Step 20: Plan a Route
**What to click:**
1. Click "Safe Route" in navigation menu

**What you should see:**
✅ Route planning page with two input boxes

**What to type:**
- From: `Colombo Fort`
- To: `Mount Lavinia`

**What to click:**
1. Click "Find Route" button

**What should happen:**
✅ Route drawn on map (blue line)
✅ Route summary shows:
  - Distance (e.g., "12.5 km")
  - Estimated time (e.g., "25 minutes")
  - Number of hazards on route
✅ List of hazards along the route
✅ Alternative routes shown (if available)

---

### Step 21: Save the Route
**What to click:**
1. Click "Save Route" button

**What to type:**
- Route Name: `Daily Commute to Office`

**What to click:**
1. Click "Save"

**What should happen:**
✅ Success message: "Route saved"
✅ Route appears in "Saved Routes" section

---

### Step 22: View Saved Routes
**What to click:**
1. Go to Profile page OR Saved Routes page

**What you should see:**
✅ List of your saved routes
✅ "Daily Commute to Office" appears
✅ Showing origin and destination
✅ Option to delete or view route

---

## PART 7: PROFILE PAGE

### Step 23: Access Profile
**What to click:**
1. Click your name in header OR
2. Click "Profile" in navigation menu

**What you should see:**
✅ Your profile information:
  - Name: John Smith
  - Email: john.smith@gmail.com
  - Role: User
  - Member since: (today's date)
✅ Your reported hazards list
✅ Your saved routes list
✅ Edit button

---

### Step 24: Edit Profile
**What to click:**
1. Click "Edit Profile" button

**What to type:**
- Full Name: `John Smith Updated`
- Phone: `+94 77 123 4567`

**What to click:**
1. Click "Choose File" to upload profile picture
2. Select any image from your computer
3. Click "Save Changes"

**What should happen:**
✅ Success message: "Profile updated"
✅ Name changes to "John Smith Updated"
✅ Profile picture appears
✅ Header shows updated name

---

### Step 25: View My Reports
**What to do:**
1. Scroll down on profile page

**What you should see:**
✅ List of all hazards you reported (3 hazards)
✅ Each showing:
  - Type (Pothole, Accident, Traffic Jam)
  - Description
  - Status (Pending)
  - Date reported

---

## PART 8: NAVIGATION TESTING

### Step 26: Test All Menu Links
**What to click (one by one):**
1. Click "Dashboard" → Should show map
2. Click "Safe Route" → Should show route planner
3. Click "Profile" → Should show your profile
4. Click "About" (if exists) → Should show about page

**What should happen:**
✅ Each page loads without errors
✅ URL changes correctly
✅ Content displays properly

---

## PART 9: LOGOUT

### Step 27: Logout
**What to click:**
1. Click your name in header
2. Click "Logout"

**What should happen:**
✅ Logged out successfully
✅ Redirected to login page
✅ Cannot access dashboard without logging in

---

## PART 10: MODERATOR TESTING

### Step 28: Create Moderator Account
**What to do:**
1. Open PowerShell in backend folder
2. Type and run:

```powershell
node
```

Then type:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI);

async function createModerator() {
  const mod = await User.create({
    fullName: 'Mike Moderator',
    email: 'moderator@saferoute.com',
    password: 'Moderator123',
    role: 'moderator'
  });
  console.log('Moderator created:', mod.email);
  process.exit(0);
}

createModerator();
```

Press Enter after each line.

---

### Step 29: Login as Moderator
**What to do:**
1. Go to: `http://localhost:3000/login`

**What to type:**
- Email: `moderator@saferoute.com`
- Password: `Moderator123`

**What to click:**
1. Click "Login"

**What should happen:**
✅ Login successful
✅ Different dashboard (if moderator view exists)
✅ Can see "Hazard Management" or "Verify Reports"

---

### Step 30: Verify a Hazard
**What to click:**
1. Go to "Hazard Management" or "Pending Reports"

**What you should see:**
✅ List of pending hazards (the 3 you reported)

**What to do:**
1. Click on first hazard (Pothole)
2. Review details
3. Click "Verify" or "Approve" button

**What should happen:**
✅ Hazard status changes to "Verified"
✅ Hazard appears on public map
✅ Marker color changes (green for verified)

---

### Step 31: Reject a Spam Report
**What to do:**
1. Find a hazard in pending list
2. Click "Reject" button

**What to type:**
- Reason: `Insufficient information provided`

**What to click:**
1. Click "Confirm Reject"

**What should happen:**
✅ Hazard removed from pending list
✅ Does not appear on public map
✅ Success message shown

---

## PART 11: ADMIN TESTING

### Step 32: Create Admin Account
**In PowerShell backend folder:**

```powershell
node makeAdmin.js
```

**What to type when asked:**
- Email: `admin@saferoute.com`

OR create new admin:

```javascript
// In node terminal
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const admin = await User.create({
    fullName: 'Admin Boss',
    email: 'admin@saferoute.com',
    password: 'Admin123456',
    role: 'admin'
  });
  console.log('Admin created:', admin.email);
  process.exit(0);
}

createAdmin();
```

---

### Step 33: Login as Admin
**What to type:**
- Email: `admin@saferoute.com`
- Password: `Admin123456`

**What should happen:**
✅ Login successful
✅ Can access Admin Dashboard

---

### Step 34: Access Admin Dashboard
**What to do:**
1. Go to: `http://localhost:3000/admin`

**What you should see:**
✅ Admin dashboard with statistics:
  - Total users
  - Total hazards
  - Pending reports
  - Active moderators
✅ Tabs: Users | Hazards | Reports | Settings

---

### Step 35: View All Users
**What to click:**
1. Click "Users" tab

**What you should see:**
✅ Table with all users:
  - John Smith Updated (User)
  - Mike Moderator (Moderator)
  - Admin Boss (Admin)
✅ Each showing email, role, status, join date

---

### Step 36: Promote User to Moderator
**What to do:**
1. Find "John Smith Updated" in users table
2. Click "Actions" dropdown OR click on user
3. Click "Change Role"

**What to select:**
- New Role: Select "Moderator"

**What to click:**
1. Click "Update Role"

**What should happen:**
✅ Success message
✅ John's role changes to "Moderator"
✅ Can now verify hazards

---

### Step 37: Suspend a User
**What to do:**
1. Find any user in the list
2. Click "Actions" → "Suspend"

**What to type:**
- Reason: `Testing suspension feature`

**What to click:**
1. Click "Confirm"

**What should happen:**
✅ User status changes to "Suspended"
✅ User cannot login anymore

**Test suspension:**
1. Logout
2. Try to login with suspended user
3. Should see: "Account suspended"

---

### Step 38: View All Hazards (Admin)
**What to click:**
1. Click "Hazards" tab

**What you should see:**
✅ All hazards from all users
✅ Filter by status: All | Pending | Verified | Rejected
✅ Filter by type: All types
✅ Search bar

---

### Step 39: Bulk Verify Hazards
**What to do:**
1. Select checkboxes next to multiple pending hazards
2. Click "Bulk Actions"
3. Click "Verify Selected"

**What should happen:**
✅ All selected hazards verified at once
✅ Success message: "5 hazards verified"

---

### Step 40: Delete a Hazard
**What to do:**
1. Find any hazard
2. Click "Delete" button
3. Confirm deletion

**What should happen:**
✅ Hazard removed from database
✅ Removed from map
✅ Success message shown

---

## PART 12: EDGE CASES & ERROR TESTING

### Step 41: Test Long Description
**What to do:**
1. Try to report hazard
2. In description, paste:
```
This is a very long description that goes on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on
```

**What should happen:**
✅ Either accepts it OR
❌ Shows error: "Description too long (max 500 characters)"

---

### Step 42: Test Special Characters
**What to type in description:**
```
Test @#$%^&*()_+{}[]|\"'<>?/~`
```

**What should happen:**
✅ Accepts input
✅ Does not break the page
✅ Characters stored correctly

---

### Step 43: Test File Upload Size
**What to do:**
1. Try to upload very large image (> 5MB)

**What should happen:**
❌ Error: "File too large (max 5MB)"

---

### Step 44: Test Invalid File Type
**What to do:**
1. Try to upload .exe or .txt file as photo

**What should happen:**
❌ Error: "Invalid file type. Only images allowed"

---

### Step 45: Test Network Error
**What to do:**
1. Stop backend server (Ctrl+C in backend terminal)
2. Try to report hazard

**What should happen:**
❌ Error message: "Network error" or "Cannot connect to server"

---

### Step 46: Test Session Timeout
**What to do:**
1. Login
2. Wait 24 hours OR manually delete token from browser:
   - Press F12 → Application → Local Storage
   - Delete "token"
3. Try to access dashboard

**What should happen:**
❌ Redirected to login page
❌ Message: "Session expired. Please login again"

---

### Step 47: Test Browser Back Button
**What to do:**
1. Login → Dashboard → Profile → Safe Route
2. Click browser back button multiple times

**What should happen:**
✅ Each page loads correctly
✅ No errors
✅ State maintained

---

### Step 48: Test Page Refresh
**What to do:**
1. While on dashboard, press F5 (refresh)

**What should happen:**
✅ Page reloads
✅ Still logged in
✅ Map loads again
✅ Markers appear

---

## ✅ TESTING CHECKLIST

Copy this list and check off as you test:

### Registration
- [ ] Register with valid data → Success
- [ ] Empty form → Errors shown
- [ ] Password mismatch → Error
- [ ] Duplicate email → Error

### Login
- [ ] Login valid credentials → Success
- [ ] Wrong password → Error
- [ ] Non-existent email → Error
- [ ] Empty form → Errors

### Map & Location
- [ ] Allow location → Map centers on me
- [ ] Deny location → Default view shown
- [ ] Markers appear on map
- [ ] Click marker → Popup shows

### Report Hazard
- [ ] Report pothole → Success
- [ ] Report accident → Success
- [ ] Report traffic jam → Success
- [ ] Upload photo → Success
- [ ] Empty form → Errors

### Filter & Search
- [ ] Filter by type → Works
- [ ] Search location → Found
- [ ] Invalid search → Error

### Routes
- [ ] Plan route → Route shown
- [ ] Save route → Saved successfully
- [ ] View saved routes → List shown

### Profile
- [ ] View profile → Details shown
- [ ] Edit name → Updated
- [ ] Upload photo → Displayed
- [ ] View my reports → List shown

### Navigation
- [ ] All menu links work
- [ ] Browser back button works
- [ ] Page refresh works

### Logout
- [ ] Logout → Redirected to login
- [ ] Cannot access dashboard after logout

### Moderator
- [ ] Login as moderator → Success
- [ ] Verify hazard → Status changed
- [ ] Reject report → Removed

### Admin
- [ ] Login as admin → Access granted
- [ ] View all users → Table shown
- [ ] Promote user → Role changed
- [ ] Suspend user → Cannot login
- [ ] View all hazards → List shown
- [ ] Bulk verify → All verified
- [ ] Delete hazard → Removed

### Edge Cases
- [ ] Long text → Handled
- [ ] Special characters → Handled
- [ ] Large file → Error shown
- [ ] Invalid file type → Error
- [ ] Network error → Error message
- [ ] XSS attempt → Sanitized

---

## 🎉 TESTING COMPLETE!

If all checkboxes are ✅ checked, your website is working properly!

### Common Issues & Solutions:

**Problem:** "Network error" on all requests
**Solution:** Check backend server is running on port 5004

**Problem:** Login fails even with correct password
**Solution:** Check MongoDB connection

**Problem:** Map doesn't load
**Solution:** Check API keys in environment variables

**Problem:** Photos don't upload
**Solution:** Check uploads folder exists and has write permissions

---

## 📝 Quick Test Data Reference

Use these anytime:

**User Account:**
- Email: `john.smith@gmail.com`
- Password: `Test123456`

**Moderator Account:**
- Email: `moderator@saferoute.com`
- Password: `Moderator123`

**Admin Account:**
- Email: `admin@saferoute.com`
- Password: `Admin123456`

**Test Locations:**
- Colombo Fort: `6.9344, 79.8428`
- Galle Face: `6.9271, 79.8456`
- Mount Lavinia: `6.8373, 79.8636`

**Sample Hazard:**
- Type: Pothole
- Description: Large pothole causing vehicle damage
- Severity: High
- Location: Use current location or above coordinates

---

**Good luck testing! 🧪✨**
