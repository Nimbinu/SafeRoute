# SafeRoute Backend API

## Installation

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/saferoute
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional: user, admin, moderator
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatar": null,
      "createdAt": "2025-10-22T...",
      "lastLogin": "2025-10-22T..."
    }
  }
}
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "SafeRoute API is running",
  "timestamp": "2025-10-22T..."
}
```

## Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── controllers/          # Request handlers
│   └── authController.js # Authentication logic
├── models/               # Database models
│   └── User.js          # User model
├── routes/               # API routes
│   └── auth.js          # Auth routes
└── middleware/           # Custom middleware
    └── auth.js          # JWT authentication middleware
```

## Database Schema

### User Model
```javascript
{
  fullName: String,      // Required, 2-100 characters
  email: String,         // Required, unique, valid email
  password: String,      // Required, min 6 characters (hashed)
  role: String,          // Enum: 'user', 'admin', 'moderator'
  isActive: Boolean,     // Default: true
  avatar: String,        // Optional
  createdAt: Date,       // Auto-generated
  lastLogin: Date,       // Updated on login
  updatedAt: Date        // Auto-generated
}
```

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Input validation with express-validator
- ✅ CORS enabled
- ✅ Password not returned in API responses
- ✅ Account activation status check
- ✅ Token expiration

## Error Handling

All errors return in this format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Next Steps

1. Install MongoDB locally or use MongoDB Atlas
2. Run `npm install` in backend folder
3. Start MongoDB service
4. Run `npm run dev` to start server
5. Test endpoints with Postman or similar tool
6. Connect frontend to backend API

## Testing with cURL

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get User (replace TOKEN):
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
