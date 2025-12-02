# 🧪 SafeRoute Complete Testing Guide - Step by Step with Exact Data

## 🚀 START HERE

**Before you begin:**
1. Make sure backend is running: `http://localhost:5004`
2. Make sure frontend is running: `http://localhost:3000`
3. Open browser (Chrome/Firefox)
4. Have this file open to copy data

---

# STEP 1: TEST REGISTRATION PAGE

### What to do:
1. Open browser
2. Go to: `http://localhost:3000/register`

### What to enter:

**Field 1 - Full Name:**
```
John Smith
```

**Field 2 - Email:**
```
john.smith@gmail.com
```

**Field 3 - Password:**
```
Test123456
```

**Field 4 - Confirm Password:**
```
Test123456
```

### What to click:
- Click the **"Register"** button

### What should happen:
✅ Success message appears  
✅ You go to dashboard page automatically  
✅ You see "Welcome, John Smith" at top

---

# STEP 2: TEST REGISTRATION ERRORS

### A) Test Empty Form

**What to do:**
1. Click browser back button OR logout
2. Go to: `http://localhost:3000/register`
3. Leave ALL fields empty
4. Click **"Register"** button

**What should happen:**
❌ Red error messages appear under each empty field

---

### B) Test Password Mismatch

**What to enter:**

**Full Name:**
```
Test User
```

**Email:**
```
test.user@gmail.com
```

**Password:**
```
Password123
```

**Confirm Password:**
```
Password456
```
(Notice: Different password!)

**Click:** Register button

**What should happen:**
❌ Error: "Passwords do not match"

---

### C) Test Duplicate Email

**What to enter:**

**Full Name:**
```
Another Person
```

**Email:**
```
john.smith@gmail.com
```
(Same email we used before!)

**Password:**
```
Test123456
```

**Confirm Password:**
```
Test123456
```

**Click:** Register button

**What should happen:**
❌ Error: "Email already exists" or "User already registered"

---

# STEP 3: TEST LOGIN - VALID

### What to do:
1. Go to: `http://localhost:3000/login`

### What to enter:

**Email:**
```
john.smith@gmail.com
```

**Password:**
```
Test123456
```

### What to click:
- Click **"Login"** button

### What should happen:
✅ Success message  
✅ Go to dashboard  
✅ See "Welcome, John Smith"

---

# STEP 4: TEST LOGIN - WRONG PASSWORD

### What to do:
1. Logout (click your name → Logout)
2. Go to: `http://localhost:3000/login`

### What to enter:

**Email:**
```
john.smith@gmail.com
```

**Password:**
```
WrongPassword999
```
(Wrong password on purpose!)

### What to click:
- Click **"Login"** button

### What should happen:
❌ Error: "Invalid email or password"  
❌ Stay on login page

---

# STEP 5: TEST LOGIN - WRONG EMAIL

### What to enter:

