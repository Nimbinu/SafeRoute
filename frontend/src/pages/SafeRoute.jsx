import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SafeRoute.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjMTBiOTgxIiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguNyAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIxLjIgMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxN2MtMi41IDAtNC41LTItNC41LTQuNXMyLTQuNSA0LjUtNC41IDQuNSAyIDQuNSA0LjUtMiA0LjUtNC41IDQuNXoiLz48L3N2Zz4=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const endIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjZGMyNjI2IiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguNyAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIxLjIgMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxN2MtMi41IDAtNC41LTItNC41LTQuNXMyLTQuNSA0LjUtNC41IDQuNSAyIDQuNSA0LjUtMiA0LjUtNC41IDQuNXoiLz48L3N2Zz4=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const hazardIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZjU5ZTBiIiBkPSJNMSAyMWgyMkwxMiAyIDEgMjF6bTEyLTNoLTJ2LTJoMnYyem0wLTRoLTJ2LTRoMnY0eiIvPjwvc3ZnPg==',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Component to fit map bounds when routes change
function MapBounds({ fromCoords, toCoords }) {
  const map = useMap();
  
  useEffect(() => {
    if (fromCoords && toCoords) {
      const bounds = L.latLngBounds(
        [fromCoords.latitude, fromCoords.longitude],
        [toCoords.latitude, toCoords.longitude]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [fromCoords, toCoords, map]);
  
  return null;
}

export default function SafeRoute() {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [fromLocationName, setFromLocationName] = useState('');
  const [toLocationName, setToLocationName] = useState('');
  const [searchMode, setSearchMode] = useState(true); // true = search by name, false = enter coordinates

  // Popular Sri Lankan locations for suggestions
  const popularLocations = [
    { name: 'Colombo Fort Railway Station', coords: '6.9344, 79.8428', address: 'Fort Railway Station, Colombo 01' },
    { name: 'Galle Face Green, Colombo', coords: '6.9271, 79.8612', address: 'Galle Face, Colombo 03' },
    { name: 'Kandy City Center', coords: '7.2906, 80.6337', address: 'Kandy City Centre, Kandy' },
    { name: 'Temple of the Tooth, Kandy', coords: '7.2935, 80.6410', address: 'Sri Dalada Maligawa, Kandy' },
    { name: 'Galle Fort', coords: '6.0270, 80.2169', address: 'Galle Fort, Galle' },
    { name: 'Negombo Beach', coords: '7.2098, 79.8358', address: 'Negombo Beach, Negombo' },
    { name: 'Anuradhapura Ancient City', coords: '8.3114, 80.4037', address: 'Anuradhapura Sacred City' },
    { name: 'Nuwara Eliya Town', coords: '6.9497, 80.7891', address: 'Nuwara Eliya Town Centre' },
    { name: 'Ella Railway Station', coords: '6.8667, 81.0467', address: 'Ella Railway Station, Ella' },
    { name: 'Matara City', coords: '5.9549, 80.5550', address: 'Matara Town, Southern Province' },
    { name: 'Jaffna Fort', coords: '9.6615, 80.0077', address: 'Jaffna Fort, Jaffna' },
    { name: 'Bandaranaike Int. Airport', coords: '7.1808, 79.8841', address: 'Bandaranaike Airport, Katunayake' }
  ];

  // Get location name from coordinates using Nominatim (OpenStreetMap)
  const getLocationName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SafeRoute/1.0'
          }
        }
      );
      
      if (!response.ok) {
        return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (error) {
      console.error('Error getting location name:', error);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  // Search location by name using Nominatim
  const searchLocationByName = async (query) => {
    if (!query || query.trim() === '') {
      return [];
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Sri Lanka')}&limit=5`,
        {
          headers: {
            'User-Agent': 'SafeRoute/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error searching location:', error);
      return [];
    }
  };

  // Get user's current location for "From"
  useEffect(() => {
    if (useCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            setFromCoords(coords);
            
            // Get location name
            const locationName = await getLocationName(coords.latitude, coords.longitude);
            setFromLocationName(locationName);
            setFromLocation(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
          } catch (err) {
            console.error('Error processing location:', err);
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            setFromCoords(coords);
            setFromLocation(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
            setFromLocationName('Current Location');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enter manually.');
          setUseCurrentLocation(false);
        }
      );
    }
  }, [useCurrentLocation]);

  const handleFindRoute = async () => {
    // Check if user entered location data
    if (searchMode) {
      if (!fromLocationName || !toLocationName) {
        setError('Please enter both starting location and destination names');
        return;
      }
    } else {
      if (!fromLocation || !toLocation) {
        setError('Please enter both starting location and destination coordinates');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to calculate routes');
        setLoading(false);
        return;
      }

      let originCoords = fromCoords;
      let destCoords = toCoords;

      // If in search mode, convert place names to coordinates
      if (searchMode) {
        // Search for origin location
        if (!originCoords) {
          const fromResults = await searchLocationByName(fromLocationName);
          if (fromResults.length === 0) {
            setError(`Could not find location: "${fromLocationName}". Try using coordinates instead.`);
            setLoading(false);
            return;
          }
          const fromResult = fromResults[0];
          originCoords = {
            latitude: parseFloat(fromResult.lat),
            longitude: parseFloat(fromResult.lon)
          };
          setFromLocation(`${originCoords.latitude.toFixed(6)}, ${originCoords.longitude.toFixed(6)}`);
        }

        // Search for destination location
        const toResults = await searchLocationByName(toLocationName);
        if (toResults.length === 0) {
          setError(`Could not find location: "${toLocationName}". Try using coordinates instead.`);
          setLoading(false);
          return;
        }
        const toResult = toResults[0];
        destCoords = {
          latitude: parseFloat(toResult.lat),
          longitude: parseFloat(toResult.lon)
        };
        setToLocation(`${destCoords.latitude.toFixed(6)}, ${destCoords.longitude.toFixed(6)}`);
      } else {
        // Parse coordinates from input
        if (!originCoords) {
          const fromParts = fromLocation.split(',').map(s => s.trim());
          if (fromParts.length === 2 && !isNaN(fromParts[0]) && !isNaN(fromParts[1])) {
            originCoords = {
              latitude: parseFloat(fromParts[0]),
              longitude: parseFloat(fromParts[1])
            };
          } else {
            setError('Please enter coordinates in format: latitude, longitude (e.g., 7.8731, 80.7718)');
            setLoading(false);
            return;
          }
        }

        if (!destCoords) {
          const toParts = toLocation.split(',').map(s => s.trim());
          if (toParts.length === 2 && !isNaN(toParts[0]) && !isNaN(toParts[1])) {
            destCoords = {
              latitude: parseFloat(toParts[0]),
              longitude: parseFloat(toParts[1])
            };
          } else {
            setError('Please enter coordinates in format: latitude, longitude (e.g., 7.8731, 80.7718)');
            setLoading(false);
            return;
          }
        }
      }

      // Get location names if not already set
      if (!fromLocationName) {
        const name = await getLocationName(originCoords.latitude, originCoords.longitude);
        setFromLocationName(name);
      }
      if (!toLocationName) {
        const name = await getLocationName(destCoords.latitude, destCoords.longitude);
        setToLocationName(name);
      }

      // Call backend API to calculate route
      const response = await fetch('http://localhost:5004/api/routes/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          origin: {
            coordinates: [originCoords.longitude, originCoords.latitude],
            address: fromLocationName || fromLocation
          },
          destination: {
            coordinates: [destCoords.longitude, destCoords.latitude],
            address: toLocationName || toLocation
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to calculate route');
      }

      console.log('Route calculated:', data);
      
      // Transform the route data for display
      const transformedData = {
        routes: data.data.route.routes.map(route => ({
          type: route.routeType,
          distance: route.distance,
          duration: route.duration,
          safetyScore: route.safetyScore,
          hazardsCount: route.hazardCount,
          polyline: route.polyline
        })),
        hazardsOnRoute: data.data.nearbyHazards || []
      };
      
      setRouteData(transformedData);
      setFromCoords(originCoords);
      setToCoords(destCoords);
      setError(null);
    } catch (err) {
      console.error('Error calculating route:', err);
      setError(err.message || 'Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="safe-route-page">
      {/* Left Sidebar */}
      <aside className="route-sidebar">
        {/* Logo */}
        <div className="route-header">
          <div className="route-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <div className="route-logo-icon">🛡️</div>
            <span className="route-logo-text">SafeRoute</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="route-content">
          <h1 className="route-title">Find a Safe Route</h1>
          <p className="route-subtitle">
            Enter coordinates or use your current location to find the safest route in Sri Lanka.
          </p>

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Quick Location Selector */}
          <div style={{ 
            backgroundColor: '#f0f9ff', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #bfdbfe'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '10px' }}>
              🗺️ Quick Select Popular Sri Lankan Locations
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {popularLocations.slice(0, 6).map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!fromLocation || useCurrentLocation) {
                      setFromLocation(loc.coords);
                      setFromLocationName(loc.address);
                      setUseCurrentLocation(false);
                    } else if (!toLocation) {
                      setToLocation(loc.coords);
                      setToLocationName(loc.address);
                    } else {
                      setFromLocation(loc.coords);
                      setFromLocationName(loc.address);
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    backgroundColor: 'white',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.color = 'white';
                    e.target.style.borderColor = '#2563eb';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = 'black';
                    e.target.style.borderColor = '#cbd5e1';
                  }}
                >
                  {loc.name}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', marginBottom: 0 }}>
              💡 Click a location to auto-fill From or To field
            </p>
          </div>

          {/* Current Location Toggle */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={useCurrentLocation}
                onChange={(e) => setUseCurrentLocation(e.target.checked)}
              />
              <span style={{ fontSize: '14px' }}>Use my current location as starting point</span>
            </label>
          </div>

          {/* Search Mode Toggle */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '15px',
            backgroundColor: '#f3f4f6',
            padding: '4px',
            borderRadius: '8px'
          }}>
            <button
              onClick={() => setSearchMode(true)}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: searchMode ? '#2563eb' : 'transparent',
                color: searchMode ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📍 Search by Place Name
            </button>
            <button
              onClick={() => setSearchMode(false)}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: !searchMode ? '#2563eb' : 'transparent',
                color: !searchMode ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🗺️ Enter Coordinates
            </button>
          </div>

          {/* From Input */}
          <div className="input-group">
            <label htmlFor="from">
              {searchMode ? 'From (Place Name)' : 'From (Latitude, Longitude)'}
            </label>
            {searchMode ? (
              <>
                <input
                  type="text"
                  id="from"
                  value={fromLocationName}
                  onChange={(e) => setFromLocationName(e.target.value)}
                  placeholder="e.g., Colombo Fort, Galle Face, Kandy"
                  disabled={useCurrentLocation}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                {fromLocationName && !useCurrentLocation && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    backgroundColor: '#f0fdf4', 
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#15803d'
                  }}>
                    ✓ Location: {fromLocationName}
                    {fromLocation && <div style={{ color: '#6b7280', marginTop: '4px' }}>Coordinates: {fromLocation}</div>}
                  </div>
                )}
              </>
            ) : (
              <input
                type="text"
                id="from"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="e.g., 6.9344, 79.8428 (Colombo Fort)"
                disabled={useCurrentLocation}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            )}
            {!searchMode && (
              <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                💡 Try: Colombo (6.9271, 79.8612) | Kandy (7.2906, 80.6337) | Galle (6.0270, 80.2169)
              </small>
            )}
          </div>

          {/* To Input */}
          <div className="input-group">
            <label htmlFor="to">
              {searchMode ? 'To (Place Name)' : 'To (Latitude, Longitude)'}
            </label>
            {searchMode ? (
              <>
                <input
                  type="text"
                  id="to"
                  value={toLocationName}
                  onChange={(e) => setToLocationName(e.target.value)}
                  placeholder="e.g., Kandy City, Galle Fort, Ella Station"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                {toLocationName && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    backgroundColor: '#f0fdf4', 
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#15803d'
                  }}>
                    ✓ Location: {toLocationName}
                    {toLocation && <div style={{ color: '#6b7280', marginTop: '4px' }}>Coordinates: {toLocation}</div>}
                  </div>
                )}
              </>
            ) : (
              <input
                type="text"
                id="to"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="e.g., 7.2906, 80.6337 (Kandy)"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            )}
            {!searchMode && (
              <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                💡 Try: Negombo (7.2098, 79.8358) | Ella (6.8667, 81.0467) | Nuwara Eliya (6.9497, 80.7891)
              </small>
            )}
          </div>

          {/* Find Route Button */}
          <button 
            onClick={handleFindRoute} 
            className="btn-find-route"
            disabled={loading}
          >
            {loading ? 'Calculating Route...' : 'Find Safe Route'}
          </button>

          {/* Route Information */}
          {routeData && routeData.routes && routeData.routes.length > 0 && (
            <div className="route-info-section">
              {/* Summary Header */}
              <div style={{
                backgroundColor: '#f0f9ff',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #bfdbfe'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
                  ✅ Route Calculated Successfully
                </h2>
                <p style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '8px' }}>
                  From: <strong>{fromLocationName || fromLocation}</strong>
                </p>
                <p style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '0' }}>
                  To: <strong>{toLocationName || toLocation}</strong>
                </p>
              </div>

              <h2 className="info-title">Route Options</h2>

              {/* Display all three routes */}
              {routeData.routes.map((route, index) => {
                const routeTypeColors = {
                  'safest': '#10b981',
                  'fastest': '#3b82f6',
                  'shortest': '#f59e0b'
                };
                
                const routeTypeIcons = {
                  'safest': '🛡️',
                  'fastest': '⚡',
                  'shortest': '📏'
                };

                return (
                  <div 
                    key={index} 
                    className="route-card"
                    style={{
                      borderLeft: `4px solid ${routeTypeColors[route.type] || '#6b7280'}`
                    }}
                  >
                    <div className="route-card-header">
                      <h3 className="route-card-title">
                        {routeTypeIcons[route.type]} {route.type.charAt(0).toUpperCase() + route.type.slice(1)} Route
                      </h3>
                      {route.type === 'safest' && (
                        <span style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="route-details">
                      <div className="detail-item">
                        <span className="detail-label">Distance:</span>
                        <span className="detail-value">{(route.distance / 1000).toFixed(2)} km</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Est. Time:</span>
                        <span className="detail-value">{Math.round(route.duration / 60)} minutes</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Safety Score:</span>
                        <span className="detail-value" style={{
                          color: route.safetyScore >= 80 ? '#10b981' :
                                 route.safetyScore >= 60 ? '#f59e0b' : '#ef4444',
                          fontWeight: '600'
                        }}>
                          {route.safetyScore}/100
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Hazards:</span>
                        <span className="detail-value">{route.hazardsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Hazards along route */}
              {routeData.hazardsOnRoute && routeData.hazardsOnRoute.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#dc2626' }}>
                    ⚠️ Hazards Along Route ({routeData.hazardsOnRoute.length})
                  </h3>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {routeData.hazardsOnRoute.map((hazard, index) => (
                      <div key={index} style={{
                        backgroundColor: '#f3f4f6',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        fontSize: '13px'
                      }}>
                        <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                          {hazard.type || 'Unknown Hazard'}
                        </div>
                        <div style={{ color: '#6b7280', marginBottom: '4px' }}>
                          {hazard.description || 'No description available'}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                          <span style={{
                            backgroundColor: 
                              hazard.severity === 'Critical' ? '#dc2626' :
                              hazard.severity === 'High' ? '#ea580c' :
                              hazard.severity === 'Medium' ? '#f59e0b' : '#10b981',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '10px'
                          }}>
                            {hazard.severity || 'Unknown'}
                          </span>
                          <span style={{ color: '#6b7280' }}>
                            {hazard.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="legend-section">
            <h3 className="legend-title">Legend</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-line" style={{ backgroundColor: '#10b981', width: '30px', height: '3px' }}></div>
                <span className="legend-text">Safest Route</span>
              </div>
              <div className="legend-item">
                <div className="legend-line" style={{ backgroundColor: '#3b82f6', width: '30px', height: '3px' }}></div>
                <span className="legend-text">Fastest Route</span>
              </div>
              <div className="legend-item">
                <div className="legend-line" style={{ backgroundColor: '#f59e0b', width: '30px', height: '3px' }}></div>
                <span className="legend-text">Shortest Route</span>
              </div>
              <div className="legend-item">
                <div className="legend-marker hazard-marker"></div>
                <span className="legend-text">Hazard Zone</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Map Area */}
      <main className="route-map-area">
        {fromCoords && toCoords ? (
          <MapContainer
            center={[fromCoords.latitude, fromCoords.longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapBounds fromCoords={fromCoords} toCoords={toCoords} />
            
            {/* Start Marker */}
            <Marker position={[fromCoords.latitude, fromCoords.longitude]} icon={startIcon}>
              <Popup>
                <strong>Start Location</strong><br />
                {fromLocationName || fromLocation}
              </Popup>
            </Marker>
            
            {/* End Marker */}
            <Marker position={[toCoords.latitude, toCoords.longitude]} icon={endIcon}>
              <Popup>
                <strong>Destination</strong><br />
                {toLocationName || toLocation}
              </Popup>
            </Marker>
            
            {/* Route Lines */}
            {routeData && routeData.routes && routeData.routes.map((route, idx) => {
              const colors = { safest: '#10b981', fastest: '#3b82f6', shortest: '#f59e0b' };
              const positions = [
                [fromCoords.latitude, fromCoords.longitude],
                [toCoords.latitude, toCoords.longitude]
              ];
              
              return (
                <Polyline
                  key={idx}
                  positions={positions}
                  color={colors[route.type]}
                  weight={route.type === 'safest' ? 5 : 3}
                  opacity={route.type === 'safest' ? 0.8 : 0.5}
                >
                  <Popup>
                    <strong>{route.type.charAt(0).toUpperCase() + route.type.slice(1)} Route</strong><br />
                    Distance: {(route.distance / 1000).toFixed(2)} km<br />
                    Time: {Math.round(route.duration / 60)} min<br />
                    Safety: {route.safetyScore}/100
                  </Popup>
                </Polyline>
              );
            })}
            
            {/* Hazard Markers */}
            {routeData && routeData.hazardsOnRoute && routeData.hazardsOnRoute.map((hazard, idx) => {
              if (hazard.location && hazard.location.coordinates) {
                const [lon, lat] = hazard.location.coordinates;
                return (
                  <Marker key={idx} position={[lat, lon]} icon={hazardIcon}>
                    <Popup>
                      <strong style={{ color: '#dc2626' }}>⚠️ {hazard.type || 'Hazard'}</strong><br />
                      <span style={{ fontSize: '12px' }}>{hazard.description || 'No description'}</span><br />
                      <span style={{
                        display: 'inline-block',
                        marginTop: '4px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        backgroundColor: hazard.severity === 'Critical' ? '#dc2626' :
                                       hazard.severity === 'High' ? '#ea580c' :
                                       hazard.severity === 'Medium' ? '#f59e0b' : '#10b981',
                        color: 'white'
                      }}>
                        {hazard.severity}
                      </span>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        ) : (
          <div className="map-placeholder">
            <div className="map-overlay">
            {loading ? (
              <>
                <p className="map-message">🔄 Calculating routes...</p>
                <p className="map-submessage">Analyzing safety along the route</p>
              </>
            ) : routeData ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p className="map-message">✅ Routes Calculated</p>
                <p className="map-submessage" style={{ marginBottom: '20px' }}>
                  Found {routeData.routes.length} route options
                </p>
                
                {/* Route Summary Cards */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '15px',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>
                  {routeData.routes.map((route, idx) => {
                    const icons = { safest: '🛡️', fastest: '⚡', shortest: '📏' };
                    const colors = { safest: '#10b981', fastest: '#3b82f6', shortest: '#f59e0b' };
                    
                    return (
                      <div key={idx} style={{
                        backgroundColor: 'white',
                        padding: '15px',
                        borderRadius: '12px',
                        border: `2px solid ${colors[route.type]}`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                          {icons[route.type]}
                        </div>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '14px', 
                          color: '#1f2937',
                          marginBottom: '8px',
                          textTransform: 'capitalize'
                        }}>
                          {route.type}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                          {(route.distance / 1000).toFixed(1)} km
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                          {Math.round(route.duration / 60)} min
                        </div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: route.safetyScore >= 80 ? '#10b981' : 
                                 route.safetyScore >= 60 ? '#f59e0b' : '#ef4444',
                          marginTop: '8px'
                        }}>
                          Safety: {route.safetyScore}/100
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hazards Info */}
                {routeData.hazardsOnRoute && routeData.hazardsOnRoute.length > 0 && (
                  <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    backgroundColor: '#fee',
                    borderRadius: '8px',
                    border: '1px solid #fecaca'
                  }}>
                    <p style={{ 
                      color: '#dc2626', 
                      fontSize: '14px', 
                      fontWeight: '600',
                      margin: 0
                    }}>
                      ⚠️ {routeData.hazardsOnRoute.length} hazard{routeData.hazardsOnRoute.length !== 1 ? 's' : ''} detected near routes
                    </p>
                  </div>
                )}
                
                {/* Recommendation */}
                {routeData.routes.length > 0 && (
                  <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #86efac'
                  }}>
                    <p style={{ 
                      color: '#15803d', 
                      fontSize: '14px', 
                      fontWeight: '600',
                      margin: 0
                    }}>
                      💡 Recommended: {routeData.routes.find(r => r.type === 'safest') ? 'Safest Route' : routeData.routes[0].type.charAt(0).toUpperCase() + routeData.routes[0].type.slice(1) + ' Route'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <p className="map-message">🗺️ Route Map</p>
                <p className="map-submessage">Enter locations and click "Find Safe Route"</p>
              </>
            )}
          </div>
          </div>
        )}
      </main>
    </div>
  );
}
