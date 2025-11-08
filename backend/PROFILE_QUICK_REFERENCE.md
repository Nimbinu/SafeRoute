# Profile Features Quick Reference

## 🎯 What's New

✅ **Profile Photo Upload** - Users can upload, view, and delete profile photos  
✅ **Profile Editing** - Update name, email, and password  
✅ **My Hazards** - View all hazards you've reported  
✅ **Statistics** - See your report counts (Total, Verified, Pending, Resolved)  
✅ **Real Backend Integration** - All data comes from MongoDB via API

---

## 📡 API Endpoints

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/users/profile` | GET | Get user profile + stats | ✅ Required |
| `/api/users/profile` | PUT | Update profile | ✅ Required |
| `/api/users/profile` | DELETE | Delete account (soft) | ✅ Required |
| `/api/users/my-hazards` | GET | Get user's hazards | ✅ Required |
| `/api/users/preferences` | PATCH | Update preferences | ✅ Required |
| `/api/upload/profile-photo` | POST | Upload profile photo | ✅ Required |
| `/api/upload/profile-photo` | DELETE | Delete profile photo | ✅ Required |

---

## 💾 File Upload Specs

### Profile Photos
- **Field name:** `avatar`
- **Location:** `backend/uploads/profiles/`
- **Formats:** JPEG, JPG, PNG, GIF, WebP
- **Max size:** 2MB
- **Naming:** `profile-{userId}-{timestamp}.{ext}`

### Hazard Photos (existing)
- **Field name:** `photo`
- **Location:** `backend/uploads/hazards/`
- **Formats:** JPEG, JPG, PNG, GIF, WebP
- **Max size:** 5MB
- **Naming:** `hazard-{timestamp}-{random}.{ext}`

---

## 🔧 Frontend Usage

### Upload Photo
```javascript
const handlePhotoUpload = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await fetch(`${API_BASE_URL}/api/upload/profile-photo`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  const data = await response.json();
  if (data.success) {
    setUser({ ...user, avatar: data.data.url });
  }
};
```

### Display Photo
```jsx
{user?.avatar ? (
  <img src={`${API_BASE_URL}${user.avatar}`} alt="Profile" />
) : (
  <span>👤</span>
)}
```

### Update Profile
```javascript
const updateProfile = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  
  const data = await response.json();
  if (data.success) {
    setUser(data.data.user);
  }
};
```

---

## 🗂️ Files Modified/Created

### Backend
```
✅ backend/middleware/upload.js          - Added profile photo storage
✅ backend/controllers/uploadController.js - Added upload/delete functions
✅ backend/routes/upload.js              - Added profile photo routes
✅ backend/controllers/userController.js - (Already had profile endpoints)
✅ backend/routes/users.js               - (Already had profile routes)
📄 backend/PROFILE_API.md                - API documentation
📄 backend/PROFILE_IMPLEMENTATION.md     - Implementation guide
📄 backend/TESTING_PROFILE.md            - Testing guide
```

### Frontend
```
✅ frontend/src/pages/Profile.jsx        - Complete rewrite with backend
📦 frontend/src/pages/Profile_OLD.jsx    - Backup of original
```

---

## 🔐 Authentication

All profile endpoints require JWT token:

```javascript
// Get token
const token = localStorage.getItem('token');

// Use in headers
headers: {
  'Authorization': `Bearer ${token}`
}
```

**Token Location:** `localStorage.getItem('token')`  
**Set After Login:** API returns token after successful login

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation errors..."]
}
```

---

## 🎨 UI Components

### Profile Avatar (Large)
- Size: 100px × 100px circle
- Shows uploaded photo or 👤
- Located in profile card (left sidebar)

### Header Avatar (Small)
- Size: 40px × 40px circle
- Shows same photo as profile
- Located in header (top-right)

### Upload Button
```jsx
<label className="btn-upload-photo">
  📷 Upload Photo
  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
</label>
```

### Delete Button
```jsx
{user?.avatar && (
  <button onClick={handleDeletePhoto}>
    🗑️ Delete
  </button>
)}
```

### Edit Form
- Toggle with `isEditing` state
- Shows inline in profile card
- Save/Cancel buttons

---

## 📈 Statistics Display

```jsx
<div className="profile-stats">
  <div>Total Reports: {stats.total}</div>
  <div>Verified: {stats.verified}</div>
  <div>Pending: {stats.pending}</div>
  <div>Resolved: {stats.resolved}</div>
</div>
```

**Data Source:** `GET /api/users/profile` → `data.stats`

---

## 🏷️ Status Badges

### CSS Classes
- `.status-verified` → Green (Verified hazards)
- `.status-pending` → Yellow (Pending hazards)
- `.status-resolved` → Gray (Resolved hazards)

### Usage
```jsx
<span className={`status-badge ${getStatusClass(report.status)}`}>
  {report.status}
</span>
```

