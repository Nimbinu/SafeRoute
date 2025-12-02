# SafeRoute - Complete Testing Guide with Expected Inputs & Outputs

## 🧪 TEST DATA - Copy & Paste Ready

### Test User Accounts

```javascript
// USER 1 - Regular User
Email: user1@saferoute.com
Password: SafeRoute2024!
Full Name: John Regular
Phone: +94 77 123 4567

// USER 2 - Regular User  
Email: user2@saferoute.com
Password: SafeRoute2024!
Full Name: Sarah Normal
Phone: +94 77 234 5678

// MODERATOR
Email: moderator@saferoute.com
Password: SafeRoute2024!
Full Name: Mike Moderator
Phone: +94 77 345 6789

// ADMIN
Email: admin@saferoute.com
Password: SafeRoute2024!
Full Name: Admin Boss
Phone: +94 77 456 7890

// TEST/SPAM USER
Email: testspam@saferoute.com
Password: SafeRoute2024!
Full Name: Spam User
```

---

## 📝 TEST 1: USER REGISTRATION

### INPUT:
```
Navigate to: http://localhost:3000/register

Full Name: John Regular
Email: user1@saferoute.com
Password: SafeRoute2024!
Confirm Password: SafeRoute2024!
```

### EXPECTED OUTPUT:
```
✅ Success message: "Registration successful!"
✅ Redirected to: http://localhost:3000/dashboard
✅ Console log: "Login successful: {user: {...}, token: '...'}"
```

### EXPECTED IN DATABASE:
```javascript
{
  "_id": "674e1234567890abcdef1234",
  "fullName": "John Regular",
  "email": "user1@saferoute.com",
  "password": "$2a$10$...", // hashed
  "role": "user",
  "isActive": true,
  "createdAt": "2025-12-02T21:30:00.000Z"
}
```

### EXPECTED IN BROWSER:
```javascript
// localStorage
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: "{\"id\":\"674e1234...\",\"fullName\":\"John Regular\",\"email\":\"user1@saferoute.com\",\"role\":\"user\"}"
}
```

---

## 🔐 TEST 2: USER LOGIN (Valid)

### INPUT:
```
Navigate to: http://localhost:3000/login

Email: user1@saferoute.com
Password: SafeRoute2024!
```

### EXPECTED OUTPUT:
```
✅ Status Code: 200
✅ Response Body:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "674e1234567890abcdef1234",
      "fullName": "John Regular",
      "email": "user1@saferoute.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

✅ Redirected to: http://localhost:3000/dashboard
✅ Header shows: "Welcome, John Regular"
```

---

## ❌ TEST 3: USER LOGIN (Invalid Password)

### INPUT:
```
Email: user1@saferoute.com
Password: WrongPassword123!
```

### EXPECTED OUTPUT:
```
❌ Status Code: 401
❌ Response Body:
{
  "success": false,
  "message": "Invalid email or password"
}

❌ Error message displayed: "Invalid email or password"
❌ Stays on login page
❌ No token stored
```

---

## 📍 TEST 4: LOCATION PERMISSION (Allow)

### INPUT:
```
1. Login as user1@saferoute.com
2. Browser prompts: "localhost:3000 wants to know your location"
3. Click: "Allow"
```

### EXPECTED OUTPUT:
```
✅ Console: "Location obtained: {latitude: 6.9271, longitude: 79.8612}"
✅ API Call: GET /api/hazards/nearby?lng=79.8612&lat=6.9271&radius=5000
✅ Map centers on: [6.9271, 79.8612]
✅ Blue marker appears at your location
✅ Top-left displays: "📍 Colombo, Sri Lanka"
✅ Nearby hazards loaded (within 5km radius)
```

---

## 🚨 TEST 5: REPORT HAZARD - Pothole

### INPUT:
```
Click: "Report Hazard" button

Type: Pothole (select from dropdown)
Description: Large pothole on Main Street near the intersection causing vehicle damage. Approximately 30cm deep and 50cm wide.
Severity: High
Location: Use My Current Location
  OR manually enter:
  Latitude: 6.9271
  Longitude: 79.8612
  Address: Main Street, Colombo 01
Photo: Upload "pothole.jpg" (optional)
```

