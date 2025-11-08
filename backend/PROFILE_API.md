# Profile Management API Documentation

## Overview
This document describes the backend API endpoints for user profile management, including profile photo uploads, profile updates, and user statistics.

---

## Endpoints

### 1. Get User Profile
**GET** `/api/users/profile`

Get the authenticated user's profile information with statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "avatar": "/uploads/profiles/profile-userid-timestamp.jpg",
      "role": "user",
      "isActive": true,
      "preferences": {
        "notifications": true,
        "defaultRouteType": "safest",
        "hazardAlertRadius": 5000
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "stats": {
      "totalReports": 15,
      "verifiedReports": 10,
      "totalRoutes": 5
    }
  }
}
```

---

### 2. Update User Profile
**PUT** `/api/users/profile`

Update user profile information including name, email, and password.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "currentPassword": "oldpassword123",  // Optional, required if changing password
  "newPassword": "newpassword456"       // Optional
}
```

**Validation Rules:**
- `fullName`: Minimum 2 characters
- `email`: Valid email format
- `newPassword`: Minimum 6 characters (if provided)
- `currentPassword`: Required if changing password

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "avatar": "/uploads/profiles/profile-userid-timestamp.jpg",
      "role": "user",
      "isActive": true
    }
  }
}
```

**Error Responses:**
- `400`: Validation failed / Current password incorrect / Email already in use
- `404`: User not found
- `500`: Server error

---

### 3. Upload Profile Photo
**POST** `/api/upload/profile-photo`

Upload a new profile photo. Automatically deletes the old photo if it exists.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
- Method: `multipart/form-data`
- Field name: `avatar`
- Accepted formats: JPEG, JPG, PNG, GIF, WebP
- Max file size: 2MB

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('avatar', file);

const response = await fetch('http://localhost:5004/api/upload/profile-photo', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "message": "Profile photo uploaded successfully",
  "data": {
    "filename": "profile-userid-1234567890-photo.jpg",
    "url": "/uploads/profiles/profile-userid-1234567890-photo.jpg",
    "size": 245678,
    "mimetype": "image/jpeg"
  }
}
```

**Error Responses:**
- `400`: No file uploaded / Invalid file type
- `413`: File too large (>2MB)
- `500`: Server error

**Notes:**
- Old profile photos are automatically deleted
- File is saved to `backend/uploads/profiles/`
- User's avatar field is automatically updated in database
- Filename format: `profile-{userId}-{timestamp}.{ext}`

---

### 4. Delete Profile Photo
**DELETE** `/api/upload/profile-photo`

Delete the user's current profile photo.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Profile photo deleted successfully"
}
```

**Error Responses:**
- `404`: No profile photo found
- `500`: Server error

**Notes:**
- Deletes the physical file from server
- Sets user's avatar field to `null`
- Safe to call even if photo file doesn't exist

---

### 5. Get User Hazards
**GET** `/api/users/my-hazards`

Get all hazards reported by the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (Pending, Verified, Resolved)
- `limit` (optional): Number of results per page (default: 20)
- `page` (optional): Page number (default: 1)

**Example:**
```
GET /api/users/my-hazards?status=Verified&limit=10&page=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hazards": [
      {
        "_id": "hazard_id",
        "hazardType": "Pothole",
        "description": "Large pothole on main road",
        "severity": "High",
        "status": "Verified",
        "location": {
          "address": "Galle Road, Colombo",
          "coordinates": [79.8612, 6.9271]
        },
        "photo": "/uploads/hazards/hazard-1234567890.jpg",
        "createdAt": "2024-01-01T10:00:00.000Z",
        "verifiedBy": {
          "fullName": "Admin User"
        }
      }
    ],
    "counts": {
      "pending": 5,
      "verified": 10,
      "resolved": 3,
      "total": 18
    },
    "pagination": {
      "total": 18,
      "page": 1,
      "pages": 2,
      "limit": 10
    }
  }
}
```

---

### 6. Update User Preferences
**PATCH** `/api/users/preferences`

Update user preferences for notifications and route settings.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "preferences": {
    "notifications": true,
    "defaultRouteType": "safest",
    "hazardAlertRadius": 5000
  }
}
```

