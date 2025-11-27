import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="modern-home">
      {/* Clean Navbar */}
      <nav className="clean-navbar">
        <div className="navbar-wrapper">
          <div className="brand-section">
            <span className="brand-icon">🛣️</span>
            <span className="brand-name">SafeRoute</span>
          </div>
          
          <div className="nav-actions">
            <button className="nav-login" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="nav-join" onClick={() => navigate('/register')}>
              Join for Free →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1 className="hero-heading">
              Find Your Safe Route,<br />
              Build Your Network.
            </h1>
            
            <p className="hero-subheading">
              Connect with real-time hazard reporting and intelligent alternative routes. 
              Join our community to drive smarter and safer across Sri Lanka.
            </p>
            
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Join for Free →
              </button>
              <button className="btn-secondary" onClick={() => navigate('/map-dashboard')}>
                <span className="icon-avatar">👥</span>
                Explore Communities
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="visual-card">frontend
              <div className="map-illustration">
                <div className="map-pin pin-1">📍</div>
                <div className="map-pin pin-2">🚨</div>
                <div className="map-pin pin-3">✅</div>
                <div className="route-path"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="clean-footer">
        <p>© 2025 SafeRoute. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