### EXPECTED API REQUEST:
```javascript
POST http://localhost:5004/api/hazards

Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Body:
{
  "type": "Pothole",
  "description": "Large pothole on Main Street near the intersection causing vehicle damage. Approximately 30cm deep and 50cm wide.",
  "severity": "High",
  "location": {
    "type": "Point",
    "coordinates": [79.8612, 6.9271]
  },
  "address": "Main Street, Colombo 01"
}
```

### EXPECTED API RESPONSE:
```javascript
Status: 201
{
  "success": true,
  "message": "Hazard reported successfully",
  "data": {
    "hazard": {
      "_id": "674e5678901234abcdef5678",
      "type": "Pothole",
      "description": "Large pothole on Main Street...",
      "severity": "High",
      "status": "Pending",
      "location": {
        "type": "Point",
        "coordinates": [79.8612, 6.9271]
      },
      "address": "Main Street, Colombo 01",
      "reportedBy": "674e1234567890abcdef1234",
      "createdAt": "2025-12-02T22:15:00.000Z"
    }
  }
}
```

### EXPECTED UI OUTPUT:
```
✅ Success message: "Hazard reported successfully!"
✅ Modal closes
✅ New marker appears on map at [6.9271, 79.8612]
✅ Marker color: Orange (pending status)
✅ Marker icon: 🕳️
✅ Notification: "Your report is pending verification"
```

---

## 🚗 TEST 6: REPORT HAZARD - Accident

### INPUT:
```
Type: Accident
Description: Two-vehicle collision blocking the left lane. Traffic moving slowly. Emergency services on site.
Severity: High
Location: 
  Latitude: 6.9312
  Longitude: 79.8508
  Address: Galle Road, Colombo 03
Photo: accident_scene.jpg
```

### EXPECTED OUTPUT:
```
✅ New hazard created
✅ Marker: 🚗 Red marker
✅ Status: Pending
✅ In database:
{
  "type": "Accident",
  "severity": "High",
  "status": "Pending",
  "photo": "/uploads/hazards/accident_scene_1733177700123.jpg"
}
```

---

## 🚦 TEST 7: REPORT HAZARD - Traffic Jam

### INPUT:
```
Type: Traffic Jam
Description: Heavy traffic on Highway 1 due to ongoing road construction. Expect delays of 15-20 minutes.
Severity: Medium
Location: Highway 1, Colombo
  Latitude: 6.9497
  Longitude: 79.8500
```

### EXPECTED OUTPUT:
```
✅ Hazard reported
✅ Marker: 🚦 Yellow marker
✅ Severity: Medium
```

---

## 🔍 TEST 8: VIEW HAZARD ON MAP

### INPUT:
```
Click on pothole marker at Main Street
```

### EXPECTED POPUP OUTPUT:
```
┌─────────────────────────────────────────┐
│ 🕳️ Pothole                              │
│                                         │
│ Large pothole on Main Street near the  │
│ intersection causing vehicle damage.    │
│ Approximately 30cm deep and 50cm wide.  │
│                                         │
│ 📍 Main Street, Colombo 01              │
│ 👤 Reported by: John R.                 │
│ ⚠️ Severity: High                       │
│ 🕒 2 hours ago                          │
│ 📊 Status: ⏳ Pending Verification      │
│                                         │
│ [View Photo] [Get Directions]          │
└─────────────────────────────────────────┘
```

---

## 🔎 TEST 9: FILTER HAZARDS

### INPUT:
```
Click: "Filter Hazards" button

Select filters:
✓ Accident
✓ Pothole
☐ Traffic Jam
☐ Construction
☐ Road Closure
☐ Flooding

Severity: All
Time: Last 24 hours
```

### EXPECTED OUTPUT:
```
✅ Map shows only: Accident & Pothole markers
✅ Other hazards hidden
✅ Count updates: "Showing 15 of 87 hazards"
✅ Filter button shows: "Filters (2 active)"
```

---

## 🗺️ TEST 10: SEARCH LOCATION