---

## 🔄 Data Flow

### On Page Load
```
1. Component mounts
2. fetchUserProfile() → GET /api/users/profile
3. fetchUserHazards() → GET /api/users/my-hazards
4. Set user, stats, reports state
5. Render UI
```

### On Photo Upload
```
1. User selects file
2. Validate (type, size)
3. Create FormData with 'avatar'
4. POST /api/upload/profile-photo
5. Backend: Save file, delete old, update DB
6. Response: { url: "/uploads/profiles/..." }
7. Update user.avatar in state
8. UI re-renders with new photo
```

### On Profile Update
```
1. User clicks Edit
2. Modify form fields
3. Click Save
4. PUT /api/users/profile
5. Backend: Validate, update DB
6. Response: { user: {...} }
7. Update user state
8. Exit edit mode
```

---

## 🐛 Error Handling

### File Upload Errors
```javascript
// Client-side validation
if (file.size > 2 * 1024 * 1024) {
  alert('File size must be less than 2MB');
  return;
}

if (!validTypes.includes(file.type)) {
  alert('Please upload a valid image file');
  return;
}

// Server-side errors
try {
  const response = await fetch(...);
  const data = await response.json();
  if (!data.success) {
    alert(data.message);
  }
} catch (err) {
  alert('Failed to upload photo');
}
```

### Profile Update Errors
```javascript
// Password validation
if (newPassword !== confirmPassword) {
  alert('New passwords do not match');
  return;
}

// Backend validation
if (!data.success) {
  alert(data.message); // e.g., "Email already in use"
}
```

---

## 🗄️ Database Fields

### User Schema (relevant)
```javascript
{
  fullName: String,      // User's name
  email: String,         // Unique email
  password: String,      // Hashed (bcrypt)
  avatar: String,        // "/uploads/profiles/..." or null
  role: String,          // 'user' | 'admin' | 'moderator'
  isActive: Boolean,     // Account status
  preferences: Object,   // User settings
  createdAt: Date,       // Account creation
  lastLogin: Date        // Last login time
}
```

---

## 🔒 Security Notes

1. **File Upload:**
   - Only images allowed (MIME type check)
   - Size limits enforced (2MB profiles)
   - Unique filenames (prevent overwrites)
   - Old files deleted automatically

2. **Password:**
   - Bcrypt hashing (10 salt rounds)
   - Current password required for changes
   - Never returned in responses
   - Minimum 6 characters

3. **Authentication:**
   - JWT tokens required
   - Token validation on every request
   - Auto-redirect if not logged in

4. **Data Access:**
   - Users can only see their own data
   - Role-based access for admin routes
   - Soft deletes preserve data

---

## 📝 Environment Variables

```bash
# Backend (.env)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5004

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5004
```

---

## 🚀 Quick Start

### 1. Ensure Backend Running
```powershell
cd e:\SafeRoute\backend
npm run dev
# Should see: Server running on port 5004
```

### 2. Ensure Frontend Running
```powershell
cd e:\SafeRoute\frontend
npm run dev
# Should see: Local: http://localhost:3000
```

### 3. Test Profile Page
1. Login to application
2. Navigate to `/profile`
3. Upload a photo
4. Edit your profile
5. Check your hazards

---

## 📚 Documentation Files

1. **PROFILE_API.md** - Complete API reference
2. **PROFILE_IMPLEMENTATION.md** - Implementation details & guide
3. **TESTING_PROFILE.md** - Testing checklist & scenarios
4. **PROFILE_QUICK_REFERENCE.md** - This file!

---

## 💡 Tips

- Use browser DevTools Network tab to debug API calls
- Check backend terminal for server logs
- Use React DevTools to inspect component state
- Test with different file types/sizes
- Verify file permissions on uploads folder
- Clear localStorage if having auth issues

---

## 🎯 Key Functions

### Profile.jsx
```javascript
fetchUserProfile()      // Load user data
fetchUserHazards()      // Load user's hazards
handlePhotoUpload()     // Upload profile photo
handleDeletePhoto()     // Delete profile photo
handleUpdateProfile()   // Update name/email/password
getStatusClass()        // Get badge color for status
formatDate()            // Format timestamp to readable
```

---

## ✅ Verification Checklist

Before considering it complete:
- [ ] Can upload profile photo
- [ ] Photo appears in profile and header
- [ ] Can delete profile photo
- [ ] Can update name and email
- [ ] Can change password
- [ ] Hazards display correctly
- [ ] Statistics show correct counts
- [ ] Status badges color-coded
- [ ] Loading states work
- [ ] Error messages clear
- [ ] Responsive on mobile
- [ ] No console errors

---

**Need help?** Check the full documentation in:
- `backend/PROFILE_API.md`
- `backend/PROFILE_IMPLEMENTATION.md`
- `backend/TESTING_PROFILE.md`
