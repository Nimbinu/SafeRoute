# SafeRoute - User Guide (Regular User Role)

## 🎯 Overview
This guide is for **regular users** who want to find safe routes and report hazards in Sri Lanka.

---

## 📝 Account Setup

### Creating Your Account

#### Step 1: Navigate to Registration
1. Open browser → `http://localhost:3000`
2. You'll see the **Login Page**
3. Click **"Sign up here"** link at the bottom

#### Step 2: Fill Registration Form
```
Full Name: John Doe
Email: john.doe@gmail.com
Password: SecurePass123!
Confirm Password: SecurePass123!
```

**Requirements:**
- Email must be valid and unique
- Password minimum 6 characters
- Passwords must match

#### Step 3: Submit
- Click **"Register"** button
- Auto-login → Redirected to Dashboard

---

## 🔐 Login Process

### First Time Login Credentials Example:
```
Email: john.doe@gmail.com
Password: SecurePass123!
```

### Demo Account (For Testing):
```
Email: user@saferoute.com
Password: user123
```

### Steps:
1. Go to `http://localhost:3000`
2. Enter your email and password
3. Click **"Login"** button
4. You'll be taken to the **Dashboard**

---

## 📱 Page-by-Page Guide

---

## 1️⃣ LOGIN PAGE (`/login`)

### What You See:
- SafeRoute logo and welcome message
- Email input field
- Password input field
- Login button
- "Sign up here" link

### Actions:
- **Login**: Enter credentials → Click "Login"
- **Register**: Click "Sign up here" → Go to registration
- **Forgot Password**: Click "Forgot Password?" link

### Sample Credentials:
```
Email: sarah@example.com
Password: password123
```

---

## 2️⃣ REGISTRATION PAGE (`/register`)

### What You See:
- Registration form with 4 fields
- Register button
- "Login here" link

### Required Information:
```
Full Name: Sarah Johnson
Email: sarah.johnson@gmail.com
Password: MyPassword2024
Confirm Password: MyPassword2024
```

### Validation:
- ✅ All fields required
- ✅ Valid email format
- ✅ Password minimum 6 characters
- ✅ Passwords must match

### Actions:
- **Register**: Fill form → Click "Register"
- **Back to Login**: Click "Login here" link

---

## 3️⃣ DASHBOARD PAGE (`/dashboard`)

### What You See:
Main hub with 4 feature cards:

#### 1. Safe Route Finder 🗺️
- **Purpose**: Find safest route between locations
- **Action**: Click card → Navigate to Safe Route page

#### 2. Report Hazard ⚠️
- **Purpose**: Report dangerous areas
- **Action**: Click card → Open hazard reporting modal

#### 3. View Map 🌍
- **Purpose**: See all hazards on interactive map
- **Action**: Click card → Navigate to Map Dashboard

#### 4. Profile 👤
- **Purpose**: Manage your account
- **Action**: Click card → Navigate to Profile page

### Header Elements:
- **SafeRoute Logo**: Click → Stay on Dashboard
- **Logout Button**: Click → Logout → Return to Login

### Quick Stats (if available):
- Total routes calculated
- Hazards reported by you
- Your safety score

---

## 4️⃣ SAFE ROUTE PAGE (`/safe-route`)

### What You See:
- Left sidebar with route form
- Right side with interactive map
- Profile button (top right)

### Step-by-Step Route Finding:

#### Method 1: Search by Place Name (Default)
```
From: Colombo Fort
To: Kandy City Center
```

**Steps:**
1. Type starting location in "From" field
2. Type destination in "To" field
3. Click **"Find Safe Route"** button

**Quick Select Locations:**
- Colombo Fort Railway Station
- Galle Face Green, Colombo
- Kandy City Center
- Temple of the Tooth, Kandy
- Galle Fort
- Negombo Beach

Click any location to auto-fill fields.

#### Method 2: Enter Coordinates
```
From: 6.9344, 79.8428
To: 7.2906, 80.6337
```

**Steps:**
1. Click **"Enter Coordinates"** toggle
2. Enter latitude, longitude for start point
3. Enter latitude, longitude for destination
4. Click **"Find Safe Route"** button

#### Option: Use Current Location
- Check ✅ **"Use my current location as starting point"**
- Browser will request location permission
- "From" field auto-filled with your GPS coordinates

### What You Get - Route Results:

#### 3 Route Options Displayed:

**🛡️ Safest Route (Recommended)**
```
Distance: 104.21 km
Est. Time: 125 minutes
Safety Score: 100/100
Hazards: 0
```
- Green line on map
- Avoids most hazards
- Longest but safest