### INPUT 1:
```
Search bar: Colombo Fort Railway Station
```

### EXPECTED OUTPUT:
```
✅ Autocomplete suggestions appear:
  - Colombo Fort Railway Station
  - Fort Railway Station, Colombo 11
  - Colombo Fort

✅ Select first option
✅ Map centers on: [6.9344, 79.8428]
✅ Zoom level: 15
✅ Search marker placed at location
```

### INPUT 2:
```
Search bar: Galle Face Green
```

### EXPECTED OUTPUT:
```
✅ Map centers on: [6.9271, 79.8456]
✅ Displays: "Galle Face Green, Colombo"
```

### INPUT 3 (Invalid):
```
Search bar: XYZ123InvalidLocation
```

### EXPECTED OUTPUT:
```
❌ Autocomplete: "No results found"
❌ Or: "Location not found. Please try another search."
```

---

## 🛣️ TEST 11: PLAN SAFE ROUTE

### INPUT:
```
Navigate to: Safe Route page

From: Colombo Fort
  (Autocomplete: Colombo Fort Railway Station)
  Coordinates: [6.9344, 79.8428]

To: Mount Lavinia Beach
  (Autocomplete: Mount Lavinia Beach)
  Coordinates: [6.8373, 79.8636]

Route Type: Safest

Click: "Find Route"
```

### EXPECTED API REQUEST:
```javascript
POST http://localhost:5004/api/routes/safe-route

Body:
{
  "origin": {
    "lat": 6.9344,
    "lng": 79.8428,
    "address": "Colombo Fort Railway Station"
  },
  "destination": {
    "lat": 6.8373,
    "lng": 79.8636,
    "address": "Mount Lavinia Beach"
  },
  "routeType": "safest"
}
```

### EXPECTED OUTPUT:
```
✅ Route drawn on map (blue line)
✅ Route summary box:
┌─────────────────────────────────────────┐
│ 🛣️ Safe Route Found                     │
│                                         │
│ From: Colombo Fort Railway Station     │
│ To: Mount Lavinia Beach                │
│                                         │
│ 📏 Distance: 12.5 km                    │
│ ⏱️ Estimated Time: 25 mins              │
│ ⚠️ Hazards on Route: 2                  │
│                                         │
│ Hazards:                                │
│ • Pothole at km 3.2 (Medium)           │
│ • Traffic Jam at km 8.7 (Low)          │
│                                         │
│ Alternative Routes:                     │
│ • Fastest: 11.2 km, 18 mins (4 hazards)│
│ • Shortest: 10.8 km, 22 mins (3 hazards)│
│                                         │
│ [Save Route] [Start Navigation]        │
└─────────────────────────────────────────┘

✅ Hazard markers shown along route (highlighted)
✅ Turn-by-turn directions displayed
```

---

## 💾 TEST 12: SAVE ROUTE

### INPUT:
```
After planning route (from Test 11)
Click: "Save Route"

Route Name: Daily Commute to Office
```

### EXPECTED API REQUEST:
```javascript
POST http://localhost:5004/api/saved-routes

Body:
{
  "name": "Daily Commute to Office",
  "origin": {
    "lat": 6.9344,
    "lng": 79.8428,
    "address": "Colombo Fort Railway Station"
  },
  "destination": {
    "lat": 6.8373,
    "lng": 79.8636,
    "address": "Mount Lavinia Beach"
  },
  "routeType": "safest",
  "distance": 12.5,
  "duration": 25
}
```

### EXPECTED OUTPUT:
```
✅ Success: "Route saved successfully!"
✅ Appears in Profile > Saved Routes
✅ Entry shows:
{
  "_id": "674e7890123456abcdef7890",
  "name": "Daily Commute to Office",
  "userId": "674e1234567890abcdef1234",
  "origin": {...},
  "destination": {...},
  "savedAt": "2025-12-02T22:45:00.000Z"
}
```

---

## 👤 TEST 13: UPDATE PROFILE

