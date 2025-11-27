# Photo Upload Guide for Report Hazard

## ✅ Backend is Already Set Up!

Your backend photo upload system is **already configured and ready to use**. Here's how it works:

---

## 📸 How Photo Upload Works

### **Backend Endpoints Available:**

1. **Upload Photo**
   - **URL:** `POST http://localhost:5004/api/upload/hazard-photo`
   - **Method:** POST
   - **Auth:** Required (Bearer token)
   - **Content-Type:** multipart/form-data
   - **Field name:** `photo`

2. **View Uploaded Photos**
   - **URL:** `GET http://localhost:5004/uploads/hazards/{filename}`
   - **Example:** `http://localhost:5004/uploads/hazards/hazard-1234567890-image.jpg`

---

## 🔧 Frontend Integration for ReportHazardModal

To enable photo uploads in your ReportHazardModal component, you need to:

### **Step 1: Update ReportHazardModal.jsx**

The modal needs to upload the photo first, then submit the hazard report with the photo URL.

Here's the flow:

```javascript
// 1. User selects a photo
const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  setSelectedPhoto(file);
};

// 2. Upload photo to backend
const uploadPhoto = async (photoFile) => {
  const formData = new FormData();
  formData.append('photo', photoFile);

  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5004/api/upload/hazard-photo', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData // Don't set Content-Type, browser will set it automatically
  });

  const data = await response.json();
  return data.data.url; // Returns: /uploads/hazards/hazard-123.jpg
};

// 3. Submit hazard report with photo URL
const handleSubmit = async (e) => {
  e.preventDefault();
  
  let photoUrl = null;
  
  // Upload photo first if selected
  if (selectedPhoto) {
    photoUrl = await uploadPhoto(selectedPhoto);
  }
  
  // Then create hazard report with photo URL
  const hazardData = {
    hazardType: formData.hazardType,
    description: formData.description,
    location: {
      coordinates: [longitude, latitude],
      address: formData.address
    },
    photo: photoUrl, // Include photo URL
    severity: formData.severity
  };
  
  // Submit to hazard API
  const response = await fetch('http://localhost:5004/api/hazards', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hazardData)
  });
  
  // Handle response...
};
```

---

## 🧪 Test Photo Upload (Manual Test)

You can test if photo upload is working using these steps:

### **Option 1: Using Browser Console**

1. Open http://localhost:3000
2. Login to get a token
3. Open browser DevTools (F12)
4. Go to Console tab
5. Paste this code:

```javascript
// Test photo upload
async function testPhotoUpload() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);
    
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5004/api/upload/hazard-photo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    console.log('Upload result:', data);
    
    if (data.success) {
      console.log('Photo uploaded to:', `http://localhost:5004${data.data.url}`);
      window.open(`http://localhost:5004${data.data.url}`, '_blank');
    }
  };
  
  input.click();
}

testPhotoUpload();
```

### **Option 2: Using Postman or Thunder Client**

1. **Method:** POST
2. **URL:** http://localhost:5004/api/upload/hazard-photo
3. **Headers:**
   - Authorization: Bearer {your_token}
4. **Body:** 
   - Type: form-data
   - Key: photo
   - Value: Select image file
5. Click Send

**Expected Response:**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "filename": "hazard-1730123456789-image.jpg",
    "url": "/uploads/hazards/hazard-1730123456789-image.jpg",
    "size": 153600,
    "mimetype": "image/jpeg"
  }
}
```

---

## 📁 Where Photos Are Stored

- **Location:** `backend/uploads/hazards/`
- **Filename format:** `hazard-{timestamp}-{random}-{originalname}.ext`
- **Access URL:** `http://localhost:5004/uploads/hazards/{filename}`

---

## 🔒 Security Features

✅ **Authentication required** - Only logged-in users can upload  
✅ **File type validation** - Only images allowed (jpg, png, gif, webp)  
✅ **File size limit** - 5MB maximum  
✅ **Unique filenames** - No file overwrites  

---

## 🚨 Important Notes

1. **Upload photo BEFORE creating hazard** - Get the photo URL first
2. **Store photo URL** in hazard document, not the file itself
3. **Token required** - User must be logged in
4. **Don't set Content-Type header** when uploading - Let browser set it automatically

---

## 💡 Ready to Use!

Your backend is **100% ready** for photo uploads. You just need to update your frontend ReportHazardModal component to use these endpoints.

The upload system is already:
- ✅ Configured in backend
- ✅ Routes registered
- ✅ Middleware set up
- ✅ Directory created
- ✅ Static file serving enabled

Would you like me to update the ReportHazardModal.jsx component to implement photo uploads?
