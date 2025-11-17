import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004';

const About = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);

      // Fetch all about data in parallel
      const [contentRes, teamRes, faqRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/about/content`),
        fetch(`${API_BASE_URL}/api/about/team`),
        fetch(`${API_BASE_URL}/api/about/faq`)
      ]);

      const contentData = await contentRes.json();
      const teamData = await teamRes.json();
      const faqData = await faqRes.json();

      if (contentData.success) {
        // Organize content by section
        const organizedContent = {};
        contentData.data.content.forEach(item => {
          organizedContent[item.section] = item;
        });
        setContent(organizedContent);
      }

      if (teamData.success) {
        setTeamMembers(teamData.data.teamMembers);
      }

      if (faqData.success) {
        setFaqs(faqData.data.faqs);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching about data:', err);
      setError('Failed to load page content');
      setLoading(false);
    }
  };

  const getCategories = () => {
    const categories = ['All'];
    faqs.forEach(faq => {
      if (!categories.includes(faq.category)) {
        categories.push(faq.category);
      }
    });
    return categories;
  };

  const filteredFaqs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  if (loading) {
    return (
      <div className="about-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="about-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</p>
          <p style={{ fontSize: '18px', color: '#ef4444', marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={fetchAboutData}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page">
      {/* Header Navigation */}
      <header className="about-header">
        <div className="header-container">
          <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="header-logo-icon">🚗</span>
            <span className="header-logo-text">SafeRoute</span>
          </div>

          <nav className="header-nav">
            <button onClick={() => navigate('/')} className="nav-link">Home</button>
            <button onClick={() => navigate('/dashboard')} className="nav-link">Live Map</button>
            <button onClick={() => navigate('/safe-route')} className="nav-link">Safe Route</button>
            <button className="nav-link active">About</button>
          </nav>

          <div className="header-right">
            <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-register" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content-wrapper">
          <h1 className="about-hero-title">
            {content?.hero?.title || 'About SafeRoute'}
          </h1>
          <p className="about-hero-description">
            {content?.hero?.content || 'Building safer roads through community-driven hazard reporting and intelligent route planning.'}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section mission-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-icon">🎯</span>
            <h2 className="section-title">
              {content?.mission?.title || 'Our Mission'}
            </h2>
          </div>
          <p className="section-text">
            {content?.mission?.content || 'At SafeRoute, our mission is to create a safer driving experience for everyone by leveraging real-time community reporting and smart routing technology. We believe that together, we can reduce accidents and make roads safer for all travelers.'}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-section features-section">
        <div className="section-container">
          <h2 className="section-title-center">
            {content?.features?.title || 'Key Features'}
          </h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3 className="feature-title">Real-Time Reporting</h3>
              <p className="feature-description">
                Report road hazards instantly and help other drivers stay safe. Your reports are verified by our team and shared with the community.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3 className="feature-title">Smart Routing</h3>
              <p className="feature-description">
                Get intelligent route suggestions that avoid reported hazards, saving you time and ensuring a safer journey.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Community-Driven</h3>
              <p className="feature-description">
                Join thousands of users contributing to road safety. Together, we create a comprehensive hazard map.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Live Alerts</h3>
              <p className="feature-description">
                Receive notifications about hazards near your location or along your planned route in real-time.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Analytics Dashboard</h3>
              <p className="feature-description">
                Track your contributions, view statistics, and see the impact you're making on road safety.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3 className="feature-title">Verified Data</h3>
              <p className="feature-description">
                All hazard reports are reviewed and verified by our moderation team to ensure accuracy and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="about-section team-section">
          <div className="section-container">
            <h2 className="section-title-center">Meet Our Team</h2>
            <p className="section-subtitle">
              The passionate individuals behind SafeRoute
            </p>

            <div className="team-grid">
              {teamMembers.map((member) => (
                <div key={member._id} className="team-card">
                  {member.photo ? (
                    <img 
                      src={`${API_BASE_URL}${member.photo}`} 
                      alt={member.name}
                      className="team-photo"
                    />
                  ) : (
                    <div className="team-photo-placeholder">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-position">{member.position}</p>
                  {member.bio && (
                    <p className="team-bio">{member.bio}</p>
                  )}
                  {(member.email || member.social?.linkedin || member.social?.twitter) && (
                    <div className="team-social">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="social-link">📧</a>
                      )}
                      {member.social?.linkedin && (
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">💼</a>
                      )}
                      {member.social?.twitter && (
                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="social-link">🐦</a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      <section className="about-section stats-section">
        <div className="section-container">
          <h2 className="section-title-center">Our Impact</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">10,000+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">50,000+</div>
              <div className="stat-label">Hazards Reported</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">35,000+</div>
              <div className="stat-label">Hazards Resolved</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">95%</div>
              <div className="stat-label">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="about-section faq-section">
          <div className="section-container">
            <h2 className="section-title-center">Frequently Asked Questions</h2>

            {/* Category Filter */}
            {getCategories().length > 1 && (
              <div className="faq-categories">
                {getCategories().map(category => (
                  <button
                    key={category}
                    className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            <div className="faq-list">
              {filteredFaqs.map((faq, index) => (
                <details key={faq._id} className="faq-item">
                  <summary className="faq-question">
                    <span>{faq.question}</span>
                    <span className="faq-icon">▼</span>
                  </summary>
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="about-section cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Make Roads Safer?</h2>
          <p className="cta-description">
            Join thousands of users already contributing to safer roads
          </p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
            <button className="btn-cta-secondary" onClick={() => navigate('/dashboard')}>
              View Live Map
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3 className="footer-title">SafeRoute</h3>
            <p className="footer-text">
              Building safer roads through community-driven reporting and smart routing.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <nav className="footer-nav">
              <button onClick={() => navigate('/')} className="footer-link">Home</button>
              <button onClick={() => navigate('/dashboard')} className="footer-link">Live Map</button>
              <button onClick={() => navigate('/safe-route')} className="footer-link">Safe Route</button>
              <button onClick={() => navigate('/about')} className="footer-link">About</button>
            </nav>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <nav className="footer-nav">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Contact Us</a>
            </nav>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Connect</h4>
            <div className="footer-social">
              <a href="#" className="social-icon">📘</a>
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">📷</a>
              <a href="#" className="social-icon">💼</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 SafeRoute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
