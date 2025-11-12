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
            errorMessage += 'Please allow location access when prompted by your browser.';
          } else if (error.code === 2) {
            errorMessage += 'Location service is unavailable.';
          } else {
            errorMessage += 'Location request timed out.';
          }
          setError(errorMessage);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
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

      if (!currentLocation) {
        throw new Error('⚠️ Location not available. Please allow location access.');
      }

      // Prepare hazard data
      const hazardData = {
        hazardType: formData.hazardType,
        description: formData.description,
        location: {
          type: 'Point',
          coordinates: [currentLocation.longitude, currentLocation.latitude],
          address: formData.location || `${currentLocation.latitude}, ${currentLocation.longitude}`
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
            <div className="location-map">
              {currentLocation ? (
                <span className="map-placeholder">
                  📍 {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </span>
              ) : (
                <span className="map-placeholder">Getting location...</span>
              )}
            </div>
            <p className="location-hint">Location fetched automatically. Click on the map to adjust.</p>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-submit" disabled={loading || !currentLocation}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportHazardModal;
