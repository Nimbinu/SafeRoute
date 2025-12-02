# SafeRoute Testing Roadmap - User Perspective

## Prerequisites
- Email: sandali12@gmail.com
- Password: password123
- Browser with location permission enabled
- Internet connection

---

## 1. Registration & Login Testing

### Register New User (Optional)
1. Go to `http://localhost:3000/register`
2. Fill in registration form:
   - Full Name: Test User
   - Email: testuser@gmail.com
   - Password: password123
   - Confirm Password: password123
3. Click "Sign Up"
4. **Expected**: Redirected to dashboard with success message

### Login as Existing User
1. Go to `http://localhost:3000/login`
2. Enter credentials:
   - Email: sandali12@gmail.com
   - Password: password123
3. Click "Login"
4. **Expected**: Redirected to `/dashboard`

---

## 2. Map Dashboard Testing

### Location Features
1. **Allow location permission** when browser prompts
2. **Expected**: Map centers on your current location
3. Check top-left corner shows your location name
4. **Expected**: Your location address is displayed

### View Hazards
1. Look for hazard markers on the map (📍 pins)
2. Click on any hazard marker
3. **Expected**: Info window shows:
   - Hazard type with icon
   - Description
   - Reporter name
   - Severity level
   - Time ago
   - Status (Active/Resolved)

### Filter Hazards
1. Click "Filter Hazards" button (top-right)
2. Toggle different hazard types:
   - ✓ Accident
   - ✓ Pothole
   - ✓ Traffic Jam
   - ✓ Construction, etc.
3. **Expected**: Map updates to show only selected types

### Report New Hazard
1. Click "Report Hazard" button
2. Modal opens - fill in:
   - **Type**: Select from dropdown (Accident, Pothole, etc.)
   - **Description**: "Test hazard report from user"
   - **Severity**: Select (Low/Medium/High)
   - **Location**: Should auto-fill with current location
3. Click "Use My Current Location" to auto-populate
4. Optionally upload a photo
5. Click "Submit Report"
6. **Expected**: 
   - Success message appears
   - New hazard appears on map
   - Modal closes

### Search Location
1. Click on search bar at top
2. Type a location (e.g., "Colombo Fort")
3. Select from suggestions
4. **Expected**: Map centers on searched location

---

## 3. Safe Route Planning

### Find Safe Route
1. Click "Safe Route" in sidebar OR navigate to `/safe-route`
2. Enter route details:
   - **From**: Your current location (or search)
   - **To**: Destination address
   - **Route Type**: Safest/Fastest/Shortest
3. Click "Find Route" or "Get Safe Route"
4. **Expected**:
   - Route displayed on map
   - Hazards along route highlighted
   - Distance and estimated time shown
   - Alternative routes suggested

### Save Route
1. After finding a route, click "Save Route"
2. Enter route name
3. **Expected**: Route saved to your profile

---

## 4. Profile Management

### View Profile
1. Click profile icon/button in header
2. Navigate to `/profile`
3. **Expected**: See your profile information:
   - Full Name
   - Email
   - Profile picture (if uploaded)

### Update Profile
1. On profile page, click "Edit Profile"
2. Update:
   - Full Name
   - Profile Picture (upload new image)
3. Click "Save Changes"
4. **Expected**: Profile updated successfully

### View Reported Hazards
1. Scroll to "My Hazard Reports" section
2. **Expected**: See list of hazards you reported
3. Check each hazard shows:
   - Type and description
   - Status (Pending/Verified/Resolved)
   - Date reported

### View Saved Locations
1. Go to "Saved Locations" section
2. **Expected**: See locations you saved
3. Click on a location to view on map

### View Saved Routes
1. Go to "Saved Routes" section
2. **Expected**: See routes you saved
3. Click on a route to view/navigate

---

## 5. Settings & Preferences

### Open Settings
1. Click settings icon (⚙️) on dashboard
2. **Expected**: Settings panel opens

### Adjust Preferences
1. Toggle notification settings
2. Change default route type
3. Adjust hazard alert radius
4. **Expected**: Settings saved

### Reset Map View
1. In settings, click "Reset Map View"
2. **Expected**: Map returns to your current location

---

## 6. Logout Testing

### Logout
1. Click settings or profile menu
2. Click "Logout" button
3. **Expected**: 
   - Logged out successfully
   - Redirected to `/login`
   - Cannot access `/dashboard` without login

---

## 7. Edge Cases & Error Handling

### Deny Location Permission
1. Logout and login again
2. When prompted, **deny location permission**
3. **Expected**: 
   - Error message displayed
   - Map still loads (default view)
   - Can manually search for location

### Submit Empty Report
1. Click "Report Hazard"
2. Try to submit without filling required fields
3. **Expected**: Validation errors shown

### Invalid Login
1. Go to login page
2. Enter wrong password
3. **Expected**: "Invalid email or password" error

---

## Expected User Flow Summary

✅ Register → ✅ Login → ✅ View Map → ✅ Allow Location → ✅ See Hazards → ✅ Report Hazard → ✅ Find Safe Route → ✅ Save Route → ✅ Update Profile → ✅ Logout

---

## Notes
- Test on different browsers (Chrome, Firefox, Edge)
- Test on mobile devices for responsive design
- Check all buttons and links work correctly
- Verify all error messages are user-friendly
