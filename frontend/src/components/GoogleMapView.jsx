import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';

const GoogleMapView = ({ currentLocation, hazards, onMarkerClick }) => {
  const [selectedHazard, setSelectedHazard] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const defaultCenter = currentLocation 
    ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
    : { lat: 7.8731, lng: 80.7718 }; // Default to Sri Lanka

  // Get marker color based on severity
  const getMarkerColor = (severity) => {
    switch (severity) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get hazard icon emoji
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

  if (!apiKey || apiKey === 'your_google_maps_api_key') {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        flexDirection: 'column',
        gap: '20px',
        padding: '40px'
      }}>
        <div style={{ fontSize: '60px' }}>🗺️</div>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#1f2937' }}>
            Google Maps API Key Required
          </h3>
          <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#6b7280' }}>
            To display the real Google Maps, you need to add your API key.
          </p>
          <div style={{
            backgroundColor: '#dbeafe',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#1e40af',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>How to get an API key:</p>
            <ol style={{ margin: '0', paddingLeft: '20px' }}>
              <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Google Cloud Console</a></li>
              <li>Create a project or select existing one</li>
              <li>Enable "Maps JavaScript API"</li>
              <li>Create credentials → API key</li>
              <li>Add the key to <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px' }}>frontend/.env</code></li>
            </ol>
          </div>
          <p style={{ margin: '15px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
            Or using the mock map view for now...
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={defaultCenter}
        defaultZoom={13}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
        mapId="saferoute-map"
      >
        {/* User's current location marker */}
        {currentLocation && (
          <AdvancedMarker
            position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
            title="Your Location"
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              cursor: 'pointer'
            }}>
              📍
            </div>
          </AdvancedMarker>
        )}

        {/* Hazard markers */}
        {hazards.map((hazard) => {
          const position = {
            lat: hazard.location.coordinates[1],
            lng: hazard.location.coordinates[0]
          };

          return (
            <AdvancedMarker
              key={hazard._id}
              position={position}
              title={hazard.hazardType}
              onClick={() => setSelectedHazard(hazard)}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: getMarkerColor(hazard.severity),
                border: '3px solid white',
                boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {getHazardIcon(hazard.hazardType)}
              </div>
            </AdvancedMarker>
          );
        })}

        {/* Info window for selected hazard */}
        {selectedHazard && (
          <InfoWindow
            position={{
              lat: selectedHazard.location.coordinates[1],
              lng: selectedHazard.location.coordinates[0]
            }}
            onCloseClick={() => setSelectedHazard(null)}
          >
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
                {getHazardIcon(selectedHazard.hazardType)} {selectedHazard.hazardType}
              </h3>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4b5563' }}>
                {selectedHazard.description}
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                <span style={{
                  backgroundColor: getMarkerColor(selectedHazard.severity),
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}>
                  {selectedHazard.severity}
                </span>
                <span>
                  {selectedHazard.status}
                </span>
              </div>
              {selectedHazard.photo && (
                <img 
                  src={`http://localhost:5004${selectedHazard.photo}`}
                  alt="Hazard"
                  style={{
                    width: '100%',
                    maxHeight: '150px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    marginTop: '8px'
                  }}
                />
              )}
              <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>
                📍 {selectedHazard.location.address || 'Location not specified'}
              </p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export default GoogleMapView;