### INPUT:
```
Navigate to: Profile page
Click: "Edit Profile"

Full Name: John Regular Updated
Email: user1@saferoute.com (read-only)
Phone: +94 77 123 4567
Profile Picture: Upload "john_profile.jpg"

Click: "Save Changes"
```

### EXPECTED API REQUEST:
```javascript
PUT http://localhost:5004/api/users/profile

Body (FormData):
{
  "fullName": "John Regular Updated",
  "phone": "+94 77 123 4567",
  "avatar": File(john_profile.jpg)
}
```

### EXPECTED OUTPUT:
```
✅ Success: "Profile updated successfully!"
✅ Name in header updates to: "John Regular Updated"
✅ Profile picture displays
✅ Database updated:
{
  "fullName": "John Regular Updated",
  "phone": "+94 77 123 4567",
  "avatar": "/uploads/profiles/john_profile_1733178300123.jpg"
}
```

---

## 🛡️ TEST 14: MODERATOR LOGIN

### INPUT:
```
Navigate to: http://localhost:3000/login

Email: moderator@saferoute.com
Password: SafeRoute2024!
```

### EXPECTED OUTPUT:
```
✅ Login successful
✅ Role in response: "moderator"
✅ Can access: 
  - Dashboard ✅
  - Hazard verification ✅
  - Admin panel ❌ (blocked)
```

---

## ✅ TEST 15: MODERATOR - VERIFY HAZARD

### INPUT:
```
Login as: moderator@saferoute.com
Go to: Hazard Management > Pending

Click on: Hazard #674e5678901234abcdef5678 (Pothole from Test 5)

Review:
- Type: Pothole ✅
- Description: Legitimate and detailed ✅
- Photo: Shows clear evidence ✅
- Location: GPS coordinates valid ✅

Click: "Verify" button
```

### EXPECTED API REQUEST:
```javascript
PATCH http://localhost:5004/api/hazards/674e5678901234abcdef5678/verify

Headers:
{
  "Authorization": "Bearer [moderator_token]"
}
```

### EXPECTED API RESPONSE:
```javascript
Status: 200
{
  "success": true,
  "message": "Hazard verified successfully",
  "data": {
    "hazard": {
      "_id": "674e5678901234abcdef5678",
      "status": "Verified",
      "verifiedBy": "674e3456789012abcdef3456",
      "verifiedAt": "2025-12-02T23:00:00.000Z"
    }
  }
}
```

### EXPECTED UI OUTPUT:
```
✅ Success message: "Hazard verified successfully!"
✅ Hazard removed from pending list
✅ Hazard appears on public map
✅ Marker changes: Orange → Red (for potholes)
✅ Status badge: "Pending" → "Verified ✓"
✅ Reporter receives notification (if implemented)
```

---

## ❌ TEST 16: MODERATOR - REJECT SPAM

### INPUT:
```
Hazard to reject:
- ID: 674e9012345678abcdef9012
- Type: Accident
- Description: "test test test"
- Photo: None
- Reporter: testspam@saferoute.com

Click: "Reject"
Reason: Spam report - insufficient information
Confirm: Yes
```

### EXPECTED API REQUEST:
```javascript
DELETE http://localhost:5004/api/hazards/674e9012345678abcdef9012

Body:
{
  "reason": "Spam report - insufficient information"
}
```

### EXPECTED OUTPUT:
```
✅ Hazard deleted
✅ Success: "Hazard rejected successfully"
✅ Removed from pending queue
✅ Does NOT appear on map
✅ Reporter may be notified
```

---

## 👑 TEST 17: ADMIN LOGIN & DASHBOARD

### INPUT:
```
Navigate to: http://localhost:3000/login

Email: admin@saferoute.com
Password: SafeRoute2024!

Then navigate to: http://localhost:3000/admin
```

