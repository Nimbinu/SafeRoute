# SafeRoute Backend - Upload & Location Services

## Overview
Backend support for the ReportHazardModal component, including photo uploads and location services.

## Features Created

### 1. Photo Upload System
- **File Upload Middleware** (`middleware/upload.js`)
  - Uses Multer for handling multipart/form-data
  - Stores files in `uploads/hazards/` directory
  - File size limit: 5MB
  - Allowed formats: JPEG, JPG, PNG, GIF, WEBP
  - Auto-generates unique filenames

### 2. Location Services
- **Location Search** - Autocomplete for addresses
- **Reverse Geocoding** - Convert coordinates to addresses
- **Current Location** - Get user's approximate location

### 3. Upload Controller
- Photo upload and deletion
- Hazard report validation

---

## API Endpoints

### Upload Routes (Protected)

#### Upload Hazard Photo
```http
POST /api/upload/hazard-photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (form-data):
- photo: <file>

Response:
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "filename": "hazard-1234567890-image.jpg",
    "url": "/uploads/hazards/hazard-1234567890-image.jpg",
    "size": 153600,
    "mimetype": "image/jpeg"
  }
}
```

#### Delete Hazard Photo
```http
DELETE /api/upload/hazard-photo/:filename
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Photo deleted successfully"
}
```

#### Validate Hazard Report
```http
POST /api/upload/validate-hazard
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "hazardType": "Pothole",
  "description": "Large pothole on main road",
  "location": {
    "coordinates": [79.8612, 6.9271],
    "address": "Galle Road, Colombo"
  }
}

Response:
{
  "success": true,
  "message": "Validation passed"
}
```

### Location Routes (Public)

#### Search Location
```http
GET /api/location/search?query=Galle

Response:
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "1",
        "description": "Galle, Colombo, Sri Lanka",
        "placeId": "mock_place_1",
        "coordinates": [79.8612, 6.9271]
      }
    ]
  }
}
```

#### Reverse Geocode
```http
GET /api/location/reverse?latitude=6.9271&longitude=79.8612

Response:
{
  "success": true,
  "data": {
    "address": {
      "formattedAddress": "Galle Road, Colombo, Sri Lanka",
      "street": "Galle Road",
      "city": "Colombo",
      "state": "Western Province",
      "country": "Sri Lanka",
      "postalCode": "00300",
      "coordinates": [79.8612, 6.9271]
    }
  }
}
```

#### Get Current Location
```http
GET /api/location/current

Response:
{
  "success": true,
  "data": {
    "location": {
      "latitude": 6.9271,
      "longitude": 79.8612,
      "accuracy": 100,
      "city": "Colombo",
      "country": "Sri Lanka",
      "formattedAddress": "Colombo, Western Province, Sri Lanka"
    }
  }
}
```

---

## File Structure

```
backend/
├── middleware/
│   └── upload.js              # Multer configuration
├── controllers/
│   └── uploadController.js    # Upload & location logic
├── routes/
│   ├── upload.js              # Upload routes
│   └── location.js            # Location routes
└── uploads/
    └── hazards/               # Uploaded hazard photos
```

---

## Usage Examples

### Frontend Integration

#### Upload Photo
```javascript
const formData = new FormData();
formData.append('photo', photoFile);

const response = await fetch('http://localhost:5004/api/upload/hazard-photo', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log(data.data.url); // /uploads/hazards/hazard-123-image.jpg
```

#### Search Location
```javascript
const response = await fetch(`http://localhost:5004/api/location/search?query=${searchText}`);
const data = await response.json();
console.log(data.data.suggestions);
```

#### Create Hazard with Photo
```javascript
// 1. Upload photo first
const formData = new FormData();
formData.append('photo', photoFile);

const uploadResponse = await fetch('http://localhost:5004/api/upload/hazard-photo', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
const uploadData = await uploadResponse.json();

// 2. Create hazard with photo URL
const hazardResponse = await fetch('http://localhost:5004/api/hazards', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    hazardType: 'Pothole',
    description: 'Large pothole',
    location: {
      coordinates: [79.8612, 6.9271],
      address: 'Galle Road, Colombo'
    },
    photo: uploadData.data.url,
    severity: 'High'
  })
});
```

---

## Environment Variables

No additional environment variables required. The upload directory is created automatically.

---

## Integration with Google Maps (Future)

Currently, location services return mock data. To integrate with Google Maps:

1. Add Google Maps API key to `.env`:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

2. Install Google Maps package:
   ```bash
   npm install @googlemaps/google-maps-services-js
   ```

3. Update `uploadController.js` to use Google Maps Geocoding API

---

## Security Features

✅ File type validation (images only)
✅ File size limits (5MB max)
✅ Authentication required for uploads
✅ Unique filename generation
✅ Safe file storage outside public access (served through Express)

---

## Notes

- Uploaded files are stored in `backend/uploads/hazards/`
- Files are served statically at `/uploads/hazards/:filename`
- Old photos should be cleaned up periodically (implement cron job)
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)
