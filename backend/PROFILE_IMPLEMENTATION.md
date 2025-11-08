# Profile Page Backend Integration - Summary

## ✅ What We've Built

### Backend Components Created/Updated:

#### 1. **Upload Middleware** (`backend/middleware/upload.js`)
- **Enhanced** to support both hazard and profile photo uploads
- Created separate storage configurations:
  - `profileStorage`: Saves to `uploads/profiles/`
  - `hazardStorage`: Saves to `uploads/hazards/`
- Exports both upload handlers:
  - `upload.profile`: For profile photos (2MB limit)
  - `upload.hazard`: For hazard photos (5MB limit)
- Auto-creates directories if they don't exist
- Validates file types (JPEG, PNG, GIF, WebP only)

#### 2. **Upload Controller** (`backend/controllers/uploadController.js`)
- **Added** two new functions:
  - `uploadProfilePhoto`: Handles profile photo upload, auto-deletes old photo
  - `deleteProfilePhoto`: Removes profile photo and updates database
- Both functions:
  - Validate authentication
  - Update user's `avatar` field in database
  - Handle file system operations safely
  - Return proper success/error responses

#### 3. **Upload Routes** (`backend/routes/upload.js`)
- **Added** new routes:
  - `POST /api/upload/profile-photo` - Upload profile photo
  - `DELETE /api/upload/profile-photo` - Delete profile photo
- Uses `upload.profile.single('avatar')` middleware
- Requires authentication for both routes

#### 4. **User Controller** (Already existed, verified functionality)
- `getUserProfile`: Returns user data + statistics
- `updateUserProfile`: Updates name, email, password
- `getUserHazards`: Returns user's reported hazards with pagination
- `updateUserPreferences`: Updates notification and route preferences
- `deleteUserAccount`: Soft delete (deactivates account)

---

### Frontend Components Created:

#### 1. **Updated Profile Page** (`frontend/src/pages/Profile.jsx`)

**New Features:**
- ✅ Real-time data from backend API
- ✅ Profile photo upload with drag-and-drop support
- ✅ Profile photo preview and display
- ✅ Delete profile photo button
- ✅ Edit profile form (inline editing)
- ✅ Update name, email, and password
- ✅ Real user statistics (total/verified/pending/resolved reports)
- ✅ Display actual hazards from database
- ✅ Proper loading states and error handling
- ✅ Responsive design maintained

**State Management:**
```javascript
- user: Current user data (from /api/users/profile)
- reports: User's hazard reports (from /api/users/my-hazards)
- stats: Counts of reports by status
- loading: Loading state
- isEditing: Toggle edit mode
- uploadingPhoto: Photo upload progress
- formData: Form fields for editing
```

**API Integrations:**
1. **Fetch Profile:**
   - `GET /api/users/profile`
   - Loads user data and statistics on mount
   - Redirects to login if no token

2. **Fetch Hazards:**
   - `GET /api/users/my-hazards?limit=10`
   - Displays user's reported hazards
   - Shows counts by status

3. **Upload Photo:**
   - `POST /api/upload/profile-photo`
   - FormData with 'avatar' field
   - 2MB limit, image files only
   - Auto-updates UI on success

4. **Delete Photo:**
   - `DELETE /api/upload/profile-photo`
   - Confirmation dialog before deletion
   - Updates UI immediately

5. **Update Profile:**
   - `PUT /api/users/profile`
   - Updates name, email, and/or password
   - Validates password match
   - Requires current password for password changes

**User Experience Features:**
- Photo upload button with file input
- Delete photo button (only shows if photo exists)
- Loading spinner during photo upload
- Edit/Cancel buttons for profile editing
- Password fields only required when changing password
- Stats display (Total, Verified, Pending, Resolved)
- Empty state when no hazards reported
- Formatted dates (e.g., "Oct 31, 2024, 10:30 AM")
- Status badges with color coding:
  - 🟢 Verified (green)
  - 🟡 Pending (yellow)
  - ⚪ Resolved (gray)

---

## 📁 File Structure

```
backend/
├── controllers/
│   ├── uploadController.js       ✅ UPDATED (added profile photo functions)
│   └── userController.js          ✅ VERIFIED (already complete)
├── middleware/
│   └── upload.js                  ✅ UPDATED (separate profile/hazard storage)
├── models/
│   └── User.js                    ✅ VERIFIED (has avatar field)
├── routes/
│   ├── upload.js                  ✅ UPDATED (added profile photo routes)
│   └── users.js                   ✅ VERIFIED (already has profile routes)
├── uploads/
│   ├── hazards/                   ✅ CREATED (auto-created by middleware)
│   └── profiles/                  ✅ CREATED (auto-created by middleware)
├── PROFILE_API.md                 ✅ NEW (API documentation)
└── server.js                      ✅ VERIFIED (serves /uploads correctly)

frontend/
└── src/
    └── pages/
        ├── Profile.jsx            ✅ REPLACED (backend-integrated version)
        └── Profile_OLD.jsx        ✅ BACKUP (original version)
```

