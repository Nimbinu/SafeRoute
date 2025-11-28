import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo-section">
          <span className="logo-icon">🛣️</span>
          <span className="logo-text">SafeRoute</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <div className="home-content">
          {/* Left Side - Text Content */}
          <div className="content-left">
            <h1 className="home-title">Your Guide to Safer Journeys</h1>
            
            <p className="home-description">
              Real-time road hazard reporting and intelligent alternative routes. 
              Join our community to drive smarter and safer.
            </p>
            
            <div className="home-buttons">
              <button className="btn-login" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="btn-register" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="content-right">
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80" 
                alt="Road Safety - Accident Scene with Emergency Response" 
                className="hero-image"
              />
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2025 SafeRoute. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
