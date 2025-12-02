# SafeRoute - Complete Testing Guide with Examples

## 🧪 Test Accounts Setup

### Create Test Accounts

**Regular User 1:**
- Email: `user1@test.com`
- Password: `Test123!`
- Name: `John Regular`

**Regular User 2:**
- Email: `user2@test.com`
- Password: `Test123!`
- Name: `Sarah Normal`

**Moderator:**
- Email: `moderator@test.com`
- Password: `Test123!`
- Name: `Mike Moderator`

**Admin:**
- Email: `admin@test.com`
- Password: `Test123!`
- Name: `Admin Boss`

---

## 📝 PART 1: USER TESTING WITH EXAMPLES

### Test 1: User Registration

**Steps:**
1. Go to `http://localhost:3000/register`
2. Fill the form:
   ```
   Full Name: John Regular
   Email: user1@test.com
   Password: Test123!
   Confirm Password: Test123!
   ```
3. Click "Sign Up"

**Expected Result:**
```
✅ Success message: "Registration successful!"
✅ Redirected to: http://localhost:3000/dashboard
✅ Token stored in localStorage
✅ User info stored in localStorage
```

**Verify in Database:**
```javascript
// Check MongoDB
db.users.findOne({ email: "user1@test.com" })
// Should return user document with role: "user"
```

---

### Test 2: User Login

**Steps:**
1. Go to `http://localhost:3000/login`
2. Enter:
   ```
   Email: user1@test.com
   Password: Test123!
   ```
3. Click "Login"

**Expected Result:**
```
✅ Success! Redirected to dashboard
✅ Map loads with location prompt
✅ User name appears in header
```

**Test Invalid Login:**
```
Email: user1@test.com
Password: WrongPassword123

Expected: ❌ "Invalid email or password" error
```

---

### Test 3: Location Permission

**Test 3a: Allow Location**
1. Login as user1@test.com
2. Browser prompts for location
3. Click "Allow"

**Expected Result:**
```
✅ Map centers on your location
✅ Top-left shows: "📍 [Your City Name]"
✅ Blue marker appears at your position
✅ Nearby hazards load automatically
```

**Test 3b: Deny Location**
1. Login with new browser/incognito
2. Click "Block" on location prompt

**Expected Result:**
```
✅ Error message: "Location access denied"
✅ Map shows default view (Colombo)
✅ All hazards displayed
✅ Can manually search for location
```

---

### Test 4: Report a Hazard

**Example 1: Report Pothole**

**Steps:**
1. Login as `user1@test.com`
2. Click "Report Hazard" button
3. Fill form:
   ```
   Type: Pothole
   Description: Large pothole on Main Street causing vehicle damage
   Severity: High
   Location: [Use My Current Location] or manually enter
   Photo: Upload pothole.jpg (optional)
   ```
4. Click "Submit Report"

**Expected Result:**
```
✅ Success message: "Hazard reported successfully!"
✅ Modal closes
✅ New marker appears on map (pending status)
✅ Notification: "Your report is pending verification"
```

**Verify in Database:**
```javascript
db.hazards.findOne({ 
  reportedBy: "user1@test.com",
  type: "Pothole"
})
// Should show status: "Pending"
```

**Example 2: Report Traffic Jam**

```
Type: Traffic Jam
Description: Heavy traffic on Highway 1 due to road construction
Severity: Medium
Location: Highway 1, Colombo
Photo: None
```

**Example 3: Report Accident**

```
Type: Accident
Description: Two-vehicle collision blocking left lane
Severity: High
Location: [Use GPS coordinates]
Photo: accident_photo.jpg
```

---

### Test 5: View Hazards on Map

**Steps:**
1. Login as user1@test.com
2. Look at map for hazard markers

**Expected Markers:**
```
🚗 Red marker = Accident
🕳️ Orange marker = Pothole
🚦 Yellow marker = Traffic Jam
🚧 Blue marker = Construction
⛔ Red marker = Road Closure
```

**Click on Marker:**