---

## 🔧 How It Works

### Photo Upload Flow:

1. **User clicks "Upload Photo" button**
   ```javascript
   <input type="file" onChange={handlePhotoUpload} />
   ```

2. **File validation (client-side)**
   - Check file type (JPEG, PNG, GIF, WebP)
   - Check file size (< 2MB)
   - Show error if invalid

3. **Upload to backend**
   ```javascript
   FormData with: avatar: [File object]
   → POST /api/upload/profile-photo
   → Multer middleware validates and saves
   → Old photo deleted from server
   → User.avatar updated in MongoDB
   ```

4. **Update UI**
   ```javascript
   setUser({ ...user, avatar: data.data.url })
   // Avatar now shows: /uploads/profiles/profile-userId-timestamp.jpg
   ```

5. **Display photo**
   ```jsx
   <img src={`${API_BASE_URL}${user.avatar}`} />
   // Full URL: http://localhost:5004/uploads/profiles/profile-userId-timestamp.jpg
   ```

### Profile Update Flow:

1. **User clicks "Edit Profile"**
   - Shows inline form with current values

2. **User modifies fields and clicks "Save"**
   ```javascript
   {
     fullName: "New Name",
     email: "new@email.com",
     currentPassword: "old123",  // Optional
     newPassword: "new456"        // Optional
   }
   → PUT /api/users/profile
   → Backend validates
   → Updates database
   → Returns updated user
   ```

3. **UI updates**
   - Exit edit mode
   - Show updated information
   - Clear password fields

### Hazards Display:

1. **Fetch on page load**
   ```javascript
   GET /api/users/my-hazards?limit=10
   → Returns hazards array + counts
   ```

2. **Display in table**
   - Hazard type
   - Location address
   - Formatted date
   - Status badge with color

3. **Empty state**
   - Shows if no hazards reported
   - Button to navigate to dashboard

---

## 🧪 Testing Guide

### 1. Test Profile Photo Upload

**Steps:**
1. Login to the application
2. Navigate to Profile page
3. Click "📷 Upload Photo" button
4. Select an image file (JPEG, PNG, GIF, or WebP)
5. Wait for upload (should see "⏳ Uploading...")
6. Photo should appear in profile avatar

**Expected Results:**
- ✅ Photo uploads successfully
- ✅ Old photo deleted (if exists)
- ✅ Avatar updates in header and profile card
- ✅ File saved to `backend/uploads/profiles/`
- ✅ Database updated with avatar URL

**Edge Cases to Test:**
- ❌ File too large (>2MB) → Should show error
- ❌ Wrong file type (PDF, TXT) → Should show error
- ❌ No file selected → Should do nothing
- ✅ Upload new photo → Old photo deleted
- ✅ Upload without existing photo → Works

### 2. Test Profile Update

**Steps:**
1. Click "✏️ Edit Profile" button
2. Modify name and/or email
3. Click "💾 Save Changes"
4. Verify updates appear

**Expected Results:**
- ✅ Name updates in UI immediately
- ✅ Email updates in UI immediately
- ✅ Database updated
- ✅ Form exits edit mode

**With Password Change:**
1. Enter current password
2. Enter new password
3. Confirm new password
4. Save changes

**Expected Results:**
- ✅ Password updated in database (hashed)
- ✅ Can login with new password
- ✅ Password fields cleared after save

**Edge Cases:**
- ❌ New passwords don't match → Should show error
- ❌ Wrong current password → Should show error
- ❌ New password < 6 chars → Should show error
- ✅ Update without password change → Works

### 3. Test Profile Photo Delete

**Steps:**
1. Have a profile photo uploaded
2. Click "🗑️ Delete" button
3. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Photo removed from UI
- ✅ File deleted from server
- ✅ Database avatar set to null
- ✅ Shows default avatar (👤)

### 4. Test Hazards Display

**Steps:**
1. Have some reported hazards in database
2. Navigate to Profile page
3. Scroll to "My Reported Hazards" section

**Expected Results:**
- ✅ Shows all user's hazards
- ✅ Displays correct hazard type
- ✅ Shows location address
- ✅ Formatted date (e.g., "Oct 31, 2024, 10:30 AM")
- ✅ Status badge with correct color:
  - Verified = Green
  - Pending = Yellow
  - Resolved = Gray

**Empty State:**
- ✅ Shows message if no hazards
- ✅ Shows "Go to Map Dashboard" button

### 5. Test Statistics

**Expected Results:**
- ✅ Total Reports: Sum of all hazards
- ✅ Verified: Count of verified hazards
- ✅ Pending: Count of pending hazards
- ✅ Resolved: Count of resolved hazards

