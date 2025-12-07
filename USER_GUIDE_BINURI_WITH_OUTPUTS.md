# 🎯 SafeRoute User Guide for Binuri Nimthera - With Expected Outputs

---

## STEP 1: REGISTER YOUR ACCOUNT

### What to do:
1. Open browser (Chrome/Firefox)
2. Go to: `http://localhost:3000`
3. Click **"Register"** or **"Sign Up"** button

### What to enter:
```
Full Name: Binuri Nimthera
Email: binuthera@gmail.com
Password: Binuri@2025
Confirm Password: Binuri@2025
```

### Click:
**"Register"** button

### ✅ EXPECTED OUTPUT:
```
✅ Success message appears: "Registration successful!"
✅ Automatically redirected to: http://localhost:3000/dashboard
✅ You see the map dashboard
✅ Header shows: "Welcome, Binuri Nimthera"
✅ Your location marker appears on map (blue pin)
```

### ✅ EXPECTED IN DATABASE:
```javascript
{
  "_id": "675abc123def456789012345",
  "fullName": "Binuri Nimthera",
  "email": "binuthera@gmail.com",
  "password": "$2a$10$...", // encrypted
  "role": "user",
  "isActive": true,
  "createdAt": "2025-12-07T10:30:00.000Z"
}
```

### ✅ EXPECTED IN BROWSER (localStorage):
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    "id": "675abc123...",
    "fullName": "Binuri Nimthera",
    "email": "binuthera@gmail.com",
    "role": "user"
  }
}
```

---

## STEP 2: LOGIN (Next Time You Visit)

### What to do:
1. Go to: `http://localhost:3000/login`

### What to enter:
```
Email: binuthera@gmail.com
Password: Binuri@2025
```

### Click:
**"Login"** button

### ✅ EXPECTED OUTPUT:
```
✅ Success message: "Login successful"
✅ Redirected to: http://localhost:3000/dashboard
✅ Header shows: "Welcome, Binuri Nimthera"
✅ Map loads with your location
✅ Nearby hazards appear as markers
```

### ✅ EXPECTED API RESPONSE:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "675abc123...",
      "fullName": "Binuri Nimthera",
      "email": "binuthera@gmail.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## STEP 3: ALLOW LOCATION ACCESS

### What happens:
Browser shows popup: **"localhost:3000 wants to know your location"**

### What to click:
**"Allow"** button

### ✅ EXPECTED OUTPUT:
```
✅ Browser console log: "Location obtained: {lat: 6.9271, lng: 79.8612}"
✅ Map centers on your location (e.g., Colombo)
✅ Blue marker appears at your GPS coordinates
✅ Zoom level: 15 (street level)
✅ Top-left shows: "📍 Colombo, Sri Lanka"
✅ API call made: GET /api/hazards/nearby?lat=6.9271&lng=79.8612&radius=5000
✅ Nearby hazards load on map (within 5km)
```

### ✅ EXPECTED MAP VIEW:
```
┌─────────────────────────────────────────────┐
│  SafeRoute          Welcome, Binuri Nimthera│
├─────────────────────────────────────────────┤
│ 📍 Colombo, Sri Lanka        [Search...]    │
├─────────────────────────────────────────────┤
│                                             │
│         🗺️ [MAP]                            │
│                                             │
│           🕳️ ← Pothole marker               │
│       📍 ← Your location (blue)             │
│                🚗 ← Accident marker         │
│           🚦 ← Traffic jam                  │
│                                             │
│  [Filter] [Report Hazard]                   │
└─────────────────────────────────────────────┘
```

---

## STEP 4: REPORT YOUR FIRST HAZARD - POTHOLE

### What to click:
**"Report Hazard"** button on map

### ✅ EXPECTED: Modal Opens
```
┌───────────────────────────────┐
│   Report Hazard         [X]   │
├───────────────────────────────┤
│ Type: [Select Type ▼]        │
│ Description:                  │
│ [                          ]  │
│ Severity: [Select ▼]         │
│ Location:                     │
│   [Use Current Location]      │
│   Or enter manually:          │
│   Lat: [ ]  Lng: [ ]         │
│   Address: [ ]                │
│ Photo: [Choose File]          │
│                               │
│    [Cancel]  [Submit]         │
└───────────────────────────────┘
```

