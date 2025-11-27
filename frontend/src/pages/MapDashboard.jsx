import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MapDashboard.css';
import ReportHazardModal from '../components/ReportHazardModal';
import LeafletMapView from '../components/LeafletMapView';

export default function MapDashboard() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState(''); // Add location name state
  const [hazards, setHazards] = useState([]);
  const [nearbyHazards, setNearbyHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 }); // Default to Sri Lanka
  const [showWelcome, setShowWelcome] = useState(true);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapScale, setMapScale] = useState(1);
  const [activeView, setActiveView] = useState('all-alerts'); // 'all-alerts', 'my-routes', 'saved-locations'

  // Function to get location name from coordinates
  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        // Build a readable location name
        const parts = [];
        if (data.address.road) parts.push(data.address.road);
        if (data.address.suburb || data.address.neighbourhood) {
          parts.push(data.address.suburb || data.address.neighbourhood);
        }
        if (data.address.city || data.address.town || data.address.village) {
          parts.push(data.address.city || data.address.town || data.address.village);
        }
        
        const locationString = parts.length > 0 
          ? parts.join(', ') 
          : data.display_name.split(',').slice(0, 3).join(',');
        
        setLocationName(locationString);
      }
    } catch (error) {
      console.error('Error getting location name:', error);
      setLocationName(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }
  };

  const filters = [
    { id: 'all', label: 'All', icon: '📍' },
    { id: 'Pothole', label: 'Pothole', icon: '⚠️' },
    { id: 'Accident', label: 'Accident', icon: '🚗' },
    { id: 'Flooding', label: 'Flood', icon: '💧' },
    { id: 'Construction', label: 'Construction', icon: '🚧' },
    { id: 'Road Closure', label: 'Road Closure', icon: '🚫' },
  ];

  // Get user's current location
  useEffect(() => {
    // Check if user has seen welcome before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }

    if (navigator.geolocation) {
      setLocationPermissionAsked(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setCurrentLocation(location);
          setMapCenter({ lat: location.latitude, lng: location.longitude });
          setLocationError(null);
          
          // Get location name from coordinates
          getLocationName(location.latitude, location.longitude);
          
          // Fetch nearby hazards
          fetchNearbyHazards(location.longitude, location.latitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          if (error.code === 1) {
            setLocationError('📍 Location access denied. To see hazards near you, please enable location in your browser settings.');
          } else if (error.code === 2) {
            setLocationError('📡 Location service is currently unavailable. Showing all hazards instead.');
          } else {
            setLocationError('⚠️ Unable to get your location. Showing all hazards instead.');
          }
          // Still fetch all hazards even without location
          fetchAllHazards();
        }
      );
    } else {
      setLocationError('🚫 Your browser doesn\'t support location services. Showing all hazards instead.');
      fetchAllHazards();
    }
  }, []);

  // Fetch all hazards
  const fetchAllHazards = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5004/api/hazards');
      const data = await response.json();
      
      if (data.success) {
        setHazards(data.data.hazards || []);
        setNearbyHazards(data.data.hazards || []);
      }
    } catch (error) {
      console.error('Error fetching hazards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby hazards based on location
  const fetchNearbyHazards = async (longitude, latitude, radius = 5000) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5004/api/hazards/nearby?longitude=${longitude}&latitude=${latitude}&radius=${radius}`
      );
      const data = await response.json();
      
      if (data.success) {
        setNearbyHazards(data.data.hazards || []);
        setHazards(data.data.hazards || []);
      }
    } catch (error) {
      console.error('Error fetching nearby hazards:', error);
      // Fallback to all hazards
      fetchAllHazards();
    } finally {
      setLoading(false);
    }
  };

  // Filter hazards by type
  const filteredHazards = selectedFilter === 'all' 
    ? nearbyHazards 
    : nearbyHazards.filter(h => h.hazardType === selectedFilter);

  // Get hazard icon based on type
  const getHazardIcon = (type) => {
    const icons = {
      'Pothole': '⚠️',
      'Debris': '🪨',
      'Broken Traffic Light': '🚦',
      'Flooding': '💧',
      'Ice': '❄️',
      'Accident': '🚗',
      'Road Closure': '🚫',
      'Construction': '🚧',
      'Other': '📍'
    };
    return icons[type] || '📍';
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const recentReports = filteredHazards.slice(0, 5).map(hazard => ({
    id: hazard._id,
    type: hazard.hazardType.toLowerCase().replace(' ', '-'),
    title: `${hazard.hazardType} on ${hazard.location.address || 'Unknown location'}`,
    time: timeAgo(hazard.createdAt),
    icon: getHazardIcon(hazard.hazardType)
  }));

  // Map control functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
    setMapScale(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
    setMapScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRecenter = () => {
    if (currentLocation) {
      setMapScale(1);
      setZoomLevel(1);
      alert(`📍 Map centered on your location:\nLat: ${currentLocation.latitude.toFixed(6)}\nLng: ${currentLocation.longitude.toFixed(6)}`);
    } else {
      alert('⚠️ Location not available. Please allow location access first.');
    }
  };

  return (
    <div className="map-dashboard">
      {/* Welcome Tutorial Overlay */}
      {showWelcome && (
        <div className="welcome-overlay" style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '60px', marginBottom: '15px' }}>🛡️</div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 10px 0' }}>
                Welcome to SafeRoute!
              </h2>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>
                Your real-time road hazard reporting system
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '15px', marginBottom: '20px' }}>
                <div style={{ fontSize: '30px', flexShrink: 0 }}>📍</div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    Allow Location Access
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    Click "Allow" when your browser asks for location permission. This helps us show hazards near you.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'start', gap: '15px', marginBottom: '20px' }}>
                <div style={{ fontSize: '30px', flexShrink: 0 }}>🗺️</div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    View Nearby Hazards
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    The map shows hazards within 5km of your location with colorful markers and icons.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'start', gap: '15px', marginBottom: '20px' }}>
                <div style={{ fontSize: '30px', flexShrink: 0 }}>📸</div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    Report Hazards
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    Click "Report Hazard" button to report potholes, accidents, flooding, and more. You can add photos too!
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'start', gap: '15px' }}>
                <div style={{ fontSize: '30px', flexShrink: 0 }}>🔍</div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    Filter & Map Controls
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    Use filter buttons to show specific hazard types. Map controls on the right: + (zoom in), − (zoom out), 📍 (re-center on you)
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowWelcome(false);
                localStorage.setItem('hasSeenWelcome', 'true');
              }}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Got it! Let's Start 🚀
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo/Header */}
        <div className="sidebar-header">
          <div className="logo-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">🛡️</div>
            <div className="logo-content">
              <h1 className="logo-title">SafeRoute</h1>
              <p className="logo-subtitle">Real-time hazard reporting</p>
            </div>
          </div>
        </div>

        {/* Live Alerts Section */}
        <div className="sidebar-section">
          <div className="section-header">
            <h2 className="section-title">LIVE ALERTS</h2>
          </div>

          <button 
            className={`alert-item ${activeView === 'all-alerts' ? 'active' : ''}`}
            onClick={() => setActiveView('all-alerts')}
          >
            <span className="alert-icon">🔔</span>
            <span className="alert-text">All Alerts</span>
            <span className="alert-count">{nearbyHazards.length}</span>
          </button>

          <button 
            className={`alert-item ${activeView === 'my-routes' ? 'active' : ''}`}
            onClick={() => setActiveView('my-routes')}
          >
            <span className="alert-icon">🚗</span>
            <span className="alert-text">My Routes</span>
          </button>

          <button 
            className={`alert-item ${activeView === 'saved-locations' ? 'active' : ''}`}
            onClick={() => setActiveView('saved-locations')}
          >
            <span className="alert-icon">📌</span>
            <span className="alert-text">Saved Locations</span>
          </button>
        </div>

        {/* Recent Reports Section */}
        <div className="sidebar-section">
          <div className="section-header">
            <h2 className="section-title">
              {activeView === 'all-alerts' && 'RECENT REPORTS'}
              {activeView === 'my-routes' && 'MY SAVED ROUTES'}
              {activeView === 'saved-locations' && 'SAVED LOCATIONS'}
            </h2>
          </div>

          <div className="reports-list">
            {activeView === 'all-alerts' && (
              <>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    Loading hazards...
                  </div>
                ) : recentReports.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No recent reports
                  </div>
                ) : (
                  recentReports.map((report) => (
                    <div key={report.id} className="report-item">
                      <div className={`report-icon ${report.type}`}>
                        {report.icon}
                      </div>
                      <div className="report-content">
                        <p className="report-title">{report.title}</p>
                        <p className="report-time">{report.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeView === 'my-routes' && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🗺️</div>
                <h3 style={{ fontSize: '16px', color: '#1f2937', marginBottom: '8px' }}>
                  No saved routes yet
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                  Create and save your frequently used routes for quick access
                </p>
                <button 
                  onClick={() => navigate('/safe-route')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Create Route
                </button>
              </div>
            )}

            {activeView === 'saved-locations' && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📍</div>
                <h3 style={{ fontSize: '16px', color: '#1f2937', marginBottom: '8px' }}>
                  No saved locations
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                  Save your favorite places like home, work, or frequent destinations
                </p>
                <p style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>
                  💡 Tip: Click on any location on the map to save it
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Report Hazard Button */}
        <button className="btn-report-hazard" onClick={() => setIsModalOpen(true)}>
          <span className="report-icon">📍</span>
          Report Hazard
        </button>
      </aside>

      {/* Report Hazard Modal */}
      <ReportHazardModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          // Refresh hazards when modal closes
          if (currentLocation) {
            fetchNearbyHazards(currentLocation.longitude, currentLocation.latitude);
          } else {
            fetchAllHazards();
          }
        }} 
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          {/* Search Bar */}
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for a location or route"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Right Actions */}
          <div className="top-actions">
            <button className="btn-safe-route" onClick={() => navigate('/safe-route')}>
              <span className="route-icon">🗺️</span>
              Safe Route
            </button>
            <button className="btn-settings">⚙️</button>
            <button className="btn-profile" onClick={() => navigate('/profile')}>👤</button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="filter-bar">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-pill ${selectedFilter === filter.id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              <span className="filter-icon">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Map Container */}
        <div className="map-container">
          {/* Leaflet Map Background - No API Key Required! */}
          <LeafletMapView 
            currentLocation={currentLocation}
            hazards={filteredHazards}
          />

          {/* Location Status Overlay */}
          {locationError && (
            <div className="location-error" style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '15px 25px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              maxWidth: '600px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {locationError}
            </div>
          )}
          
          {!currentLocation && !locationError && locationPermissionAsked && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '15px 25px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              maxWidth: '600px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              📍 Waiting for location permission... Please click "Allow" in your browser
            </div>
          )}

          {/* Hazard Count Info Card */}
          {currentLocation && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'white',
              padding: '15px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              zIndex: 1000,
              maxWidth: '300px'
            }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                📍 Your Location
              </p>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>
                {locationName || 'Loading location...'}
              </p>
              <p style={{ 
                margin: '0', 
                fontSize: '13px', 
                fontWeight: '600',
                color: filteredHazards.length > 0 ? '#dc2626' : '#10b981'
              }}>
                {filteredHazards.length > 0 
                  ? `⚠️ ${filteredHazards.length} hazard${filteredHazards.length !== 1 ? 's' : ''} nearby`
                  : '✅ All clear!'
                }
              </p>
            </div>
          )}

          <div className="map-placeholder" style={{ display: 'none' }}>
            {locationError && (
              <div className="location-error" style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: '15px 20px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 10,
                maxWidth: '500px',
                textAlign: 'center'
              }}>
                📍 {locationError}
              </div>
            )}
            
            <div className="map-overlay">
              {currentLocation ? (
                <>
                  <p className="map-message">📍 Your Location</p>
                  <p className="map-submessage">
                    {locationName || 'Loading location...'}
                  </p>
                  <p className="map-submessage" style={{ marginTop: '10px' }}>
                    Showing {filteredHazards.length} nearby hazard{filteredHazards.length !== 1 ? 's' : ''}
                  </p>
                  
                  {/* Hazard Markers */}
                  <div className="hazard-markers" style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: `${30 * mapScale}px`,
                    flexWrap: 'wrap',
                    padding: '100px 50px',
                    transform: `scale(${mapScale})`,
                    transition: 'transform 0.3s ease-out'
                  }}>
                    {/* Center marker for user location */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#4285f4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      boxShadow: '0 4px 12px rgba(66, 133, 244, 0.4)',
                      border: '4px solid white',
                      position: 'relative'
                    }}>
                      📍
                      <div style={{
                        position: 'absolute',
                        bottom: '-25px',
                        fontSize: '12px',
                        color: '#333',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}>
                        You are here
                      </div>
                    </div>
                    
                    {/* Hazard markers */}
                    {filteredHazards.slice(0, 8).map((hazard, index) => (
                      <div key={hazard._id} style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: 
                          hazard.severity === 'Critical' ? '#dc3545' :
                          hazard.severity === 'High' ? '#fd7e14' :
                          hazard.severity === 'Medium' ? '#ffc107' : '#28a745',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                        border: '3px solid white',
                        cursor: 'pointer',
                        position: 'relative',
                        animation: `pulse 2s infinite ${index * 0.2}s`
                      }}
                      title={`${hazard.hazardType} - ${hazard.description}`}
                      >
                        {getHazardIcon(hazard.hazardType)}
                        <div style={{
                          position: 'absolute',
                          bottom: '-20px',
                          fontSize: '10px',
                          color: '#666',
                          whiteSpace: 'nowrap'
                        }}>
                          {hazard.hazardType}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="map-message">🗺️ Getting your location...</p>
                  <p className="map-submessage">Please allow location access when prompted</p>
                </>
              )}
            </div>
          </div>

          {/* Map Controls */}
          <div className="map-controls">
            <button 
              className="map-control-btn" 
              onClick={handleZoomIn}
              title="Zoom In"
              style={{
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              +
            </button>
            <button 
              className="map-control-btn" 
              onClick={handleZoomOut}
              title="Zoom Out"
              style={{
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              −
            </button>
            <button 
              className="map-control-btn" 
              onClick={handleRecenter}
              title="Re-center on my location"
              style={{
                fontSize: '20px'
              }}
            >
              📍
            </button>
          </div>

          {/* Zoom Level Indicator */}
          {currentLocation && (
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              left: '2rem',
              backgroundColor: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              fontSize: '13px',
              fontWeight: '600',
              color: '#6b7280',
              zIndex: 10
            }}>
              🔍 Zoom: {Math.round(zoomLevel * 100)}%
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