**Options:**
- `notifications`: Boolean
- `defaultRouteType`: "fastest" | "shortest" | "safest"
- `hazardAlertRadius`: Number (in meters)

**Response:**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "preferences": {
      "notifications": true,
      "defaultRouteType": "safest",
      "hazardAlertRadius": 5000
    }
  }
}
```

---

### 7. Delete User Account
**DELETE** `/api/users/profile`

Soft delete (deactivate) the user's account.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

**Notes:**
- This is a soft delete (sets `isActive: false`)
- User's hazard reports are also deactivated
- User's routes are also deactivated
- Account can be reactivated by admin if needed

---

## File Upload Specifications

### Profile Photos
- **Location:** `backend/uploads/profiles/`
- **Naming Convention:** `profile-{userId}-{timestamp}.{ext}`
- **Allowed Formats:** JPEG, JPG, PNG, GIF, WebP
- **Max Size:** 2MB
- **Auto-delete:** Old photos deleted on new upload

### Hazard Photos
- **Location:** `backend/uploads/hazards/`
- **Naming Convention:** `hazard-{timestamp}-{randomid}-{originalname}.{ext}`
- **Allowed Formats:** JPEG, JPG, PNG, GIF, WebP
- **Max Size:** 5MB

---

## Authentication

All profile endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting a Token
Login via `/api/auth/login` to receive a token:

```javascript
const response = await fetch('http://localhost:5004/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();
localStorage.setItem('token', token);
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Array of validation errors"] // Optional
}
```

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `413`: Payload Too Large (file size exceeded)
- `500`: Internal Server Error

---

## Database Schema

### User Model
```javascript
{
  fullName: String,      // Required, 2-100 characters
  email: String,         // Required, unique, valid email
  password: String,      // Required, min 6 characters (hashed)
  role: String,          // 'user' | 'admin' | 'moderator'
  isActive: Boolean,     // Default: true
  avatar: String,        // URL to profile photo
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

## Frontend Integration Example

### Complete Profile Page Flow

```javascript
// 1. Fetch user profile on mount
useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5004/api/users/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.success) {
      setUser(data.data.user);
      setStats(data.data.stats);
    }
  };
  fetchProfile();
}, []);

// 2. Upload profile photo
const handlePhotoUpload = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5004/api/upload/profile-photo', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  const data = await response.json();
  if (data.success) {
    setUser({ ...user, avatar: data.data.url });
  }
};

// 3. Update profile
const handleUpdateProfile = async (formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5004/api/users/profile', {
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

// 4. Delete profile photo
const handleDeletePhoto = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5004/api/upload/profile-photo', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  if (data.success) {
    setUser({ ...user, avatar: null });
  }
};
```

---

## Testing with Postman/cURL

### Upload Profile Photo
```bash
curl -X POST http://localhost:5004/api/upload/profile-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@/path/to/photo.jpg"
```

### Update Profile
```bash
curl -X PUT http://localhost:5004/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe Updated",
    "email": "john.updated@example.com"
  }'
```

### Get My Hazards
```bash
curl -X GET "http://localhost:5004/api/users/my-hazards?status=Verified&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Security Considerations

1. **Authentication:** All endpoints require valid JWT token
2. **File Upload Security:**
   - Only image files allowed (JPEG, PNG, GIF, WebP)
   - File size limits enforced (2MB for profiles, 5MB for hazards)
   - Files stored outside web root
   - Unique filenames prevent collisions
3. **Password Security:**
   - Passwords hashed with bcrypt (salt rounds: 10)
   - Current password required for password changes
   - Minimum 6 characters enforced
4. **Data Validation:**
   - Email format validation
   - Name length constraints
   - SQL injection prevention via Mongoose
5. **Privacy:**
   - Passwords never returned in responses
   - User can only access their own profile data
   - Soft deletes preserve data integrity

---

## Notes

- The backend server runs on port **5004**
- Frontend should use `http://localhost:5004` for API calls
- All uploaded files served from `/uploads/` route
- Profile photos stored in `backend/uploads/profiles/`
- Hazard photos stored in `backend/uploads/hazards/`
- MongoDB connection required for all operations
- Token expires after 7 days (configurable in auth controller)
