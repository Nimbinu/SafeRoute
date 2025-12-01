import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map center when location changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

const LeafletMapView = ({ currentLocation, hazards, mapCenter, zoomLevel, onMapClick }) => {
  // Priority: mapCenter from search > currentLocation > default
  const center = mapCenter 
    ? [mapCenter.lat, mapCenter.lng]
    : currentLocation 
    ? [currentLocation.latitude, currentLocation.longitude]
    : [7.8731, 80.7718]; // Default to Sri Lanka

  // Use provided zoomLevel or default to 13
  const zoom = zoomLevel || 13;

  // Create custom icon for user location
  const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #2563eb;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      ">📍</div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  // Create custom icons for hazards based on severity
  const createHazardIcon = (hazard) => {
    const getColor = (severity) => {
      switch (severity) {
        case 'Critical': return '#dc2626';
        case 'High': return '#ea580c';
        case 'Medium': return '#f59e0b';
        case 'Low': return '#10b981';
        default: return '#6b7280';
      }
    };

    const getIcon = (type) => {
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

    return L.divIcon({
      className: 'custom-hazard-marker',
      html: `
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: ${getColor(hazard.severity)};
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          animation: pulse 2s infinite;
        ">${getIcon(hazard.hazardType)}</div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
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

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%', zIndex: 1 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <ChangeView center={center} zoom={zoom} />
      
      {/* Map click handler for saving locations */}
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

      {/* User's current location marker */}
      {currentLocation && (
        <Marker 
          position={[currentLocation.latitude, currentLocation.longitude]}
          icon={userIcon}
        >
          <Popup>
            <div style={{ padding: '5px' }}>
              <strong>📍 Your Location</strong>
              <br />
              <small>
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </small>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Hazard markers */}
      {hazards.map((hazard) => {
        const position = [
          hazard.location.coordinates[1],
          hazard.location.coordinates[0]
        ];

        return (
          <Marker
            key={hazard._id}
            position={position}
            icon={createHazardIcon(hazard)}
          >
            <Popup maxWidth={300}>
              <div style={{ padding: '10px', minWidth: '200px' }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {hazard.hazardType}
                </h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4b5563' }}>
                  {hazard.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  fontSize: '12px',
                  marginBottom: '8px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    backgroundColor: hazard.severity === 'Critical' ? '#dc2626' :
                                   hazard.severity === 'High' ? '#ea580c' :
                                   hazard.severity === 'Medium' ? '#f59e0b' : '#10b981',
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '11px'
                  }}>
                    {hazard.severity}
                  </span>
                  <span style={{
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontWeight: '500',
                    fontSize: '11px'
                  }}>
                    {hazard.status}
                  </span>
                </div>
                {hazard.photo && (
                  <img 
                    src={`http://localhost:5004${hazard.photo}`}
                    alt="Hazard"
                    style={{
                      width: '100%',
                      maxHeight: '150px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      marginBottom: '8px'
                    }}
                  />
                )}
                <p style={{ margin: '0', fontSize: '11px', color: '#9ca3af' }}>
                  📍 {hazard.location.address || 'Location not specified'}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>
                  🕒 Reported {timeAgo(hazard.createdAt)}
                </p>
                {hazard.reportedBy && (
                  <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>
                    👤 By: {hazard.reportedBy.fullName || 'Anonymous'}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LeafletMapView;