### What to enter:
```
Type: Select "Pothole"

Description: 
Large pothole on Galle Road near the traffic lights. About 40cm wide and 20cm deep. Causing vehicles to swerve into next lane.

Severity: Select "High"

Location: Click "Use My Current Location" button
(It auto-fills with your GPS coordinates)

OR manually enter:
Latitude: 6.8935
Longitude: 79.8553
Address: Galle Road, Bambalapitiya, Colombo 04

Photo: Click "Choose File" → Select pothole photo
```

### Click:
**"Submit"** button

### ✅ EXPECTED API REQUEST:
```http
POST http://localhost:5004/api/hazards

Headers:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}

Body:
{
  "type": "Pothole",
  "description": "Large pothole on Galle Road near the traffic lights...",
  "severity": "High",
  "location": {
    "type": "Point",
    "coordinates": [79.8553, 6.8935]
  },
  "address": "Galle Road, Bambalapitiya, Colombo 04"
}
```

### ✅ EXPECTED API RESPONSE:
```json
Status: 201 Created
{
  "success": true,
  "message": "Hazard reported successfully",
  "data": {
    "hazard": {
      "_id": "675def456abc789012345678",
      "type": "Pothole",
      "description": "Large pothole on Galle Road...",
      "severity": "High",
      "status": "Pending",
      "location": {
        "type": "Point",
        "coordinates": [79.8553, 6.8935]
      },
      "address": "Galle Road, Bambalapitiya, Colombo 04",
      "reportedBy": "675abc123def456789012345",
      "createdAt": "2025-12-07T10:35:00.000Z"
    }
  }
}
```

### ✅ EXPECTED UI OUTPUT:
```
✅ Success notification: "Hazard reported successfully! 🎉"
✅ Modal closes automatically
✅ New ORANGE marker appears on map at [6.8935, 79.8553]
✅ Marker icon: 🕳️ (pothole icon)
✅ Badge shows: "⏳ Pending Verification"
✅ You can click marker to see your report details
```

### ✅ EXPECTED MARKER POPUP (When you click it):
```
┌─────────────────────────────────────┐
│ 🕳️ Pothole                          │
├─────────────────────────────────────┤
│ Large pothole on Galle Road near   │
│ the traffic lights. About 40cm     │
│ wide and 20cm deep. Causing        │
│ vehicles to swerve into next lane. │
│                                     │
│ 📍 Galle Road, Bambalapitiya       │
│ ⚠️ Severity: High                  │
│ 👤 Reported by: Binuri N.          │
│ 🕒 5 minutes ago                   │
│ 📊 Status: ⏳ Pending Verification  │
│                                     │
│ [View Photo] [Get Directions]      │
└─────────────────────────────────────┘
```

---

## STEP 5: REPORT SECOND HAZARD - TRAFFIC JAM

### What to click:
**"Report Hazard"** button

### What to enter:
```
Type: Traffic Jam

Description:
Heavy traffic on Galle Road due to road construction. One lane closed. Expect 15-20 minute delays during peak hours.

Severity: Medium

Latitude: 6.8820
Longitude: 79.8570
Address: Galle Road, Wellawatta
```

### Click:
**"Submit"**

### ✅ EXPECTED OUTPUT:
```
✅ Success: "Hazard reported successfully!"
✅ Yellow/Orange marker appears: 🚦
✅ Status: Pending
✅ Marker at Wellawatta location
✅ Total reports by you: 2
```

---

## STEP 6: VIEW HAZARD DETAILS

### What to click:
Click on the **pothole marker** you just created

### ✅ EXPECTED POPUP:
```
┌─────────────────────────────────────────┐
│ 🕳️ Pothole                              │
│                                         │
│ Large pothole on Galle Road near the   │
│ traffic lights. About 40cm wide and    │
│ 20cm deep. Causing vehicles to swerve  │
│ into next lane.                         │
│                                         │
│ 📍 Location:                            │
│    Galle Road, Bambalapitiya, Colombo  │
│                                         │
│ 👤 Reported by: Binuri Nimthera        │
│ ⚠️ Severity: High                       │
│ 🕒 Reported: 10 minutes ago            │
│ 📊 Status: ⏳ Pending Verification      │
│                                         │
│ [📷 View Photo]  [🗺️ Get Directions]   │
└─────────────────────────────────────────┘
```

---

## STEP 7: FILTER HAZARDS

### What to click:
**"Filter"** button or icon on map