### EXPECTED OUTPUT:
```
✅ Login successful
✅ Role: "admin"
✅ Admin dashboard loads

Dashboard shows:
┌─────────────────────────────────────────┐
│ 📊 SafeRoute Admin Dashboard            │
├─────────────────────────────────────────┤
│ Overview Statistics                      │
│                                         │
│ 👥 Total Users: 156                     │
│ 📍 Total Hazards: 432                   │
│ ✅ Active Hazards: 87                   │
│ ✓ Resolved Hazards: 345                │
│ ⏳ Pending Reports: 12                  │
│ 🛡️ Moderators: 5                        │
│ 📅 New Today: 8 reports                 │
│                                         │
│ [Tabs:]                                 │
│ Users | Hazards | Reports | Settings    │
└─────────────────────────────────────────┘
```

---

## 👥 TEST 18: ADMIN - VIEW USERS

### INPUT:
```
Click: "Users" tab
```

### EXPECTED OUTPUT:
```
Users Table (156 total):
┌────────┬───────────────────┬──────────────────────────┬───────────┬────────────┬────────┐
│ ID     │ Name              │ Email                    │ Role      │ Joined     │ Status │
├────────┼───────────────────┼──────────────────────────┼───────────┼────────────┼────────┤
│ #001   │ John Regular Upd. │ user1@saferoute.com      │ User      │ 2 days ago │ Active │
│ #002   │ Sarah Normal      │ user2@saferoute.com      │ User      │ 1 week ago │ Active │
│ #003   │ Mike Moderator    │ moderator@saferoute.com  │ Moderator │ 1 month    │ Active │
│ #004   │ Admin Boss        │ admin@saferoute.com      │ Admin     │ 2 months   │ Active │
│ #005   │ Spam User         │ testspam@saferoute.com   │ User      │ 1 day ago  │ Active │
│ ...    │ ...               │ ...                      │ ...       │ ...        │ ...    │
└────────┴───────────────────┴──────────────────────────┴───────────┴────────────┴────────┘

✅ Search bar available
✅ Filter by role: All | User | Moderator | Admin
✅ Sort by: Name | Email | Joined Date
```

---

## ⬆️ TEST 19: ADMIN - PROMOTE USER TO MODERATOR

### INPUT:
```
Find user: user2@saferoute.com (Sarah Normal)
Current role: User
Click: Role dropdown
Select: Moderator
Click: "Update Role"
Confirm: Yes
```

### EXPECTED API REQUEST:
```javascript
PATCH http://localhost:5004/api/admin/users/674e2345678901abcdef2345/role

Body:
{
  "role": "moderator"
}
```

### EXPECTED OUTPUT:
```
✅ Success: "User role updated to Moderator"
✅ Table updates immediately
✅ Sarah's role shows: "Moderator"
✅ Database updated:
{
  "_id": "674e2345678901abcdef2345",
  "email": "user2@saferoute.com",
  "role": "moderator"
}
```

### VERIFY NEW PERMISSIONS:
```
Logout admin
Login as: user2@saferoute.com

Expected abilities:
✅ Can verify hazards
✅ Can reject reports
❌ Cannot access /admin
❌ Cannot manage users
```

---

## 🚫 TEST 20: ADMIN - SUSPEND USER

### INPUT:
```
Find user: testspam@saferoute.com
Click: "Actions" → "Suspend Account"
Reason: Spam activities detected
Confirm: Yes
```

### EXPECTED API REQUEST:
```javascript
PATCH http://localhost:5004/api/admin/users/674e4567890123abcdef4567/suspend

Body:
{
  "reason": "Spam activities detected"
}
```

### EXPECTED OUTPUT:
```
✅ Success: "User account suspended"
✅ Status changes to: "Suspended"
✅ User row highlighted in red/gray
```

### VERIFY SUSPENSION:
```
Logout admin
Try to login as: testspam@saferoute.com

Expected:
❌ Login blocked
❌ Error: "Your account has been suspended. Contact admin."
❌ Status code: 403
```

---

## 🗑️ TEST 21: ADMIN - DELETE USER

### INPUT:
```
Find user: banned@saferoute.com
Click: "Actions" → "Delete User"
Warning: "This action cannot be undone. All user data will be deleted."
Type to confirm: DELETE
Click: "Confirm Delete"
```

### EXPECTED API REQUEST:
```javascript
DELETE http://localhost:5004/api/admin/users/674e5678901234abcdef5678
```