**Expected Popup:**
```
┌─────────────────────────────┐
│ 🚗 Accident                  │
│ Heavy traffic collision      │
│                              │
│ 📍 Main Street, Colombo      │
│ 👤 Reported by: John R.      │
│ ⚠️ Severity: High            │
│ 🕒 2 hours ago               │
│ ✅ Status: Verified          │
└─────────────────────────────┘
```

---

### Test 6: Filter Hazards

**Steps:**
1. Click "Filter Hazards" button
2. Test combinations:

**Example 1: Show only Accidents**
```
✓ Accident
☐ Pothole
☐ Traffic Jam
☐ Construction
☐ Road Closure
```
**Expected:** Only accident markers visible

**Example 2: Show High Severity Only**
```
Filter by Severity: High
```
**Expected:** Only high-severity hazards shown

**Example 3: Show Recent (Last 24 hours)**
```
Time Filter: Last 24 hours
```
**Expected:** Only today's hazards visible

---

### Test 7: Search Location

**Test Examples:**

**Example 1:**
```
Search: "Colombo Fort Railway Station"
Expected: Map centers on railway station
```

**Example 2:**
```
Search: "Galle Road, Colombo"
Expected: Map shows Galle Road area
```

**Example 3:**
```
Search: Invalid location "XYZ123ABC"
Expected: "No results found" or error message
```

---

### Test 8: Plan Safe Route

**Example 1: Short Route**

**Steps:**
1. Click "Safe Route" or navigate to `/safe-route`
2. Enter:
   ```
   From: Colombo Fort
   To: Mount Lavinia Beach
   Route Type: Safest
   ```
3. Click "Find Route"

**Expected Result:**
```
✅ Route drawn on map (blue line)
✅ Hazards along route highlighted (red pins)
✅ Distance shown: ~12 km
✅ Time shown: ~25 mins
✅ Alternative routes suggested
✅ Warning: "⚠️ 2 hazards on this route"
```

**Example 2: Long Route**

```
From: Colombo
To: Kandy
Route Type: Fastest

Expected:
- Route: ~115 km
- Time: ~3 hours
- Shows highways
- Hazard warnings displayed
```

**Example 3: Avoid Hazards**

```
From: Point A (with hazards nearby)
To: Point B
Route Type: Safest

Expected:
- Route avoids known hazards
- May be longer but safer
- Shows comparison with fastest route
```

---

### Test 9: Save Route

**Steps:**
1. Plan route (Colombo to Galle)
2. After route displays, click "Save Route"
3. Enter name:
   ```
   Route Name: Daily Commute to Office
   ```
4. Click "Save"

**Expected Result:**
```
✅ Success: "Route saved successfully!"
✅ Route appears in Profile > Saved Routes
✅ Can be loaded later
```

---

### Test 10: Update Profile

**Steps:**
1. Go to Profile page
2. Click "Edit Profile"
3. Update:
   ```
   Full Name: John Regular Updated
   Upload: profile_pic.jpg
   ```
4. Click "Save Changes"

**Expected Result:**
```
✅ Success message
✅ Name updated in header
✅ Profile picture displayed
✅ Changes reflected immediately
```

**Verify:**
```javascript
db.users.findOne({ email: "user1@test.com" })
// fullName should be "John Regular Updated"
```

---

### Test 11: View My Reports

**Steps:**
1. Go to Profile page
2. Scroll to "My Hazard Reports"

**Expected Display:**
```
┌─────────────────────────────────────────┐
│ My Hazard Reports (3)                    │
├─────────────────────────────────────────┤
│ 🚗 Accident - Main Street                │
│ Status: ✅ Verified                      │
│ Reported: 2 hours ago                    │
├─────────────────────────────────────────┤
│ 🕳️ Pothole - Highway 1                  │
│ Status: ⏳ Pending                       │
│ Reported: 5 hours ago                    │
├─────────────────────────────────────────┤
│ 🚦 Traffic Jam - Galle Road             │
│ Status: ✅ Resolved                      │
│ Reported: 1 day ago                      │
└─────────────────────────────────────────┘
```

