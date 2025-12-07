import React, { useState, useEffect } from 'react';
import './ReportHazardModal.css';

const ReportHazardModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    hazardType: '',
    description: '',
    photo: null,
    location: ''
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [manualLocation, setManualLocation] = useState({ lat: '', lng: '' });
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [searchingLocation, setSearchingLocation] = useState(false);

  const hazardTypes = [
    'Pothole',
    'Debris',
    'Broken Traffic Light',
    'Flooding',
    'Ice',
    'Accident',
    'Road Closure',
    'Construction',
    'Other'
  ];

  // Get user's current location when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset error when modal opens
      setError(null);
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setError('⚠️ You must be logged in to report a hazard. Please login first.');
        return;
      }
      
      // Get location if not already set
      if (!currentLocation) {
        getCurrentLocation();
      }
    }
  }, [isOpen]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setCurrentLocation(location);
          setFormData(prev => ({ 
            ...prev, 
            location: `${location.latitude}, ${location.longitude}` 
          }));
          setError(null); // Clear any previous errors
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Unable to get your location. ';
          if (error.code === 1) {
            errorMessage += 'You can enter location manually below.';
          } else if (error.code === 2) {
            errorMessage += 'You can enter location manually below.';
          } else {
            errorMessage += 'You can enter location manually below.';
          }
          setError(errorMessage);
          setUseManualLocation(true); // Show manual location input
        }
      );
    } else {
      setError('Geolocation is not supported. You can enter location manually below.');
      setUseManualLocation(true);
    }
  };

  // Search for location by name
  const handleLocationSearch = async (e) => {
    if (e.key === 'Enter' && locationSearch.trim()) {
      e.preventDefault();
      setSearchingLocation(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          const result = data[0];
          const location = {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon)
          };
          setCurrentLocation(location);
          setManualLocation({ lat: result.lat, lng: result.lon });
          setFormData(prev => ({ 
            ...prev, 
            location: result.display_name 
          }));
          setUseManualLocation(false);
        } else {
          setError('Location not found. Try a different search term or enter coordinates.');
        }
      } catch (error) {
        console.error('Error searching location:', error);
        setError('Error searching for location. Please try again.');
      } finally {
        setSearchingLocation(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('=== SUBMIT CLICKED ===');
    console.log('Form data:', formData);
    console.log('Current location:', currentLocation);
    console.log('Uploaded photo URL:', uploadedPhotoUrl);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Found ✓' : 'Not found ✗');
      
      if (!token) {
        throw new Error('⚠️ Please login to report a hazard');
      }

      // Get location from manual input or GPS
      let locationToUse = currentLocation;
      if (useManualLocation && manualLocation.lat && manualLocation.lng) {
        locationToUse = {
          latitude: parseFloat(manualLocation.lat),
          longitude: parseFloat(manualLocation.lng)
        };
      }

      if (!locationToUse) {
        throw new Error('⚠️ Please provide a location (allow GPS or enter manually).');
      }

      // Get readable address from coordinates if not provided
      let readableAddress = formData.location;
      if (!readableAddress || readableAddress.trim() === '') {
        try {
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationToUse.latitude}&lon=${locationToUse.longitude}&zoom=18&addressdetails=1`
          );
          const geoData = await response.json();
          
          if (geoData && geoData.address) {
            // Build a readable address from components
            const addr = geoData.address;
            const parts = [];
            
            if (addr.road) parts.push(addr.road);
            if (addr.suburb) parts.push(addr.suburb);
            else if (addr.neighbourhood) parts.push(addr.neighbourhood);
            if (addr.city) parts.push(addr.city);
            else if (addr.town) parts.push(addr.town);
            
            readableAddress = parts.length > 0 ? parts.join(', ') : geoData.display_name;
          } else {
            readableAddress = 'Unknown location';
          }
        } catch (geoError) {
          console.warn('Reverse geocoding failed:', geoError);
          readableAddress = 'Unknown location';
        }
      }

      // Prepare hazard data
      const hazardData = {
        hazardType: formData.hazardType,
        description: formData.description,
        location: {
          type: 'Point',
          coordinates: [locationToUse.longitude, locationToUse.latitude],
          address: readableAddress
        },
        severity: 'Medium' // You can add a severity selector if needed
      };

      // Add photo URL if uploaded
      if (uploadedPhotoUrl) {
        hazardData.photo = uploadedPhotoUrl;
      }

      console.log('Submitting hazard data:', JSON.stringify(hazardData, null, 2));
      console.log('API URL: http://localhost:5004/api/hazards');

      // Submit hazard report
      const response = await fetch('http://localhost:5004/api/hazards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(hazardData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit report');
      }

      console.log('✅ Report submitted successfully!');
      alert('✅ Hazard reported successfully!');
      
      // Reset form
      setFormData({
        hazardType: '',
        description: '',
        photo: null,
        location: ''
      });
      setUploadedPhotoUrl(null);
      setCurrentLocation(null);
      
      onClose();
    } catch (err) {
      console.error('❌ Submit error:', err);
      console.error('Error message:', err.message);
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
      console.log('=== SUBMIT COMPLETE ===');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    setFormData({ ...formData, photo: file });
    setError(null);

    // Upload photo immediately
    await uploadPhoto(file);
  };

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      setFormData({ ...formData, photo: file });
      setError(null);

      // Upload photo immediately
      await uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to upload photos');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('photo', file);

      const response = await fetch('http://localhost:5004/api/upload/hazard-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload photo');
      }

      setUploadedPhotoUrl(data.data.photoUrl);
      console.log('Photo uploaded successfully:', data.data.photoUrl);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err.message || 'Failed to upload photo. Please try again.');
      setFormData({ ...formData, photo: null });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-title">Report a Hazard</h2>
        <p className="modal-subtitle">Help other drivers by reporting road hazards.</p>

        {error && (
          <div className="error-message" style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="hazard-form">
          {/* Hazard Type */}
          <div className="form-group">
            <label className="form-label">Hazard Type</label>
            <select
              className="form-select"
              value={formData.hazardType}
              onChange={(e) => setFormData({ ...formData, hazardType: e.target.value })}
              required
              disabled={loading}
            >
              <option value="">Select hazard type</option>
              {hazardTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Provide a brief description of the hazard..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              required
              disabled={loading}
            />
          </div>

          {/* Photo Upload */}
          <div className="form-group">
            <div 
              className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px dashed #4CAF50' : '2px dashed #ddd',
                backgroundColor: isDragging ? '#f0f8ff' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <span className="file-icon">�</span>
              <div className="file-text">
                <span className="file-title">Upload a photo (optional)</span>
                <span className="file-hint">Drag and drop or click to browse</span>
              </div>
              <label htmlFor="photo-upload" className="btn-browse" style={{ cursor: 'pointer' }}>
                {loading && formData.photo ? 'Uploading...' : 'Browse'}
              </label>
              <input
                id="photo-upload"
                type="file"
                className="file-input"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                style={{ display: 'none' }}
              />
            </div>
            {formData.photo && (
              <p className="file-name">
                Selected: {formData.photo.name}
                {uploadedPhotoUrl && <span style={{ color: 'green', marginLeft: '10px' }}>✓ Uploaded</span>}
              </p>
            )}
            {uploadedPhotoUrl && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={`http://localhost:5004${uploadedPhotoUrl}`} 
                  alt="Uploaded preview" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px', 
                    borderRadius: '5px',
                    objectFit: 'cover'
                  }} 
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location</label>
            
            {/* Location Search Input */}
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="🔍 Type location name and press Enter (e.g., 'Rathnapura Road', 'Colombo', 'Galle Road')"
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                  setLocationSearch(e.target.value);
                }}
                onKeyPress={handleLocationSearch}
                className="form-select"
                disabled={loading || searchingLocation}
                style={{ 
                  width: '100%',
                  paddingLeft: '1rem',
                  border: !currentLocation ? '2px solid #f59e0b' : '1px solid #d1d5db',
                  backgroundColor: !currentLocation ? '#fffbeb' : 'white'
                }}
              />
              <p style={{ fontSize: '0.75rem', color: !currentLocation ? '#f59e0b' : '#6b7280', marginTop: '4px', fontWeight: !currentLocation ? '600' : 'normal' }}>
                {searchingLocation ? '🔍 Searching for location...' : !currentLocation ? '⚠️ Required: Type a location name and press Enter to search' : '✅ Location set successfully'}
              </p>
            </div>

            {/* Current Location Display with Map Preview */}
            {currentLocation && (
              <div style={{ marginTop: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.25rem' }}>📍</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                        {formData.location || 'Location Set'}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                        {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '600' }}>✓</span>
                  </div>
                </div>
                
                {/* Google Maps Preview */}
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                  <iframe
                    title="Location Preview"
                    src={`https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0
                    }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {!currentLocation && (
              <div className="location-map" style={{ marginTop: '10px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
                <span className="map-placeholder" style={{ color: '#9ca3af' }}>
                  🗺️ Map will appear here after you search for a location
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading || !currentLocation}
            style={{
              opacity: !currentLocation ? 0.5 : 1,
              cursor: !currentLocation ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Submitting...' : currentLocation ? '✅ Submit Report' : '⚠️ Search Location First'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportHazardModal;