### EXPECTED OUTPUT:
```
✅ User deleted
✅ Removed from users table
✅ Success: "User deleted permanently"
✅ Total users count decreases by 1
```

### VERIFY DELETION:
```javascript
// Database check
db.users.findOne({ email: "banned@saferoute.com" })
// Returns: null

// User's hazard reports marked as deleted or orphaned
db.hazards.find({ reportedBy: "674e5678901234abcdef5678" })
// Should handle deleted user gracefully
```

---

## ✅ TEST 22: ADMIN - BULK VERIFY HAZARDS

### INPUT:
```
Go to: Hazards > Pending tab
Select checkboxes:
✓ Hazard #101 - Pothole (Main Road)
✓ Hazard #102 - Traffic Jam (Highway 1)
✓ Hazard #103 - Accident (Galle Road)
✓ Hazard #104 - Construction (Kandy Road)

Click: "Bulk Actions" → "Verify Selected (4)"
Confirm: Yes
```

### EXPECTED API REQUEST:
```javascript
POST http://localhost:5004/api/admin/hazards/bulk-verify

Body:
{
  "hazardIds": [
    "674e101...",
    "674e102...",
    "674e103...",
    "674e104..."
  ]
}
```

### EXPECTED OUTPUT:
```
✅ Success: "4 hazards verified successfully"
✅ All 4 hazards move from Pending to Verified
✅ All appear on public map
✅ Pending count decreases by 4
✅ Verified count increases by 4
```

---

## 📊 TEST 23: ADMIN - GENERATE REPORT

### INPUT:
```
Click: "Reports" tab
Select:
  Report Type: Hazard Statistics
  Date Range: Last 30 days
  Format: PDF
  Include: Charts ✓

Click: "Generate Report"
```

### EXPECTED OUTPUT:
```
✅ Report generated
✅ Download starts: SafeRoute_Report_November_2025.pdf

PDF Contains:
┌─────────────────────────────────────────┐
│ 📊 SafeRoute Monthly Report             │
│ November 2025                           │
├─────────────────────────────────────────┤
│                                         │
│ Summary:                                │
│ Total Hazards Reported: 234             │
│ Verified: 198 (84.6%)                   │
│ Rejected: 21 (9.0%)                     │
│ Pending: 15 (6.4%)                      │
│                                         │
│ By Type:                                │
│ • Potholes: 89 (38%)                   │
│ • Accidents: 45 (19%)                  │
│ • Traffic Jams: 67 (29%)               │
│ • Construction: 22 (9%)                │
│ • Road Closures: 11 (5%)               │
│                                         │
│ By Severity:                            │
│ • High: 78 (33%)                       │
│ • Medium: 112 (48%)                    │
│ • Low: 44 (19%)                        │
│                                         │
│ Top Locations:                          │
│ 1. Main Street, Colombo (34 reports)   │
│ 2. Galle Road (28 reports)             │
│ 3. Kandy Road (19 reports)             │
│                                         │
│ Most Active Reporter:                   │
│ John Regular Updated (23 reports)       │
│                                         │
│ [Charts and graphs included]            │
└─────────────────────────────────────────┘
```

---

## 🧪 TEST 24: EDGE CASE - Empty Form Submission

### INPUT:
```
Click: "Report Hazard"
Leave all fields empty:
  Type: (not selected)
  Description: (empty)
  Severity: (not selected)
  Location: (empty)

Click: "Submit"
```

### EXPECTED OUTPUT:
```
❌ Validation errors appear:
  - "Type is required" (under Type field)
  - "Description is required" (under Description)
  - "Severity is required" (under Severity)
  - "Location is required" (under Location)
  
❌ Submit button may be disabled
❌ Form not submitted
❌ No API call made
```

---

## 🧪 TEST 25: EDGE CASE - XSS Attack Prevention

### INPUT:
```
Report Hazard form:
Type: Pothole
Description: <script>alert('XSS Attack')</script><img src=x onerror=alert('XSS')>
Severity: High
Location: Test Location

Submit
```