---

## 🔐 Security Features

1. **Authentication Required:**
   - All endpoints require valid JWT token
   - Token validated via `authMiddleware`
   - Redirect to login if no token

2. **File Upload Security:**
   - File type validation (images only)
   - File size limits (2MB profiles, 5MB hazards)
   - Unique filenames prevent collisions
   - Old files automatically deleted

3. **Password Security:**
   - Passwords hashed with bcrypt
   - Current password required for changes
   - Minimum 6 characters enforced
   - Passwords never returned in API responses

4. **Data Validation:**
   - Email format validation
   - Name length constraints (2-100 chars)
   - SQL injection prevention via Mongoose

5. **Privacy:**
   - Users can only access their own data
   - Profile updates only affect own account
   - Soft delete preserves data integrity

---

## 📊 Database Schema

### User Model (relevant fields)
```javascript
{
  fullName: String,           // User's full name
  email: String,              // Unique email
  password: String,           // Hashed password (bcrypt)
  avatar: String,             // URL to profile photo (e.g., "/uploads/profiles/profile-123-456.jpg")
  role: String,               // 'user' | 'admin' | 'moderator'
  isActive: Boolean,          // Account active status
  preferences: {
    notifications: Boolean,
    defaultRouteType: String,
    hazardAlertRadius: Number
  },
  createdAt: Date,
  lastLogin: Date
}
```

---

## 🚀 Next Steps / Enhancements

### Suggested Improvements:

1. **Image Optimization:**
   - Add image compression before upload
   - Generate thumbnails for faster loading
   - Use WebP format for better compression

2. **Profile Features:**
   - Add bio/description field
   - Add phone number field
   - Add location/city field
   - Add profile visibility settings

3. **Photo Gallery:**
   - Show all photos user has uploaded (for hazards)
   - Photo management (view, delete multiple)
   - Photo analytics (views, reports)

4. **Enhanced Statistics:**
   - Add graphs/charts for reports over time
   - Show most reported hazard type
   - Show most active areas
   - Add achievements/badges

5. **Social Features:**
   - Add following/followers
   - Public profile page
   - Activity feed
   - Leaderboard (most reports, most verified)

6. **Notifications:**
   - Email notifications for hazard updates
   - Push notifications for nearby hazards
   - Notification settings management

7. **Account Management:**
   - Two-factor authentication (2FA)
   - Login history/sessions
   - Export user data (GDPR compliance)
   - Hard delete option (with confirmation)

---

## 📖 API Documentation

Full API documentation available in: **`backend/PROFILE_API.md`**

Includes:
- All endpoint details
- Request/response examples
- Authentication instructions
- Error handling
- Testing with cURL/Postman
- Frontend integration examples

---

## ✨ Key Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Profile Photo Upload | ✅ Complete | Upload, preview, and delete profile photos |
| Profile Editing | ✅ Complete | Update name, email, and password |
| Hazards Display | ✅ Complete | View all user-reported hazards with stats |
| Statistics | ✅ Complete | Real-time counts of reports by status |
| Authentication | ✅ Complete | JWT-based secure authentication |
| File Validation | ✅ Complete | Type and size validation for uploads |
| Auto Delete | ✅ Complete | Old photos deleted on new upload |
| Loading States | ✅ Complete | UI feedback during async operations |
| Error Handling | ✅ Complete | User-friendly error messages |
| Responsive Design | ✅ Complete | Works on all screen sizes |

---

## 🐛 Troubleshooting

### Photo not uploading?
- Check file size (< 2MB)
- Verify file type (JPEG, PNG, GIF, WebP)
- Check browser console for errors
- Verify backend is running on port 5004
- Check `uploads/profiles/` folder exists

### Profile not loading?
- Check if logged in (token in localStorage)
- Verify backend is running
- Check browser console for errors
- Verify MongoDB connection

### Photo not displaying?
- Check browser network tab
- Verify URL is correct: `http://localhost:5004/uploads/profiles/...`
- Check file exists in `backend/uploads/profiles/`
- Verify server.js serves `/uploads` route

### Updates not saving?
- Check validation errors in response
- Verify all required fields filled
- Check if email already in use
- Verify current password (for password changes)

---

## 📝 Notes

- Backend runs on port **5004**
- Frontend should use `http://localhost:5004` for API calls
- All file URLs are relative: `/uploads/profiles/filename.jpg`
- Display with: `${API_BASE_URL}${user.avatar}`
- Token stored in localStorage as 'token'
- Token expires after 7 days
- Photos stored locally in `backend/uploads/`
- MongoDB required for all operations

---

**Created:** October 31, 2025  
**Backend:** Node.js + Express + MongoDB  
**Frontend:** React + Vite  
**Authentication:** JWT  
**File Upload:** Multer