---

## 🛡️ PART 2: MODERATOR TESTING WITH EXAMPLES

### Setup: Create Moderator Account

**Method 1: Via Admin Dashboard**
1. Admin logs in
2. Goes to Users section
3. Finds user: `moderator@test.com`
4. Changes role to "moderator"

**Method 2: Via Database**
```javascript
db.users.updateOne(
  { email: "moderator@test.com" },
  { $set: { role: "moderator" } }
)
```

**Method 3: Via Backend Script**
```bash
cd backend
node makeAdmin.js moderator@test.com
# Then manually change role in database from admin to moderator
```

---

### Test 12: Moderator Login

**Steps:**
1. Login as `moderator@test.com`
2. Password: `Test123!`

**Expected Result:**
```
✅ Access to dashboard
✅ Can see "Moderate Hazards" option
✅ Cannot access /admin route
```

---

### Test 13: View Pending Hazards

**Steps:**
1. Login as moderator
2. Go to Hazard Management section
3. Filter: Status = Pending

**Expected Display:**
```
┌─────────────────────────────────────────────┐
│ Pending Hazard Reports (5)                   │
├─────────────────────────────────────────────┤
│ ID: #1234                                    │
│ Type: 🕳️ Pothole                            │
│ Location: Main Street, Colombo              │
│ Reporter: John Regular                       │
│ Description: Large pothole causing damage   │
│ Severity: High                               │
│ Photo: [View]                                │
│ Reported: 2 hours ago                        │
│ [Verify] [Reject]                           │
├─────────────────────────────────────────────┤
│ ID: #1235                                    │
│ Type: 🚗 Accident                           │
│ Location: Galle Road                         │
│ ...                                          │
└─────────────────────────────────────────────┘
```

---

### Test 14: Verify Legitimate Hazard

**Example: Verify Pothole Report**

**Steps:**
1. Click on hazard #1234
2. Review:
   ```
   Type: Pothole
   Description: Large pothole on Main Street
   Photo: Shows clear evidence of pothole
   Location: Accurate GPS coordinates
   Reporter: John Regular (verified user)
   ```
3. Click "Verify" button

**Expected Result:**
```
✅ Success: "Hazard verified successfully!"
✅ Status changes: Pending → Verified
✅ Hazard now visible to all users
✅ Marker appears on public map
✅ Reporter notified: "Your report has been verified"
```

**Verify in Database:**
```javascript
db.hazards.findOne({ _id: "1234" })
// status should be "Verified"
// verifiedBy should be moderator ID
```

---

### Test 15: Reject Invalid/Spam Report

**Example: Reject Spam Report**

**Steps:**
1. Find suspicious report:
   ```
   Type: Accident
   Description: "Test test test"
   Photo: None
   Location: Random coordinates
   Reporter: spam_user@test.com
   ```
2. Click "Reject"
3. Add reason: `Spam report - no valid information`
4. Confirm

**Expected Result:**
```
✅ Report rejected
✅ Removed from pending queue
✅ Does NOT appear on map
✅ Reporter may receive notification
```

---

### Test 16: Handle Duplicate Reports

**Scenario:** 3 users report same pothole

**Example:**
```
Report #1: Pothole on Main St (user1@test.com)
Report #2: Big hole Main Street (user2@test.com)
Report #3: Pothole Main Street (user3@test.com)
```

**Steps:**
1. Verify Report #1 (first/best description)
2. Reject Report #2 with reason: `Duplicate of #1`
3. Reject Report #3 with reason: `Duplicate of #1`

**Expected Result:**
```
✅ Only one hazard appears on map
✅ Duplicate reports removed
✅ Users notified of rejection reason
```

---

### Test 17: Update Hazard Severity

**Example:**

**Original Report:**
```
Type: Pothole
Severity: Low (reporter's assessment)
Photo: [Shows large, deep pothole]
```