### EXPECTED OUTPUT:
```
✅ Input sanitized
✅ Stored in database as plain text:
{
  "description": "<script>alert('XSS Attack')</script><img src=x onerror=alert('XSS')>"
}
✅ When displayed, rendered as text (not executed)
✅ No alert boxes appear
✅ Script tags shown as text, not executed
```

---

## 🧪 TEST 26: EDGE CASE - Unauthorized Access

### INPUT:
```
Login as: user1@saferoute.com (regular user)
Try to navigate to: http://localhost:3000/admin
```

### EXPECTED OUTPUT:
```
❌ Access Denied
❌ Status: 403 Forbidden
❌ Redirected to: /dashboard
❌ Error message: "You don't have permission to access this page"
❌ Console: "Access denied - admin role required"
```

---

## 🧪 TEST 27: EDGE CASE - Network Error

### INPUT:
```
1. Disconnect internet / Stop backend server
2. Try to report hazard
3. Fill form and submit
```

### EXPECTED OUTPUT:
```
❌ Error caught
❌ Message: "Network error. Please check your connection and try again."
❌ Or: "Unable to connect to server"
❌ Report not submitted
❌ Data may be saved locally (if offline mode implemented)
```

---

## ✅ COMPLETE TEST CHECKLIST

### User Tests
- [ ] Registration with valid data → Success
- [ ] Registration with existing email → Error
- [ ] Login with valid credentials → Success
- [ ] Login with invalid password → Error
- [ ] Location permission allowed → Map centers
- [ ] Location permission denied → Error message + default view
- [ ] Report pothole → Created with Pending status
- [ ] Report accident → Created successfully
- [ ] Report traffic jam → Created successfully
- [ ] View hazard on map → Popup shows details
- [ ] Filter by hazard type → Only selected types show
- [ ] Search valid location → Map centers
- [ ] Search invalid location → Error message
- [ ] Plan safe route → Route displayed with hazards
- [ ] Save route → Appears in saved routes
- [ ] Update profile → Changes reflected
- [ ] Upload profile picture → Image displayed
- [ ] View my reports → All reports listed
- [ ] Logout → Redirected to login

### Moderator Tests
- [ ] Login as moderator → Access granted
- [ ] View pending hazards → List displayed
- [ ] Verify legitimate hazard → Status changes to Verified
- [ ] Reject spam report → Removed from queue
- [ ] Update hazard severity → Changes saved
- [ ] Try to access /admin → Access denied
- [ ] Verify hazard appears on public map → Visible to all

### Admin Tests
- [ ] Login as admin → Full access
- [ ] View all users → Table displayed
- [ ] Search users → Results filtered
- [ ] Promote user to moderator → Role updated
- [ ] Demote moderator to user → Role updated
- [ ] Suspend user account → Login blocked
- [ ] Reactivate user → Login works
- [ ] Delete user → Removed from database
- [ ] View all hazards → Complete list
- [ ] Filter hazards by status → Results filtered
- [ ] Bulk verify hazards → All verified
- [ ] Bulk delete hazards → All deleted
- [ ] Generate PDF report → File downloaded
- [ ] Export CSV data → File downloaded
- [ ] View statistics → Charts displayed

### Edge Cases
- [ ] Empty form submission → Validation errors
- [ ] XSS attack attempt → Input sanitized
- [ ] SQL injection attempt → Input sanitized
- [ ] Unauthorized access → Blocked
- [ ] Network error → Error message
- [ ] Duplicate report → Handled gracefully
- [ ] Invalid coordinates → Error message
- [ ] File upload too large → Error message
- [ ] Session expired → Redirect to login
- [ ] Browser back button → State maintained

---

## 🎯 SUCCESS CRITERIA

### All Tests Pass When:
✅ No console errors
✅ All API calls return expected status codes
✅ Database reflects all changes
✅ UI updates immediately
✅ Error messages are user-friendly
✅ Permissions enforced correctly
✅ Data validated on client and server
✅ Security measures prevent attacks
✅ Performance is acceptable (< 3s load time)
✅ Responsive design works on mobile

---

**Testing Complete! 🎉**
Use this guide to systematically test every feature with exact inputs and expected outputs.