### What to select:
```
✓ Pothole (checked)
✓ Accident (checked)
☐ Traffic Jam (unchecked)
☐ Construction (unchecked)
☐ Flooding (unchecked)

Severity: All
Time: Last 24 hours
```

### Click:
**"Apply Filters"**

### ✅ EXPECTED OUTPUT:
```
✅ Map now shows ONLY pothole and accident markers
✅ Traffic jam markers disappear (hidden)
✅ Construction markers disappear
✅ Counter updates: "Showing 8 of 15 hazards"
✅ Filter button shows: "🔍 Filters (2 active)"
```

### ✅ EXPECTED MAP VIEW:
```
Map now displays:
🕳️ 🕳️ 🕳️ ← Only potholes
🚗 🚗 ← Only accidents
(No traffic jams, no construction visible)
```

---

## STEP 8: SEARCH FOR LOCATION

### In the search bar, type:
```
Galle Face Green
```

### ✅ EXPECTED: Autocomplete Dropdown Appears
```
┌─────────────────────────────┐
│ 📍 Galle Face Green         │
│ 📍 Galle Face Hotel         │
│ 📍 Galle Face Beach         │
└─────────────────────────────┘
```

### What to click:
Click **"Galle Face Green"** (first option)

### ✅ EXPECTED OUTPUT:
```
✅ Map smoothly pans to Galle Face Green
✅ Map centers on coordinates: [6.9271, 79.8456]
✅ Zoom level: 16 (close-up view)
✅ Search marker 📍 placed at Galle Face Green
✅ Location name shown: "Galle Face Green, Colombo 03"
✅ All hazards near Galle Face appear on map
```

---

## STEP 9: SEARCH INVALID LOCATION

### In search bar, type:
```
XYZ123InvalidPlace
```

### ✅ EXPECTED OUTPUT:
```
❌ Dropdown shows: "No results found"
❌ OR: Empty dropdown (no suggestions)
❌ Map stays on current location
❌ No error popup (graceful handling)
```

---

## STEP 10: PLAN YOUR DAILY ROUTE

### What to click:
Click **"Safe Route"** in navigation menu

### ✅ EXPECTED: Route Planning Page Opens
```
┌─────────────────────────────────────────┐
│  Safe Route Planner                     │
├─────────────────────────────────────────┤
│                                         │
│ From: [                              ]  │
│       📍 Use Current Location           │
│                                         │
│ To:   [                              ]  │
│                                         │
│ Route Type: ⚪ Safest  ⚪ Fastest       │
│                                         │
│           [Find Route]                  │
│                                         │
│ [MAP DISPLAY AREA]                      │
└─────────────────────────────────────────┘
```

### What to enter:
```
From: Colombo Fort
(Type and select from autocomplete)

To: Mount Lavinia Beach
(Type and select from autocomplete)

Route Type: Select "Safest"
```

### Click:
**"Find Route"** button

### ✅ EXPECTED API REQUEST:
```http
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

### ✅ EXPECTED OUTPUT:
```
✅ Blue route line drawn on map
✅ Route summary box appears:

┌─────────────────────────────────────────┐
│ 🛣️ Safe Route Found                     │
├─────────────────────────────────────────┤
│ From: Colombo Fort Railway Station     │
│ To: Mount Lavinia Beach                │
│                                         │
│ 📏 Distance: 12.5 km                    │
│ ⏱️ Estimated Time: 25 minutes           │
│ ⚠️ Hazards on Route: 2                  │
│                                         │
│ 🚨 Hazards Along Route:                 │
│ • 🕳️ Pothole at km 3.2 (Medium)        │
│      Location: Galle Road               │
│                                         │
│ • 🚦 Traffic Jam at km 8.7 (Low)       │
│      Location: Wellawatta Junction      │
│                                         │
│ 🔄 Alternative Routes:                  │
│ • Fastest: 11.2 km, 18 mins (4 hazards)│
│ • Shortest: 10.8 km, 22 mins (3 hazards)│
│                                         │
│     [💾 Save Route]  [▶️ Navigate]      │
└─────────────────────────────────────────┘
```

### ✅ EXPECTED MAP VIEW:
```
🅰️ Start marker at Colombo Fort
━━━━━━━ Blue route line
    🕳️ Hazard marker (highlighted)
━━━━━━━
    🚦 Hazard marker (highlighted)
