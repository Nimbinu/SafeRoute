# SafeRoute Frontend

Vue 3 + Vite frontend application for SafeRoute - A community-driven hazard reporting platform.

## 🚀 Features

- **Interactive Map Dashboard** - View real-time hazard reports on Google Maps
- **Report Hazards** - Submit reports with photos, location, and severity
- **Safe Route Planning** - Find optimal routes avoiding reported hazards
- **Real-time Updates** - Socket.IO integration for live report notifications
- **User Authentication** - Secure JWT-based login/register
- **Admin Dashboard** - Verify and manage hazard reports
- **User Profile** - View your submitted reports

## 📋 Prerequisites

- Node.js 16+ and npm
- Google Maps JavaScript API Key
- Backend server running on port 5000

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env.local` and update:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   VITE_SOCKET_URL=http://localhost:5000
   ```

   **Get Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project
   - Enable "Maps JavaScript API" and "Directions API"
   - Create credentials (API Key)
   - Restrict key to your domain in production

## 🚀 Running the App

1. **Start the backend server first** (from `backend/` folder):
   ```bash
   cd ../backend
   npm run dev
   ```

2. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable Vue components
│   │   ├── Header.vue
│   │   └── ReportModal.vue
│   ├── composables/     # Vue composables (hooks)
│   │   └── useAuth.js
│   ├── pages/           # Page components
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── MapDashboard.vue
│   │   ├── SafeRoute.vue
│   │   ├── Profile.vue
│   │   └── AdminDashboard.vue
│   ├── router/          # Vue Router configuration
│   │   └── index.js
│   ├── services/        # API and socket services
│   │   ├── api.js
│   │   └── socket.js
│   ├── App.vue          # Root component
│   ├── main.js          # App entry point
│   └── style.css        # Global styles
├── .env.local           # Environment variables (not in git)
├── .env.example         # Example environment config
├── vite.config.js       # Vite configuration
└── package.json
```

## 🔑 Key Technologies

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Vue Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.IO Client** - Real-time bidirectional communication
- **Google Maps JavaScript API** - Interactive maps
- **@googlemaps/js-api-loader** - Google Maps loader

## 🎯 Usage Flow

### 1. Authentication
- Register a new account or login
- JWT token stored in localStorage
- Auto-redirect based on auth state

### 2. View Hazard Map
- Map loads with your current location
- Nearby hazards displayed as markers
- Click markers to view details
- Real-time updates via Socket.IO

### 3. Report a Hazard
- Click "Report Hazard" button
- Fill in type, description, severity
- Upload photos (optional)
- Location auto-detected or manual
- Submit to backend

### 4. Plan Safe Route
- Navigate to "Plan Route" page
- Enter origin and destination
- Backend calculates route avoiding hazards
- View route and hazard warnings

### 5. Profile & Admin
- View your submitted reports
- Admin users can verify/delete reports

## 🔒 Authentication

The app uses JWT tokens stored in localStorage:
- Token key: `saferoute_token`
- User data key: `saferoute_user`

API requests automatically include the token in Authorization header.

## 🌍 API Endpoints Used

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user
- `GET /api/reports/nearby` - Get nearby reports
- `POST /api/reports` - Create report
- `GET /api/routes/safe` - Get safe route
- `GET /api/users/:id/reports` - Get user's reports
- `GET /api/admin/reports` - Admin: get all reports
- `PUT /api/admin/reports/:id/verify` - Admin: verify report
- `DELETE /api/admin/reports/:id` - Admin: delete report

## 🔌 Socket.IO Events

**Client → Server:**
- `join` - Join geolocation room
- `leave` - Leave current room

**Server → Client:**
- `new_report` - New hazard reported
- `report_update` - Hazard updated/verified
- `report_delete` - Hazard deleted

## 🎨 Customization

### Change Theme Colors
Edit gradient in components:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add New Hazard Types
Update `hazardConfig` in `MapDashboard.vue` and `ReportModal.vue`

## 📦 Building for Production

```bash
npm run build
```

Output in `dist/` folder. Deploy to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🐛 Troubleshooting

**Map not loading?**
- Check Google Maps API key in `.env.local`
- Ensure API key has Maps JavaScript API enabled
- Check browser console for errors

**Backend connection failed?**
- Ensure backend is running on port 5000
- Check `.env.local` has correct `VITE_API_URL`
- Check browser network tab for failed requests

**Socket.IO not connecting?**
- Verify backend Socket.IO server is running
- Check CORS settings in backend
- Check `VITE_SOCKET_URL` in `.env.local`

**Build errors?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📝 Development Tips

- Use Vue DevTools browser extension for debugging
- Check `vite.config.js` for proxy settings
- API calls use `/api` prefix (proxied to backend)
- Hot Module Replacement (HMR) enabled by default

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - see backend README for details

---

**Need help?** Check the backend README or open an issue on GitHub.