**Moderator Action:**
1. Review photo - clearly dangerous
2. Update Severity: Low → High
3. Save changes

**Expected Result:**
```
✅ Severity updated to High
✅ Hazard displayed with high priority
✅ Warning icon shown on map
```

---

## 👑 PART 3: ADMIN TESTING WITH EXAMPLES

### Setup: Create Admin Account

```bash
cd backend
node makeAdmin.js admin@test.com
```

**Expected Output:**
```
✅ User admin@test.com is now an admin
✅ Role updated successfully
```

---

### Test 18: Admin Dashboard Access

**Steps:**
1. Login as `admin@test.com`
2. Navigate to `http://localhost:3000/admin`

**Expected Dashboard:**
```
┌─────────────────────────────────────────┐
│ SafeRoute Admin Dashboard                │
├─────────────────────────────────────────┤
│ 📊 Overview Statistics                   │
│                                          │
│ Total Users: 156                         │
│ Total Hazards: 432                       │
│ Active Hazards: 87                       │
│ Resolved Hazards: 345                    │
│ Pending Reports: 12                      │
│ Moderators: 5                            │
│                                          │
│ [Users] [Hazards] [Reports] [Settings]  │
└─────────────────────────────────────────┘
```

---

### Test 19: View All Users

**Steps:**
1. Click "Users" tab
2. View user list

**Expected Table:**
```
┌────────┬─────────────────┬──────────────────────┬──────────┬───────────┬────────┐
│ ID     │ Name            │ Email                │ Role     │ Joined    │ Status │
├────────┼─────────────────┼──────────────────────┼──────────┼───────────┼────────┤
│ #001   │ John Regular    │ user1@test.com       │ User     │ 2 days    │ Active │
│ #002   │ Sarah Normal    │ user2@test.com       │ User     │ 1 week    │ Active │
│ #003   │ Mike Moderator  │ moderator@test.com   │ Moderator│ 1 month   │ Active │
│ #004   │ Admin Boss      │ admin@test.com       │ Admin    │ 2 months  │ Active │
│ #005   │ Spam User       │ spam@test.com        │ User     │ 1 day     │ Active │
└────────┴─────────────────┴──────────────────────┴──────────┴───────────┴────────┘
```

---

### Test 20: Change User Role

**Example: Promote User to Moderator**

**Steps:**
1. Find user: `user2@test.com` (Sarah Normal)
2. Current role: User
3. Change to: Moderator
4. Click "Update Role"

**Expected Result:**
```
✅ Success: "User role updated to Moderator"
✅ Sarah can now verify hazards
✅ Sarah gains moderator permissions
```

**Verify:**
```javascript
db.users.findOne({ email: "user2@test.com" })
// role should be "moderator"
```

**Test New Permissions:**
1. Logout admin
2. Login as `user2@test.com`
3. Check access:
   ```
   ✅ Can verify hazards
   ✅ Can reject reports
   ❌ Cannot access admin dashboard
   ```

---

### Test 21: Suspend User Account

**Example: Suspend Spam User**

**Steps:**
1. Find user: `spam@test.com`
2. Click "Suspend Account"
3. Confirm action

**Expected Result:**
```
✅ Account suspended
✅ User cannot login
✅ Status shows: "Suspended"
```

**Test Login:**
```
Email: spam@test.com
Password: Test123!

Expected: ❌ "Your account has been suspended"
```

---

### Test 22: Delete User

**Example: Remove Banned User**

**Steps:**
1. Find user: `banned@test.com`
2. Click "Delete User"
3. Confirm: "Are you sure? This cannot be undone"
4. Click "Yes, Delete"

**Expected Result:**
```
✅ User deleted from database
✅ All user's hazard reports marked as deleted
✅ User data removed
```

**Verify:**
```javascript
db.users.findOne({ email: "banned@test.com" })
// Should return null
```

---

### Test 23: Bulk Verify Hazards

**Example: Verify Multiple Legitimate Reports**