━━━━━━━
🅱️ End marker at Mount Lavinia
```

---

## STEP 11: SAVE YOUR ROUTE

### What to click:
**"Save Route"** button

### ✅ EXPECTED: Save Dialog Appears
```
┌─────────────────────────────┐
│  Save This Route            │
├─────────────────────────────┤
│ Route Name:                 │
│ [                        ]  │
│                             │
│   [Cancel]      [Save]      │
└─────────────────────────────┘
```

### What to enter:
```
Route Name: Daily Commute to Office
```

### Click:
**"Save"** button

### ✅ EXPECTED API REQUEST:
```http
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
  "distance": 12.5,
  "duration": 25,
  "hazardCount": 2
}
```

### ✅ EXPECTED OUTPUT:
```
✅ Success message: "Route saved successfully! 💾"
✅ Dialog closes
✅ Route appears in "Saved Routes" list
✅ Star icon ⭐ appears next to route on map
```

---

## STEP 12: VIEW SAVED ROUTES

### What to click:
Click **"Profile"** in navigation → **"Saved Routes"** tab

### ✅ EXPECTED OUTPUT:
```
┌─────────────────────────────────────────────┐
│  Your Saved Routes                          │
├─────────────────────────────────────────────┤
│                                             │
│ 🛣️ Daily Commute to Office                 │
│    From: Colombo Fort                       │
│    To: Mount Lavinia Beach                  │
│    📏 12.5 km  ⏱️ 25 mins  ⚠️ 2 hazards    │
│    💾 Saved: Dec 7, 2025                    │
│    [View on Map] [Delete]                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## STEP 13: UPDATE YOUR PROFILE

### What to click:
**"Profile"** → **"Edit Profile"** button

### ✅ EXPECTED: Edit Form Opens
```
┌─────────────────────────────────────────┐
│  Edit Profile                           │
├─────────────────────────────────────────┤
│ Full Name:                              │
│ [Binuri Nimthera                     ]  │
│                                         │
│ Email: (read-only)                      │
│ [binuthera@gmail.com                 ]  │
│                                         │
│ Phone:                                  │
│ [                                    ]  │
│                                         │
│ Bio:                                    │
│ [                                    ]  │
│                                         │
│ Profile Picture:                        │
│ [Choose File] No file chosen            │
│                                         │
│  [Cancel]          [Save Changes]       │
└─────────────────────────────────────────┘
```

### What to enter:
```
Full Name: Binuri Nimthera
Email: binuthera@gmail.com (read-only, cannot change)
Phone: +94 77 123 4567
Bio: Regular commuter on Galle Road. SafeRoute user committed to road safety.
```

### What to do:
1. Click **"Choose File"**
2. Select your profile photo (JPG/PNG, max 5MB)

### Click:
**"Save Changes"** button

### ✅ EXPECTED API REQUEST:
```http
PUT http://localhost:5004/api/users/profile

Body (FormData):
{
  "fullName": "Binuri Nimthera",
  "phone": "+94 77 123 4567",
  "bio": "Regular commuter on Galle Road...",
  "avatar": File(profile_photo.jpg)
}
```

### ✅ EXPECTED OUTPUT:
```
✅ Success message: "Profile updated successfully! ✨"
✅ Form closes
✅ Name in header: "Welcome, Binuri Nimthera" (no change)
✅ Profile picture appears in header (top-right)
✅ Phone number displayed: "+94 77 123 4567"
✅ Bio shown on profile page
```

### ✅ EXPECTED PROFILE VIEW:
```
┌─────────────────────────────────────────┐
│          [Profile Photo]                │
│                                         │
│  Binuri Nimthera                        │
│  binuthera@gmail.com                    │
│  +94 77 123 4567                        │
│  👤 Role: User                          │
│  📅 Member since: Dec 7, 2025           │
│                                         │
│  📝 Bio:                                │
│  Regular commuter on Galle Road.        │
│  SafeRoute user committed to road       │
│  safety.                                │
│                                         │
│  📊 Statistics:                         │
│  • Total Reports: 2                     │
│  • Verified Reports: 0                  │
│  • Pending Reports: 2                   │
│  • Saved Routes: 1                      │
│                                         │
│         [Edit Profile]                  │
└─────────────────────────────────────────┘
```

---

## STEP 14: VIEW YOUR HAZARD REPORTS

### What to do:
Scroll down on Profile page to **"My Reports"** section

