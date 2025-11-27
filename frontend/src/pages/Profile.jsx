import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ pending: 0, verified: 0, resolved: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Form state for editing profile
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
    fetchUserHazards();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        setFormData({
          fullName: data.data.user.fullName,
          email: data.data.user.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHazards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/users/my-hazards?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setReports(data.data.hazards);
        setStats(data.data.counts);
      }
    } catch (err) {
      console.error('Error fetching hazards:', err);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploadingPhoto(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/profile-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Update user avatar in state
        setUser({ ...user, avatar: data.data.url });
        alert('Profile photo updated successfully!');
      } else {
        alert(data.message || 'Failed to upload photo');
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!confirm('Are you sure you want to delete your profile photo?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/upload/profile-photo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setUser({ ...user, avatar: null });
        alert('Profile photo deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete photo');
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Failed to delete photo');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Validate passwords match if changing password
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    // Validate password length
    if (formData.newPassword && formData.newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        fullName: formData.fullName,
        email: formData.email
      };

      // Only include password fields if user is changing password
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        setIsEditing(false);
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'status-verified';
      case 'pending':
        return 'status-pending';
      case 'resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner">🔄</div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={() => navigate('/login')} className="btn-login">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header Navigation */}
      <header className="profile-header">
        <div className="header-container">
          <div className="profile-header-left">
            <div className="header-logo">
              <span className="header-logo-icon">�️</span>
              <span className="header-logo-text">SafeRoute</span>
            </div>
          </div>

          <nav className="header-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/dashboard" className="nav-link">Live Map</Link>
            <Link to="/safe-route" className="nav-link">Safe Route</Link>
          </nav>

          <div className="header-right">
            <button className="btn-my-profile">My Profile</button>
            <div className="user-avatar" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
              {user?.avatar ? (
                <img 
                  src={`${API_BASE_URL}${user.avatar}`} 
                  alt="User avatar" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                '👤'
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-main">
        <div className="profile-container">
          {/* User Profile Card */}
          <aside className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {user?.avatar ? (
                  <img 
                    src={`${API_BASE_URL}${user.avatar}`} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '60px' }}>👤</span>
                )}
              </div>
              
              {/* Photo upload buttons */}
              <div className="avatar-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <label className="btn-upload-photo" style={{ 
                  padding: '8px 16px', 
                  background: '#10b981', 
                  color: 'white', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  {uploadingPhoto ? '⏳ Uploading...' : '📷 Upload Photo'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingPhoto}
                  />
                </label>
                
                {user?.avatar && (
                  <button 
                    onClick={handleDeletePhoto}
                    className="btn-delete-photo"
                    style={{ 
                      padding: '8px 16px', 
                      background: '#ef4444', 
                      color: 'white', 
                      border: 'none',
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>

            {!isEditing ? (
              <>
                <h2 className="profile-name">{user?.fullName}</h2>
                <p className="profile-email">{user?.email}</p>
                
                {/* User Stats */}
                <div className="profile-stats" style={{ marginTop: '20px', padding: '15px', background: '#f3f4f6', borderRadius: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    <div>
                      <strong>Total Reports:</strong> {stats.total}
                    </div>
                    <div>
                      <strong>Verified:</strong> <span style={{ color: '#10b981' }}>{stats.verified}</span>
                    </div>
                    <div>
                      <strong>Pending:</strong> <span style={{ color: '#f59e0b' }}>{stats.pending}</span>
                    </div>
                    <div>
                      <strong>Resolved:</strong> <span style={{ color: '#6b7280' }}>{stats.resolved}</span>
                    </div>
                  </div>
                </div>

                <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                  <span className="edit-icon">✏️</span>
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleUpdateProfile} style={{ width: '100%', marginTop: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      border: '1px solid #d1d5db',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      border: '1px solid #d1d5db',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '15px' }}>
                  Leave password fields empty if you don't want to change your password
                </p>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      border: '1px solid #d1d5db',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      border: '1px solid #d1d5db',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      border: '1px solid #d1d5db',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn-edit-profile" style={{ flex: 1 }}>
                    💾 Save Changes
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        fullName: user.fullName,
                        email: user.email,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    style={{ 
                      flex: 1,
                      padding: '12px 24px',
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}
          </aside>

          {/* Reported Hazards Section */}
          <section className="hazards-section">
            <h1 className="hazards-title">My Reported Hazards</h1>

            {reports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p style={{ fontSize: '48px', marginBottom: '10px' }}>📍</p>
                <p style={{ fontSize: '18px', fontWeight: '500' }}>No hazards reported yet</p>
                <p style={{ fontSize: '14px', marginTop: '5px' }}>Start reporting hazards to make roads safer!</p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  style={{ 
                    marginTop: '20px',
                    padding: '12px 24px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Go to Map Dashboard
                </button>
              </div>
            ) : (
              <div className="hazards-table-wrapper">
                <table className="hazards-table">
                  <thead>
                    <tr>
                      <th>HAZARD TYPE</th>
                      <th>LOCATION</th>
                      <th>DATE REPORTED</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id}>
                        <td className="hazard-type">{report.hazardType}</td>
                        <td className="hazard-location">{report.location?.address || 'N/A'}</td>
                        <td className="hazard-date">{formatDate(report.createdAt)}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(report.status)}`}>
                            {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
