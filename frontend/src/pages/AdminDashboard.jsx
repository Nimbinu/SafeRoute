import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    verifiedReports: 0,
    resolvedReports: 0,
    pendingReports: 0
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20
  });

  // Check if user is admin
  useEffect(() => {
    checkAdminAccess();
    fetchDashboardStats();
    fetchHazardReports();
  }, []);

  // Fetch reports when filters change
  useEffect(() => {
    fetchHazardReports();
  }, [statusFilter, currentPage]);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Get user profile to check role
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Check if user is admin or moderator
        if (data.data.user.role !== 'admin' && data.data.user.role !== 'moderator') {
          alert('Access denied. Admin privileges required.');
          navigate('/dashboard');
          return;
        }
        setUser(data.data.user);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error checking admin access:', err);
      navigate('/login');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats({
          totalReports: data.data.hazards.total,
          verifiedReports: data.data.hazards.verified,
          resolvedReports: data.data.hazards.resolved,
          pendingReports: data.data.hazards.pending
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchHazardReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Build query string
      const params = new URLSearchParams({
        limit: 20,
        page: currentPage
      });
      
      if (statusFilter !== 'All') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/hazards?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setReports(data.data.hazards);
        setPagination(data.data.pagination);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching hazard reports:', err);
      setError('Failed to load hazard reports');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/hazards/${reportId}/verify`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Update the report in the list
        setReports(reports.map(report => 
          report._id === reportId ? data.data.hazard : report
        ));
        // Refresh stats
        fetchDashboardStats();
        alert('Hazard verified successfully!');
      } else {
        alert(data.message || 'Failed to verify hazard');
      }
    } catch (err) {
      console.error('Error verifying hazard:', err);
      alert('Failed to verify hazard');
    }
  };

  const handleResolve = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/hazards/${reportId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Update the report in the list
        setReports(reports.map(report => 
          report._id === reportId ? data.data.hazard : report
        ));
        // Refresh stats
        fetchDashboardStats();
        alert('Hazard resolved successfully!');
      } else {
        alert(data.message || 'Failed to resolve hazard');
      }
    } catch (err) {
      console.error('Error resolving hazard:', err);
      alert('Failed to resolve hazard');
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm('Are you sure you want to delete this hazard report?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/hazards/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Remove the report from the list
        setReports(reports.filter(report => report._id !== reportId));
        // Refresh stats
        fetchDashboardStats();
        alert('Hazard deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete hazard');
      }
    } catch (err) {
      console.error('Error deleting hazard:', err);
      alert('Failed to delete hazard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'verified':
        return 'status-verified';
      case 'resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
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

  // Client-side location filter
  const filteredReports = reports.filter(report => {
    const matchesLocation = !locationFilter || 
      report.location?.address?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesLocation;
  });

  if (loading && reports.length === 0) {
    return (
      <div className="admin-dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>🛡️</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>SafeRoute</span>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Admin Panel</div>
          </div>
          
          <div className="admin-profile">
            <div className="admin-avatar">
              {user?.avatar ? (
                <img src={`${API_BASE_URL}${user.avatar}`} alt="Admin" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                '👤'
              )}
            </div>
            <div className="admin-info">
              <div className="admin-name">{user?.fullName || 'Admin'}</div>
              <div className="admin-email">{user?.email || 'admin@saferoute.com'}</div>
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: '600' }}>
                {user?.role === 'admin' ? '🔑 Admin' : '👮 Moderator'}
              </div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/dashboard')}>
            <span className="nav-icon">🗺️</span>
            <span className="nav-text">Live Map</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/profile')}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">My Profile</span>
          </button>
        </nav>

        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <h1 className="page-title">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Reports</div>
            <div className="stat-value">{stats.totalReports.toLocaleString()}</div>
            <div className="stat-change positive">
              {stats.pendingReports} pending
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Verified Reports</div>
            <div className="stat-value">{stats.verifiedReports.toLocaleString()}</div>
            <div className="stat-change positive">
              {((stats.verifiedReports / stats.totalReports) * 100 || 0).toFixed(1)}% of total
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Resolved Reports</div>
            <div className="stat-value">{stats.resolvedReports.toLocaleString()}</div>
            <div className="stat-change positive">
              {((stats.resolvedReports / stats.totalReports) * 100 || 0).toFixed(1)}% of total
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <input
            type="text"
            className="filter-input"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
          <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '14px' }}>
            Showing {filteredReports.length} of {pagination.total} reports
          </div>
        </div>

        {/* Reports Table */}
        <div className="reports-section">
          {error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
              <p style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</p>
              <p style={{ fontSize: '18px', fontWeight: '500' }}>{error}</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <p style={{ fontSize: '48px', marginBottom: '10px' }}>📋</p>
              <p style={{ fontSize: '18px', fontWeight: '500' }}>No hazard reports found</p>
              <p style={{ fontSize: '14px', marginTop: '5px' }}>
                {locationFilter ? 'Try adjusting your location filter' : 'Hazards will appear here when reported'}
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>REPORT ID</th>
                    <th>LOCATION</th>
                    <th>HAZARD TYPE</th>
                    <th>SEVERITY</th>
                    <th>REPORTED BY</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report._id}>
                      <td className="report-id">#{report._id.slice(-6).toUpperCase()}</td>
                      <td className="report-location">
                        {report.location?.address || 'N/A'}
                      </td>
                      <td className="report-hazard">{report.hazardType}</td>
                      <td className="report-severity">
                        {getSeverityIcon(report.severity)} {report.severity}
                      </td>
                      <td className="report-user">
                        {report.reportedBy?.fullName || 'Unknown User'}
                      </td>
                      <td className="report-date">
                        {formatDate(report.createdAt)}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {report.status === 'Pending' && (
                            <button 
                              className="btn-action btn-verify"
                              onClick={() => handleVerify(report._id)}
                              title="Verify this hazard"
                            >
                              ✓ Verify
                            </button>
                          )}
                          {report.status !== 'Resolved' && (
                            <button 
                              className="btn-action btn-resolve"
                              onClick={() => handleResolve(report._id)}
                              title="Mark as resolved"
                            >
                              ✓ Resolve
                            </button>
                          )}
                          <button 
                            className="btn-action btn-delete"
                            onClick={() => handleDelete(report._id)}
                            title="Delete this report"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px', 
              marginTop: '20px',
              padding: '20px'
            }}>
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  background: currentPage === 1 ? '#e5e7eb' : '#3b82f6',
                  color: currentPage === 1 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                ← Previous
              </button>
              
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                disabled={currentPage === pagination.pages}
                style={{
                  padding: '8px 16px',
                  background: currentPage === pagination.pages ? '#e5e7eb' : '#3b82f6',
                  color: currentPage === pagination.pages ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: currentPage === pagination.pages ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