**⚡ Fastest Route**
```
Distance: 94.7 km
Est. Time: 114 minutes
Safety Score: 100/100
Hazards: 0
```
- Blue line on map
- Quickest travel time
- Balanced safety

**📏 Shortest Route**
```
Distance: 90.0 km
Est. Time: 120 minutes
Safety Score: 100/100
Hazards: 0
```
- Orange line on map
- Minimum distance
- May have more hazards

### Map Features:
- **Green Pin**: Your starting location
- **Red Pin**: Your destination
- **Yellow Triangles**: Hazards along route
- **Zoom Controls**: +/- buttons
- **Click Markers**: View details in popup

### Hazard Warnings (if any):
```
⚠️ Hazards Along Route (3)

1. Road Damage
   Description: Large pothole on main road
   Severity: Medium
   Status: Verified

2. Construction
   Description: Road widening project
   Severity: Low
   Status: Pending

3. Flood
   Description: Water accumulation
   Severity: High
   Status: Verified
```

### Navigation:
- **Profile Button**: Top right → Go to Profile
- **Logo**: Click → Return to Dashboard

---

## 5️⃣ MAP DASHBOARD PAGE (`/map`)

### What You See:
- Full-screen interactive map
- All hazards marked with icons
- Filter controls
- Legend

### Map Elements:
- **Red Markers**: Critical hazards
- **Orange Markers**: High severity hazards
- **Yellow Markers**: Medium severity hazards
- **Green Markers**: Low severity hazards

### Actions:
1. **Click Marker**: View hazard details
2. **Zoom**: Use scroll or +/- buttons
3. **Pan**: Click and drag map
4. **Filter**: Select hazard type or severity

### Sample Hazard Info Popup:
```
Hazard Type: Road Damage
Location: Main Street, Colombo
Severity: High
Status: Verified
Reported: 2 hours ago
Description: Multiple potholes causing traffic delays
```

### Navigation:
- **Back Button**: Return to Dashboard
- **Report Hazard**: Quick action button

---

## 6️⃣ PROFILE PAGE (`/profile`)

### What You See - View Mode:

#### Profile Header:
- Profile picture (upload capability)
- Full name
- Email address
- Join date

#### Personal Information Section:
```
Full Name: John Doe
Email: john.doe@gmail.com
Phone: +94 71 234 5678
Address: 123 Main Street, Colombo
Bio: Regular commuter, safety enthusiast
```

#### Statistics:
- Routes Calculated: 45
- Hazards Reported: 12
- Profile Views: 89
- Member Since: Jan 15, 2024

### Actions:

#### 1. Upload Profile Picture
**Steps:**
1. Click **"Upload Photo"** button
2. Select image file (JPG, PNG)
3. Image automatically uploaded
4. Profile picture updated

#### 2. Edit Profile
**Steps:**
1. Click **"Edit Profile"** button
2. Form becomes editable
3. Update any field:
   ```
   Full Name: John Michael Doe
   Phone: +94 71 999 8888
   Address: 456 New Street, Kandy
   Bio: Updated description
   ```
4. Click **"Save Changes"**
5. Success message displayed

#### 3. Change Password
**Steps:**
1. Scroll to password section
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click **"Update Password"**

**Example:**
```
Current Password: SecurePass123!
New Password: NewSecurePass2024!
Confirm New Password: NewSecurePass2024!
```

### Navigation:
- **Dashboard Button**: Return to main hub
- **Logout**: End session

---

## 7️⃣ REPORT HAZARD MODAL

### Triggered From:
- Dashboard → "Report Hazard" card
- Map Dashboard → "Report" button

### What You See:
Modal popup with hazard reporting form

### Required Information:

#### 1. Hazard Type (Dropdown)
```
Options:
- Road Damage
- Accident
- Flood
- Construction
- Wildlife
- Landslide
- Traffic Jam
- Poor Lighting
- Other
```

**Example Selection:**
```
Hazard Type: Road Damage
```

#### 2. Location
**Method A: Click on Map**
- Interactive map displayed
- Click exact hazard location
- Coordinates auto-filled

**Method B: Enter Address**
```
Location: Main Street, Colombo 07
```

**Method C: Use Current Location**
- Click "Use Current Location" button
- GPS coordinates captured

#### 3. Severity Level (Required)
```
○ Low - Minor inconvenience
○ Medium - Requires caution
○ High - Significant danger
○ Critical - Immediate threat
```

**Example:**
```
Selected: ● High - Significant danger
```

#### 4. Description (Required)
```
Description: Large pothole approximately 2 feet deep 
on Main Street near the traffic light. Causing 
vehicles to swerve dangerously. Water accumulated 
inside making it difficult to see depth.
```

