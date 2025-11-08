# Profile Page Testing Guide

## Quick Test Checklist

### ✅ Pre-requisites
- [ ] Backend running on port 5004
- [ ] Frontend running on port 3000/3001
- [ ] User account created and logged in
- [ ] MongoDB connected successfully

---

## Test 1: Profile Photo Upload

### Steps:
1. Navigate to Profile page (`/profile`)
2. Click the **"📷 Upload Photo"** button
3. Select an image file from your computer
4. Wait for upload to complete

### Expected Results:
- ✅ Upload button shows "⏳ Uploading..." during upload
- ✅ Photo appears in the profile avatar (large circle)
- ✅ Photo also appears in header avatar (top-right)
- ✅ Success message: "Profile photo updated successfully!"
- ✅ File saved to `backend/uploads/profiles/`

### Test Different Scenarios:

**Valid Image:**
```
File: photo.jpg
Size: 500 KB
Expected: ✅ Uploads successfully
```

**Too Large:**
```
File: large-photo.jpg
Size: 3 MB
Expected: ❌ Error: "File size must be less than 2MB"
```

**Wrong Type:**
```
File: document.pdf
Expected: ❌ Error: "Please upload a valid image file"
```

**Second Upload (Replace):**
```
File: new-photo.png
Expected: ✅ Uploads successfully, old photo deleted
```

---

## Test 2: Profile Photo Delete

### Steps:
1. Have a profile photo uploaded
2. Click the **"🗑️ Delete"** button
3. Confirm deletion in the dialog

### Expected Results:
- ✅ Confirmation dialog appears: "Are you sure?"
- ✅ Photo removed from profile and header
- ✅ Shows default avatar: 👤
- ✅ Success message: "Profile photo deleted successfully!"
- ✅ File removed from server

---

## Test 3: Edit Profile - Name & Email

### Steps:
1. Click **"✏️ Edit Profile"** button
2. Change "Full Name" to something new
3. Change "Email" to a new email
4. Click **"💾 Save Changes"**

### Expected Results:
- ✅ Form switches to edit mode with input fields
- ✅ Current values pre-filled
- ✅ Name updates in UI
- ✅ Email updates in UI
- ✅ Form exits edit mode
- ✅ Success message: "Profile updated successfully!"

### Test Invalid Data:

**Short Name:**
```
Full Name: "A"
Expected: ❌ Error: "Full name must be at least 2 characters"
```

**Invalid Email:**
```
Email: "not-an-email"
Expected: ❌ Error: "Please provide a valid email"
```

**Duplicate Email:**
```
Email: "existing@user.com"
Expected: ❌ Error: "Email already in use"
```

---

## Test 4: Change Password

### Steps:
1. Click **"✏️ Edit Profile"**
2. Scroll to password section
3. Enter current password: `your-current-password`
4. Enter new password: `newpassword123`
5. Confirm new password: `newpassword123`
6. Click **"💾 Save Changes"**

### Expected Results:
- ✅ Password fields cleared after save
- ✅ Success message: "Profile updated successfully!"
- ✅ Can logout and login with new password

### Test Password Errors:

**Wrong Current Password:**
```
Current: "wrongpassword"
Expected: ❌ Error: "Current password is incorrect"
```

**Passwords Don't Match:**
```
New Password: "newpass123"
Confirm: "differentpass"
Expected: ❌ Error: "New passwords do not match"
```

**Too Short:**
```
New Password: "12345"
Expected: ❌ Error: "New password must be at least 6 characters"
```

**Missing Current Password:**
```
New Password: "newpass123"
Current Password: (empty)
Expected: ✅ Only name/email update, password unchanged
```

---

## Test 5: View Reported Hazards

### Pre-requisite:
- Report some hazards from Map Dashboard

### Steps:
1. Navigate to Profile page
2. Scroll to **"My Reported Hazards"** section
3. Check the table

### Expected Results:
- ✅ Table shows all your reported hazards
- ✅ Columns: Hazard Type, Location, Date Reported, Status
- ✅ Status badges color-coded:
  - 🟢 Verified = Green
  - 🟡 Pending = Yellow
  - ⚪ Resolved = Gray
- ✅ Dates formatted nicely (e.g., "Oct 31, 2024, 10:30 AM")
- ✅ Location shows address

### Test Empty State:

**No Hazards Reported:**
```
Expected:
- 📍 icon
- Message: "No hazards reported yet"
- Button: "Go to Map Dashboard"
```

---

## Test 6: Profile Statistics

### Check Statistics Box:

```
Expected Display:
┌─────────────────────────┐
│ Total Reports:    15    │
│ Verified:         10    │
│ Pending:          3     │
│ Resolved:         2     │
└─────────────────────────┘
```

### Verify Counts:
- ✅ Total = Sum of all your hazards
- ✅ Verified = Green badge count
- ✅ Pending = Yellow badge count
- ✅ Resolved = Gray badge count

---

## Test 7: Cancel Edit