**Email:**
```
nobody@gmail.com
```
(Email that doesn't exist!)

**Password:**
```
Test123456
```

### What to click:
- Click **"Login"** button

### What should happen:
❌ Error: "Invalid email or password"

---

# STEP 6: ALLOW LOCATION PERMISSION

### What to do:
1. Make sure you're logged in as `john.smith@gmail.com`
2. You should be on the dashboard with a map
3. Browser will ask: **"Allow location access?"**

### What to click:
- Click **"Allow"**

### What should happen:
✅ Map centers on your current location  
✅ Blue marker appears where you are  
✅ Nearby hazards show on map  
✅ Location name displays (e.g., "Colombo, Sri Lanka")

---

# STEP 7: REPORT FIRST HAZARD - POTHOLE

### What to click:
1. Click **"Report Hazard"** button on the map

### What should appear:
✅ A popup/modal form opens

### What to enter:

**Field 1 - Type:**
```
Select: Pothole
```
(Click dropdown, select "Pothole")

**Field 2 - Description:**
```
Large pothole on Main Street near the intersection causing vehicle damage. Approximately 30cm deep and 50cm wide.
```

**Field 3 - Severity:**
```
Select: High
```
(Click dropdown, select "High")

**Field 4 - Location:**

**Option A:** Click **"Use My Current Location"** button

OR

**Option B:** Enter manually:

**Latitude:**
```
6.9271
```

**Longitude:**
```
79.8612
```

**Address:**
```
Main Street, Colombo 01
```

**Field 5 - Photo (Optional):**
- Click "Choose File" or "Upload"
- Select any image from your computer (jpg, png)

### What to click:
- Click **"Submit"** or **"Report Hazard"** button at bottom

### What should happen:
✅ Success message: "Hazard reported successfully"  
✅ Modal closes  
✅ New marker appears on map (orange/yellow color)  
✅ Status shows "Pending"

---

# STEP 8: REPORT SECOND HAZARD - ACCIDENT

### What to click:
1. Click **"Report Hazard"** button again

### What to enter:

**Type:**
```
Select: Accident
```

**Description:**
```
Two-vehicle collision blocking the left lane. Traffic moving slowly. Emergency services on site.
```

**Severity:**
```
Select: High
```

**Location - Latitude:**
```
6.9312
```

**Location - Longitude:**
```
79.8508
```

**Address:**
```
Galle Road, Colombo 03
```

### What to click:
- Click **"Submit"**

### What should happen:
✅ Another marker appears on map  
✅ Different icon for accident (🚗)

---

# STEP 9: REPORT THIRD HAZARD - TRAFFIC JAM

### What to click:
1. Click **"Report Hazard"** button

### What to enter:

**Type:**
```
Select: Traffic Jam
```

**Description:**
```
Heavy traffic on Highway 1 due to ongoing road construction. Expect delays of 15-20 minutes.
```

**Severity:**
```
Select: Medium
```

**Latitude:**
```
6.9497
```

**Longitude:**
```
79.8500
```

**Address:**
```
Kandy Road, Colombo 10
```

### What to click:
- Click **"Submit"**

### What should happen:
✅ Third marker on map  
✅ Yellow/orange color for medium severity

---

# STEP 10: VIEW HAZARD DETAILS

### What to click:
1. Click on any hazard marker on the map (the pothole you created)

### What should appear:
✅ Popup showing:
- 🕳️ Pothole (icon and type)
- Description: "Large pothole on Main Street..."
- Location: "Main Street, Colombo 01"
- Severity: High
- Status: Pending
- Reported by: John S. (your name)
- Time: "5 minutes ago" (or similar)

---

# STEP 11: FILTER HAZARDS

### What to click:
1. Look for **"Filter"** button or icon on map
2. Click it

### What to select:
**Check these:**
- ✓ Pothole
- ✓ Accident

**Uncheck these:**
- ☐ Traffic Jam
- ☐ Construction
- ☐ Flooding

### What to click:
- Click **"Apply"** or close filter menu

### What should happen:
✅ Only pothole and accident markers visible  
✅ Traffic jam marker disappears  
✅ Count shows: "Showing 2 of 3 hazards"

---

# STEP 12: SEARCH FOR LOCATION

### What to do:
1. Find the search bar on the map page

### What to type:

**In search bar, type:**
```
Galle Face Green
```

### What should happen:
✅ Suggestions appear as you type  
✅ See "Galle Face Green" in dropdown

### What to click:
- Click on **"Galle Face Green"** suggestion

### What should happen:
✅ Map jumps to Galle Face Green  
✅ Map centers on that location  
✅ Zoom level increases

---

# STEP 13: SEARCH INVALID LOCATION

### What to type:

**In search bar, type:**
```
XYZ12345InvalidPlace
```

### What should happen:
❌ "No results found" OR  
❌ "Location not found. Please try another search."

---

# STEP 14: PLAN A ROUTE

### What to click:
1. Click **"Safe Route"** in the navigation menu

### What should appear:
✅ Route planning page with two search boxes

### What to enter:

**From (Starting point):**
```
Colombo Fort
```

**To (Destination):**
```
Mount Lavinia
```

### What to click:
- Click **"Find Route"** button

### What should happen:
✅ Blue line drawn on map showing route  
✅ Route summary box appears showing:
  - Distance: "12.5 km" (approximately)
  - Time: "25 minutes" (approximately)
  - Hazards on route: "2 hazards"  
✅ List of hazards along the route  
✅ Turn-by-turn directions

---

# STEP 15: SAVE THE ROUTE

### What to click:
1. Click **"Save Route"** button (appears after route is planned)

### What should appear:
✅ Popup asking for route name

### What to enter:

**Route Name:**
```
Daily Commute to Office
```

### What to click:
- Click **"Save"** button

### What should happen:
✅ Success: "Route saved successfully"  
✅ Route appears in your saved routes list

---

# STEP 16: VIEW SAVED ROUTES

### What to click:
1. Click **"Profile"** in navigation menu  
   OR  
2. Click your name at the top  
   OR  
3. Go to "Saved Routes" section

### What should appear:
✅ List of your saved routes  
✅ "Daily Commute to Office" is listed  
✅ Shows "From: Colombo Fort → To: Mount Lavinia"  
✅ Delete/View buttons available

---

# STEP 17: EDIT PROFILE

### What to click:
1. Go to **Profile** page
2. Click **"Edit Profile"** button

### What to enter:

**Full Name:**
```
John Smith Updated
```

**Phone:**
```
+94 77 123 4567
```

**Bio (if available):**
```
Regular SafeRoute user committed to road safety
```

### Photo Upload:
- Click **"Choose File"** or **"Upload Photo"**
- Select any photo from your computer

### What to click:
- Click **"Save Changes"** button

### What should happen:
✅ Success: "Profile updated successfully"  
✅ Name changes to "John Smith Updated" in header  
✅ Photo appears on profile  
✅ Phone number saved

---

# STEP 18: VIEW MY REPORTS

### What to do:
1. On Profile page, scroll down

### What should appear:
✅ Section titled "My Reports" or "My Hazards"  
✅ List of 3 hazards you reported:
  - Pothole - Main Street - Status: Pending
  - Accident - Galle Road - Status: Pending
  - Traffic Jam - Kandy Road - Status: Pending

---

# STEP 19: LOGOUT

### What to click:
1. Click your name **"John Smith Updated"** at top  
2. Click **"Logout"**

### What should happen:
✅ Logged out successfully  
✅ Redirected to login page  
✅ Cannot access dashboard anymore

---

# STEP 20: CREATE MODERATOR ACCOUNT

### What to do:
1. Open **PowerShell** in backend folder
2. Type: `cd E:\SafeRoute\backend` (if not already there)
3. Press Enter

### What to type in PowerShell:

```powershell
node
```
Press Enter. You'll see `>` prompt.

Then **copy and paste this entire block** and press Enter:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(() => {
  User.create({
    fullName: 'Mike Moderator',
    email: 'moderator@saferoute.com',
    password: 'Moderator123',
    role: 'moderator'
  }).then(mod => {
    console.log('✅ Moderator created:', mod.email);
    process.exit(0);
  });
});
```

### What should happen:
✅ See: "✅ Moderator created: moderator@saferoute.com"  
✅ PowerShell exits automatically

---

# STEP 21: LOGIN AS MODERATOR

### What to do:
1. Go to: `http://localhost:3000/login`

### What to enter:

**Email:**
```
moderator@saferoute.com
```

**Password:**
```
Moderator123
```

### What to click:
- Click **"Login"**

### What should happen:
✅ Login successful  
✅ Dashboard appears  
✅ See "Welcome, Mike Moderator"  
✅ May see extra menu: "Hazard Management" or "Verify Reports"

---

# STEP 22: VERIFY A HAZARD (AS MODERATOR)

### What to click:
1. Look for **"Hazard Management"** or **"Pending Reports"** in menu
2. Click it

### What should appear:
✅ List of pending hazards (the 3 you reported earlier)

### What to click:
1. Click on the first hazard (Pothole on Main Street)
2. Review the details:
   - Type: Pothole ✓
   - Description: Detailed ✓
   - Location: Valid ✓
3. Click **"Verify"** or **"Approve"** button

### What should happen:
✅ Success: "Hazard verified successfully"  
✅ Hazard status changes from "Pending" to "Verified"  
✅ Hazard marker on map changes color (to green)  
✅ Hazard removed from pending list

---

# STEP 23: REJECT A HAZARD (AS MODERATOR)

### What to click:
1. Click on another pending hazard
2. Click **"Reject"** button

### What should appear:
✅ Popup asking for rejection reason

### What to enter:

**Rejection Reason:**
```
Insufficient information provided
```

### What to click:
- Click **"Confirm Reject"** or **"Yes"**

### What should happen:
✅ Hazard deleted  
✅ Removed from pending list  
✅ Does NOT appear on public map  
✅ Success message shown

---

# STEP 24: CREATE ADMIN ACCOUNT

### What to do:
1. Open **PowerShell** in backend folder

### What to type:

```powershell
node
```

Then **copy and paste this**:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(() => {
  User.create({
    fullName: 'Admin Boss',
    email: 'admin@saferoute.com',
    password: 'Admin123456',
    role: 'admin'
  }).then(admin => {
    console.log('✅ Admin created:', admin.email);
    process.exit(0);
  });
});
```

### What should happen:
✅ See: "✅ Admin created: admin@saferoute.com"

---

# STEP 25: LOGIN AS ADMIN

### What to do:
1. Logout moderator
2. Go to: `http://localhost:3000/login`

### What to enter:

**Email:**
```
admin@saferoute.com
```

**Password:**
```
Admin123456
```

### What to click:
- Click **"Login"**

### What should happen:
✅ Login successful  
✅ Role: Admin  
✅ Full access to everything

---

# STEP 26: ACCESS ADMIN DASHBOARD

### What to do:
1. Go to: `http://localhost:3000/admin`

### What should appear:
✅ Admin dashboard with statistics boxes:
  - Total Users: 3
  - Total Hazards: 2 (or however many remain)
  - Pending Reports: 1
  - Active Moderators: 1
✅ Tabs: **Users** | **Hazards** | **Reports** | **Settings**

---

# STEP 27: VIEW ALL USERS

### What to click:
1. Click **"Users"** tab

### What should appear:
✅ Table showing all users:

| Name | Email | Role | Status | Joined |
|------|-------|------|--------|--------|
| John Smith Updated | john.smith@gmail.com | User | Active | Today |
| Mike Moderator | moderator@saferoute.com | Moderator | Active | Today |
| Admin Boss | admin@saferoute.com | Admin | Active | Today |

---

# STEP 28: PROMOTE USER TO MODERATOR

### What to click:
1. Find "John Smith Updated" in the users table
2. Click **"Actions"** dropdown OR click on the user row
3. Click **"Change Role"** or **"Edit"**

### What should appear:
✅ Role dropdown menu

### What to select:
```
Select: Moderator
```

### What to click:
- Click **"Update Role"** or **"Save"**

### What should happen:
✅ Success: "User role updated to Moderator"  
✅ Table updates immediately  
✅ John's role now shows "Moderator"

---

# STEP 29: SUSPEND A USER

### What to do:
1. Find any user in the table (except yourself!)
2. Click **"Actions"** → **"Suspend"**

### What should appear:
✅ Confirmation popup

### What to enter:

**Suspension Reason:**
```
Testing suspension feature
```

### What to click:
- Click **"Confirm"** or **"Yes"**

### What should happen:
✅ User status changes to "Suspended"  
✅ Red/gray indicator shows  
✅ User cannot login anymore

### Test the suspension:
1. Logout admin
2. Try to login as suspended user
3. Should see: ❌ "Your account has been suspended"

---

# STEP 30: VIEW ALL HAZARDS (ADMIN)

### What to click:
1. In Admin Dashboard, click **"Hazards"** tab

### What should appear:
✅ Complete list of ALL hazards from ALL users  
✅ Filter options:
  - Status: All | Pending | Verified | Rejected
  - Type: All | Pothole | Accident | Traffic Jam | etc.
✅ Search bar
✅ Columns: ID, Type, Location, Severity, Status, Reported By, Date

---

# STEP 31: BULK VERIFY HAZARDS

### What to click:
1. Click checkboxes next to multiple pending hazards (check 2-3)
2. Click **"Bulk Actions"** dropdown
3. Click **"Verify Selected"**

### What should appear:
✅ Confirmation: "Verify 3 hazards?"

### What to click:
- Click **"Yes"** or **"Confirm"**

### What should happen:
✅ Success: "3 hazards verified successfully"  
✅ All selected hazards status change to "Verified"  
✅ All appear on public map  
✅ Pending count decreases

---

# STEP 32: DELETE A HAZARD

### What to click:
1. Find any hazard in the list
2. Click **"Delete"** icon/button
3. Confirmation appears: "Are you sure?"

### What to click:
- Click **"Yes, Delete"**

### What should happen:
✅ Hazard permanently deleted  
✅ Removed from map  
✅ Removed from database  
✅ Success message shown

---

# STEP 33: TEST EMPTY HAZARD FORM

### What to do:
1. Login as regular user
2. Click **"Report Hazard"**
3. Leave ALL fields empty

### What to click:
- Click **"Submit"**

### What should happen:
❌ Validation errors appear:
  - "Type is required"
  - "Description is required"
  - "Severity is required"
  - "Location is required"
❌ Form NOT submitted  
❌ No API call made

---

# STEP 34: TEST XSS ATTACK (SECURITY)

### What to do:
1. Click **"Report Hazard"**

### What to enter:

**Description:**
```
<script>alert('XSS Attack')</script>
```

**All other fields:**
- Type: Pothole
- Severity: High
- Location: Use current location

### What to click:
- Click **"Submit"**

### What should happen:
✅ Report submitted successfully  
✅ NO popup/alert appears  
✅ Script stored as plain text (not executed)  
✅ When viewing hazard, script shown as text, not run

---

# STEP 35: TEST UNAUTHORIZED ACCESS

### What to do:
1. Logout admin
2. Login as regular user: `john.smith@gmail.com` / `Test123456`
3. In browser address bar, type:
```
http://localhost:3000/admin
```
4. Press Enter

### What should happen:
❌ Access denied  
❌ Error: "You don't have permission to access this page"  
❌ Redirected to `/dashboard` or login page  
❌ Status: 403 Forbidden

---

# ✅ QUICK TESTING CHECKLIST

**Copy this and check off as you go:**

### Basic Features
- [ ] Register new user → Success
- [ ] Login with correct password → Success
- [ ] Login with wrong password → Error
- [ ] Allow location → Map centers
- [ ] Report pothole → Created
- [ ] Report accident → Created
- [ ] View hazard popup → Details show
- [ ] Filter hazards → Only selected show
- [ ] Search location → Map jumps
- [ ] Plan route → Route displays
- [ ] Save route → Saved successfully
- [ ] Edit profile → Updates shown
- [ ] View my reports → List displays
- [ ] Logout → Redirected to login

### Moderator
- [ ] Create moderator account → Success
- [ ] Login as moderator → Success
- [ ] Verify hazard → Status changes
- [ ] Reject hazard → Deleted

### Admin
- [ ] Create admin account → Success
- [ ] Login as admin → Full access
- [ ] View all users → Table shows
- [ ] Promote user → Role changes
- [ ] Suspend user → Cannot login
- [ ] View all hazards → List shows
- [ ] Bulk verify → All verified
- [ ] Delete hazard → Removed

### Security
- [ ] Empty form → Validation errors
- [ ] XSS attempt → Sanitized
- [ ] Unauthorized access → Blocked

---

# 📋 QUICK REFERENCE - COPY & PASTE DATA

**User Login:**
```
john.smith@gmail.com
Test123456
```

**Moderator Login:**
```
moderator@saferoute.com
Moderator123
```

**Admin Login:**
```
admin@saferoute.com
Admin123456
```

**Quick Pothole Report:**
```
Type: Pothole
Description: Large pothole causing vehicle damage
Severity: High
Latitude: 6.9271
Longitude: 79.8612
Address: Main Street, Colombo 01
```

**Quick Route:**
```
From: Colombo Fort
To: Mount Lavinia
Name: Daily Commute
```

---

**🎉 You're ready to test! Follow each step and check them off as you go!**