**Tips:**
- Be specific and detailed
- Mention landmarks
- Describe impact on traffic
- Note if temporary or permanent

#### 5. Photo Upload (Optional)
**Steps:**
1. Click **"Upload Photo"** button
2. Select image from device
3. Preview displayed
4. Can upload multiple photos

**Supported formats:** JPG, PNG, GIF
**Max size:** 5MB per photo

### Complete Example:
```
Hazard Type: Road Damage
Location: Main Street, Colombo 07 (6.9271, 79.8612)
Severity: High
Description: Large pothole approximately 2 feet deep 
             on Main Street near the traffic light. 
             Causing vehicles to swerve dangerously.
Photos: [pothole1.jpg, pothole2.jpg]
```

### Submit:
1. Review all information
2. Click **"Submit Report"** button
3. Confirmation message: "Hazard reported successfully!"
4. Modal closes
5. Hazard added to system (Pending verification)

### Cancel:
- Click **"Cancel"** button or ❌
- No data saved
- Modal closes

---

## 📊 Understanding System Features

### Safety Scores Explained:
```
90-100 = Excellent (🟢 Green)
70-89  = Good (🟡 Yellow)
50-69  = Fair (🟠 Orange)
0-49   = Poor (🔴 Red)
```

### Hazard Severity Levels:
```
🔴 Critical - Avoid at all costs (road closed, major accident)
🟠 High - Serious danger (deep pothole, flooding)
🟡 Medium - Proceed with caution (construction, minor damage)
🟢 Low - Minor issue (small pothole, debris)
```

### Hazard Status:
```
Pending - Awaiting admin verification
Verified - Confirmed by admin
Resolved - Issue fixed/cleared
Rejected - Invalid/duplicate report
```

---

## 🎯 Common Tasks - Quick Reference

| Task | Navigation Path |
|------|----------------|
| **Find Route** | Login → Dashboard → Safe Route Finder → Enter locations → Find Route |
| **Report Hazard** | Login → Dashboard → Report Hazard → Fill form → Submit |
| **View All Hazards** | Login → Dashboard → View Map → Browse markers |
| **Update Profile** | Login → Dashboard → Profile → Edit Profile → Save |
| **Change Password** | Login → Profile → Change Password → Update |
| **Upload Photo** | Login → Profile → Upload Photo → Select file |
| **Logout** | Dashboard → Logout button |

---

## 💡 Pro Tips

### For Best Route Results:
1. ✅ Use specific location names (e.g., "Colombo Fort Railway Station" not just "Colombo")
2. ✅ Check all 3 route options before deciding
3. ✅ Read hazard descriptions - some may not affect your vehicle type
4. ✅ Use current location for most accurate starting point

### For Effective Hazard Reporting:
1. ✅ Be as specific as possible in description
2. ✅ Upload clear photos showing the hazard
3. ✅ Mark correct severity - helps others plan better
4. ✅ Include temporary vs permanent in description

### Profile Management:
1. ✅ Keep contact information updated
2. ✅ Use a clear profile picture
3. ✅ Change password regularly
4. ✅ Add bio to connect with community

---

## 🔧 Troubleshooting

### Login Issues:
**Problem:** "Invalid credentials"
- ✅ Check email spelling (case-sensitive)
- ✅ Verify password (case-sensitive)
- ✅ Try "Forgot Password?" feature
- ✅ Register new account if first time

**Problem:** "User not found"
- ✅ Ensure you've registered
- ✅ Check email used during registration
- ✅ Contact support if issue persists

### Route Finding Issues:
**Problem:** "Could not find location"
- ✅ Try different spelling or format
- ✅ Use coordinates instead of place name
- ✅ Select from quick location buttons
- ✅ Ensure location is in Sri Lanka

**Problem:** "No routes available"
- ✅ Check internet connection
- ✅ Verify locations are valid
- ✅ Try switching from/to locations
- ✅ Refresh page and try again

### Map Not Loading:
- ✅ Check browser JavaScript is enabled
- ✅ Allow location permissions
- ✅ Clear browser cache
- ✅ Try different browser
- ✅ Refresh the page

### Photo Upload Failed:
- ✅ Check file size (max 5MB)
- ✅ Verify file format (JPG, PNG, GIF)
- ✅ Ensure stable internet connection
- ✅ Try resizing image

---

## 📞 Support

### Getting Help:
1. Review this user guide
2. Check troubleshooting section
3. Read error messages carefully
4. Contact administrator if needed

### Best Practices:
- Keep browser updated
- Use stable internet connection
- Clear cache if experiencing issues
- Report bugs to admin

---

**User Role**: Regular User  
**Access Level**: Standard  
**Last Updated**: November 30, 2025  
**Version**: 1.0