### Steps:
1. Click **"✏️ Edit Profile"**
2. Change some fields
3. Click **"❌ Cancel"**

### Expected Results:
- ✅ Form exits edit mode
- ✅ Changes discarded (original values shown)
- ✅ No API call made
- ✅ No success message

---

## Test 8: Loading States

### Steps:
1. Logout
2. Login again
3. Navigate to Profile page immediately

### Expected Results:
- ✅ Shows loading spinner: 🔄
- ✅ Message: "Loading profile..."
- ✅ Then profile loads and displays

---

## Test 9: Authentication

### Test Without Login:

**Steps:**
1. Clear localStorage (or logout)
2. Try to access `/profile`

**Expected:**
- ✅ Redirects to `/login`

### Test With Expired Token:

**Steps:**
1. Set invalid token in localStorage
2. Navigate to `/profile`

**Expected:**
- ✅ Shows error or redirects to login

---

## Test 10: Photo Display Consistency

### Check Avatar Appears In:
- ✅ Profile page (large avatar)
- ✅ Header navigation (top-right)
- ✅ Both show same photo
- ✅ Both update when photo changed
- ✅ Both show 👤 when no photo

---

## API Testing with Postman

### 1. Get Profile
```
GET http://localhost:5004/api/users/profile
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "avatar": "/uploads/profiles/profile-123-456.jpg",
      ...
    },
    "stats": {
      "totalReports": 15,
      "verifiedReports": 10,
      "totalRoutes": 5
    }
  }
}
```

### 2. Upload Profile Photo
```
POST http://localhost:5004/api/upload/profile-photo
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body:
  Form-data
  Key: avatar
  Value: [Select File]
```

Expected Response:
```json
{
  "success": true,
  "message": "Profile photo uploaded successfully",
  "data": {
    "url": "/uploads/profiles/profile-123-456.jpg",
    "size": 245678,
    "mimetype": "image/jpeg"
  }
}
```

### 3. Update Profile
```
PUT http://localhost:5004/api/users/profile
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
Body:
{
  "fullName": "John Doe Updated",
  "email": "john.updated@example.com"
}
```

### 4. Delete Profile Photo
```
DELETE http://localhost:5004/api/upload/profile-photo
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Get My Hazards
```
GET http://localhost:5004/api/users/my-hazards?limit=10&status=Verified
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Browser Console Commands

### Get Current Token:
```javascript
localStorage.getItem('token')
```

### Set Test Token:
```javascript
localStorage.setItem('token', 'YOUR_TOKEN_HERE')
```

### Clear Token (Logout):
```javascript
localStorage.removeItem('token')
```

### Check User Data:
```javascript
// In React DevTools, find Profile component
// Check state: user, reports, stats
```

---

## File System Checks

### Backend Directory:
```powershell
# Check if profiles folder exists
ls e:\SafeRoute\backend\uploads\profiles

# Check uploaded files
ls e:\SafeRoute\backend\uploads\profiles\*.jpg
ls e:\SafeRoute\backend\uploads\profiles\*.png
```

### File Naming:
```
Expected format:
profile-{userId}-{timestamp}.{ext}

Example:
profile-6543210abcdef-1730304000000.jpg
```

---

## Common Issues & Solutions

### Issue: Photo not displaying
**Solution:**
- Check browser console for 404 errors
- Verify file exists in `backend/uploads/profiles/`
- Check backend is serving `/uploads` route
- Verify full URL: `http://localhost:5004/uploads/profiles/filename.jpg`

### Issue: "No file uploaded" error
**Solution:**
- Check field name is `avatar` (not `photo`)
- Verify file is selected before submit
- Check file type is valid (JPEG, PNG, GIF, WebP)

### Issue: Profile not loading
**Solution:**
- Check if logged in (token exists)
- Verify backend is running on port 5004
- Check MongoDB connection
- Check browser console for errors

### Issue: Upload button stays "Uploading..."
**Solution:**
- Check browser network tab for failed request
- Verify backend is running
- Check file size (< 2MB)
- Check server logs for errors

### Issue: Old photo not deleted
**Solution:**
- Check server has write permissions
- Verify file path is correct
- Check server logs for deletion errors

---

## Success Criteria

All tests should:
- ✅ No console errors
- ✅ No network errors (check Network tab)
- ✅ Proper loading states shown
- ✅ User-friendly error messages
- ✅ UI updates immediately after actions
- ✅ Data persists after page refresh
- ✅ Works on different browsers
- ✅ Responsive on mobile devices

---

## Performance Checks

- [ ] Profile loads within 2 seconds
- [ ] Photo upload completes within 5 seconds
- [ ] No lag when switching edit mode
- [ ] Smooth animations and transitions
- [ ] Images load quickly (< 1 second)

---

**Happy Testing! 🚀**

If you encounter any issues, check:
1. Browser console
2. Network tab
3. Backend terminal logs
4. MongoDB connection
5. File system permissions
