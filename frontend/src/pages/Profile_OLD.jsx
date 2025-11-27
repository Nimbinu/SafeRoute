import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '👤',
  });

  const [reports] = useState([
    {
      id: 1,
      type: 'Pothole',
      date: '2023-10-27 10:00 AM',
      status: 'verified',
    },
    {
      id: 2,
      type: 'Debris on Road',
      date: '2023-10-26 05:30 PM',
      status: 'pending',
    },
    {
      id: 3,
      type: 'Broken Traffic Light',
      date: '2023-10-25 08:15 AM',
      status: 'resolved',
    },
    {
      id: 4,
      type: 'Flooded Street',
      date: '2023-10-24 02:00 PM',
      status: 'verified',
    },
  ]);

  const getStatusClass = (status) => {
    switch (status) {
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

  return (
    <div className="profile-page">
      {/* Header Navigation */}
      <header className="profile-header">
        <div className="header-container">
          <div className="header-left">
            <div className="header-logo">
              <span className="header-logo-icon">🚗</span>
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
            <div className="user-avatar" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>👤</div>
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
                {user.avatar}
              </div>
            </div>

            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>

            <button className="btn-edit-profile">
              <span className="edit-icon">✏️</span>
              Edit Profile
            </button>
          </aside>

          {/* Reported Hazards Section */}
          <section className="hazards-section">
            <h1 className="hazards-title">My Reported Hazards</h1>

            <div className="hazards-table-wrapper">
              <table className="hazards-table">
                <thead>
                  <tr>
                    <th>HAZARD TYPE</th>
                    <th>DATE REPORTED</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="hazard-type">{report.type}</td>
                      <td className="hazard-date">{report.date}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