### ✅ EXPECTED OUTPUT:
```
┌─────────────────────────────────────────────┐
│  My Hazard Reports (2)                      │
├─────────────────────────────────────────────┤
│                                             │
│ 📊 Report #1                                │
│ 🕳️ Pothole                                  │
│ 📍 Galle Road, Bambalapitiya               │
│ ⚠️ Severity: High                          │
│ 📊 Status: ⏳ Pending Verification          │
│ 🕒 Reported: 1 hour ago                    │
│    [View Details] [Delete]                  │
│                                             │
│ ─────────────────────────────────────────   │
│                                             │
│ 📊 Report #2                                │
│ 🚦 Traffic Jam                              │
│ 📍 Galle Road, Wellawatta                  │
│ ⚠️ Severity: Medium                        │
│ 📊 Status: ⏳ Pending Verification          │
│ 🕒 Reported: 45 minutes ago                │
│    [View Details] [Delete]                  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## STEP 15: LOGOUT

### What to click:
Click your name **"Binuri Nimthera"** → **"Logout"**

### ✅ EXPECTED OUTPUT:
```
✅ Logged out successfully
✅ Message: "You have been logged out"
✅ Redirected to: http://localhost:3000/login
✅ localStorage cleared (token removed)
✅ Cannot access dashboard anymore
✅ Trying to visit /dashboard redirects to /login
```

---

## STEP 16: AFTER MODERATOR VERIFIES YOUR REPORT

### What happens (automatically after 24 hours):
Moderator reviews your pothole report and clicks "Verify"

### ✅ EXPECTED: Your Report Status Changes

**When you login again and check your reports:**
```
┌─────────────────────────────────────────────┐
│ 📊 Report #1                                │
│ 🕳️ Pothole                                  │
│ 📍 Galle Road, Bambalapitiya               │
│ ⚠️ Severity: High                          │
│ 📊 Status: ✅ Verified                      │  ← Changed!
│ 🕒 Reported: 1 day ago                     │
│ ✓ Verified: Dec 8, 2025                   │  ← New!
│    [View Details] [Delete]                  │
└─────────────────────────────────────────────┘
```

**On the map:**
```
✅ Marker color changes: Orange → Red (verified)
✅ Now visible to ALL users (not just you)
✅ Badge shows: "✅ Verified"
```

---

## COMPLETE TESTING SCENARIO: YOUR FIRST DAY

### Morning (9:00 AM):

**1. Register Account**
```
Input: binuthera@gmail.com / Binuri@2025
Expected: ✅ Success, redirected to dashboard
```

**2. Allow Location**
```
Expected: ✅ Map centers on Colombo, your location shows
```

**3. Report Pothole on Your Street**
```
Input: Type=Pothole, Description="Large pothole...", Severity=High
Expected: ✅ Orange marker appears, status=Pending
```

### Afternoon (2:00 PM):

**4. Plan Route to Friend's House**
```
Input: From=Your Location, To=Mount Lavinia
Expected: ✅ Blue route line, 12.5km, 25 mins, 2 hazards shown
```

**5. Save Route**
```
Input: Name="Visit Sarah"
Expected: ✅ Route saved, appears in Saved Routes
```

### Evening (6:00 PM):

**6. Check Route Before Leaving Work**
```
Action: Open saved route "Daily Commute"
Expected: ✅ Route displays, shows updated hazards
```

**7. See New Hazard on Route**
```
Expected: ✅ New traffic jam marker appeared (reported by others)
```

**8. Update Profile**
```
Input: Phone=+94771234567, Upload photo
Expected: ✅ Profile updated, photo appears in header
```

### Next Day (24 hours later):

**9. Check Your Reports**
```
Expected: ✅ Pothole report now shows "Verified"
         ✅ Marker is now red (visible to everyone)
```

---

## 🎯 SUCCESS CRITERIA

**You know the system is working when:**

✅ Registration takes you to dashboard automatically  
✅ Login shows "Welcome, Binuri Nimthera"  
✅ Blue marker shows your GPS location  
✅ Reporting hazard creates orange marker (Pending)  
✅ Routes show distance, time, and hazards  
✅ Saved routes appear in Profile  
✅ Profile updates reflect immediately  
✅ After 24 hours, verified reports turn red/green  
✅ Other users can see your verified reports  
✅ Logout clears session and redirects to login  

---

**Now you know exactly what to expect at every step, Binuri! 🎉**
