import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'Admin',
    email: 'admin@saferoute.com',
    avatar: '👤'
  });

  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');

  const [reports, setReports] = useState([
    {
      id: '12345',
      location: '123 Main St, Anytown',
      hazardType: 'Pothole',
      reportedBy: 'John Doe',
      status: 'Pending'
    },
    {
      id: '12346',
      location: '456 Oak Ave, Anytown',
      hazardType: 'Debris',
      reportedBy: 'Jane Smith',
      status: 'Verified'
    },
    {
      id: '12347',
      location: '789 Pine Ln, Anytown',
      hazardType: 'Flooding',
      reportedBy: 'Peter Jones',
      status: 'Resolved'
    },
    {
      id: '12348',
      location: '101 Maple Dr, Anytown',
      hazardType: 'Roadkill',
      reportedBy: 'Mary Johnson',
      status: 'Pending'
    },
    {
      id: '12349',
      location: '212 Birch Rd, Anytown',
      hazardType: 'Ice',
      reportedBy: 'David Williams',
      status: 'Verified'
    }
  ]);

  const stats = {
    totalReports: 1234,
    totalChange: '+12% from last month',
    verifiedReports: 876,
    verifiedChange: '+8% from last month',
    resolvedReports: 543,
    resolvedChange: '+5% from last month'
  };

  const handleVerify = (reportId) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: 'Verified' } : report
    ));
  };

  const handleResolve = (reportId) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: 'Resolved' } : report
    ));
  };

  const handleDelete = (reportId) => {
    setReports(reports.filter(report => report.id !== reportId));
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
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

  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
    const matchesLocation = !locationFilter || report.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesStatus && matchesLocation;
  });

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-profile">
            <div className="admin-avatar">{user.avatar}</div>
            <div className="admin-info">
              <div className="admin-name">{user.name}</div>
              <div className="admin-email">{user.email}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/dashboard')}>
            <span className="nav-icon">👥</span>
            <span className="nav-text">User Management</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/profile')}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>

        <button className="btn-logout" onClick={() => navigate('/')}>Logout</button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <h1 className="page-title">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Reports</div>
            <div className="stat-value">{stats.totalReports.toLocaleString()}</div>
            <div className="stat-change positive">{stats.totalChange}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Verified Reports</div>
            <div className="stat-value">{stats.verifiedReports.toLocaleString()}</div>
            <div className="stat-change positive">{stats.verifiedChange}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Resolved Reports</div>
            <div className="stat-value">{stats.resolvedReports.toLocaleString()}</div>
            <div className="stat-change positive">{stats.resolvedChange}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
        </div>

        {/* Reports Table */}
        <div className="reports-section">
          <div className="table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>REPORT ID</th>
                  <th>LOCATION</th>
                  <th>HAZARD TYPE</th>
                  <th>REPORTED BY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td className="report-id">#{report.id}</td>
                    <td className="report-location">{report.location}</td>
                    <td className="report-hazard">{report.hazardType}</td>
                    <td className="report-user">{report.reportedBy}</td>
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
                            onClick={() => handleVerify(report.id)}
                          >
                            Verify
                          </button>
                        )}
                        {report.status !== 'Resolved' && (
                          <button 
                            className="btn-action btn-resolve"
                            onClick={() => handleResolve(report.id)}
                          >
                            Resolve
                          </button>
                        )}
                        <button 
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(report.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