**Steps:**
1. Go to Hazards > Pending
2. Select checkboxes:
   ```
   ✓ Hazard #101 - Pothole
   ✓ Hazard #102 - Traffic Jam
   ✓ Hazard #103 - Accident
   ```
3. Click "Bulk Verify"
4. Confirm

**Expected Result:**
```
✅ 3 hazards verified simultaneously
✅ All appear on map
✅ Status: Pending → Verified
✅ Reporters notified
```

---

### Test 24: Generate Reports

**Example: Monthly Hazard Report**

**Steps:**
1. Go to Reports section
2. Select:
   ```
   Report Type: Hazard Statistics
   Date Range: Last 30 days
   Format: PDF
   ```
3. Click "Generate Report"

**Expected Output:**
```
📊 SafeRoute Monthly Report - November 2025

Total Hazards Reported: 234
Verified: 198 (85%)
Rejected: 21 (9%)
Pending: 15 (6%)

By Type:
- Potholes: 89
- Accidents: 45
- Traffic Jams: 67
- Construction: 22
- Road Closures: 11

Most Active Reporter: John Regular (23 reports)
Most Common Location: Main Street, Colombo

[Download PDF]
```

---

### Test 25: System Statistics

**Example: View Analytics Dashboard**

**Expected Charts:**
```
📈 User Growth
   Jan: 50 users
   Feb: 75 users
   Mar: 120 users
   Apr: 156 users

📊 Hazard Reports (Last 7 Days)
   Mon: 12
   Tue: 15
   Wed: 18
   Thu: 14
   Fri: 20
   Sat: 8
   Sun: 5

🗺️ Top Hazard Locations
   1. Main Street, Colombo (34 reports)
   2. Galle Road (28 reports)
   3. Kandy Road (19 reports)
```

---

## 🧪 PART 4: EDGE CASES & ERROR TESTING

### Test 26: Invalid Data Submission

**Example 1: Empty Hazard Report**
```
Type: (not selected)
Description: (empty)
Location: (empty)

Expected: ❌ "Please fill all required fields"
```

**Example 2: Special Characters**
```
Description: <script>alert('test')</script>

Expected: ✅ Input sanitized, script not executed
```

---

### Test 27: Network Errors

**Example: Submit Report Offline**
1. Disconnect internet
2. Try to report hazard
3. Click Submit

**Expected:**
```
❌ "Network error. Please check your connection"
✅ Report saved locally (if offline mode implemented)
```

---

### Test 28: Permission Errors

**Example: User tries to access admin**
```
URL: http://localhost:3000/admin
User: user1@test.com (role: user)

Expected: 
❌ Access Denied
↪️ Redirected to /dashboard
```

---

## ✅ Testing Checklist

### User Testing
- [ ] Registration works
- [ ] Login works
- [ ] Location permission handled
- [ ] Can view hazards
- [ ] Can report hazards
- [ ] Can filter hazards
- [ ] Can search locations
- [ ] Can plan routes
- [ ] Can save routes
- [ ] Profile updates work
- [ ] Can logout

### Moderator Testing
- [ ] Moderator login works
- [ ] Can view pending reports
- [ ] Can verify hazards
- [ ] Can reject hazards
- [ ] Can update severity
- [ ] Cannot access admin panel
- [ ] Duplicate handling works

### Admin Testing
- [ ] Admin dashboard loads
- [ ] Can view all users
- [ ] Can change user roles
- [ ] Can suspend users
- [ ] Can delete users
- [ ] Can bulk verify hazards
- [ ] Can generate reports
- [ ] Statistics display correctly

### Edge Cases
- [ ] Invalid login handled
- [ ] Location denial handled
- [ ] Empty form validation
- [ ] Network errors caught
- [ ] Permission errors blocked
- [ ] Duplicate reports handled

---

## 🎯 Success Criteria

✅ **All user flows work smoothly**
✅ **No console errors**
✅ **Proper error messages displayed**
✅ **Data persists in database**
✅ **Role-based access control works**
✅ **UI is responsive and user-friendly**

---

**Testing Complete!** 🎉
