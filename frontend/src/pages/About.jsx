import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004';

const About = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);

      // Fetch team and FAQ data
      const [teamRes, faqRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/about/team`),
        fetch(`${API_BASE_URL}/api/about/faq`)
      ]);

      const teamData = await teamRes.json();
      const faqData = await faqRes.json();

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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  if (loading) {
    return (
      <div className="about-page-new">
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
      <div className="about-page-new">
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
    <div className="about-page-new">
      {/* Header Navigation */}
      <header className="about-header-new">
        <div className="header-container-new">
          <div className="header-logo-new" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: '24px', marginRight: '8px' }}>🛡️</span>
            <span style={{ fontSize: '18px', fontWeight: '700' }}>SafeRoute</span>
          </div>

          <nav className="header-nav-new">
            <button onClick={() => navigate('/')} className="nav-link-new">Home</button>
            <button onClick={() => navigate('/dashboard')} className="nav-link-new">Map</button>
            <button className="nav-link-new active">About Us</button>
          </nav>

          <div className="header-right-new">
            <button className="btn-login-new" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-signup-new" onClick={() => navigate('/register')}>Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section-new">
        <div className="hero-content-new">
          <h1 className="hero-title-new">Making Roads Safer for Everyone.</h1>
          <p className="hero-subtitle-new">
            SafeRoute provides real-time, crowd-sourced data to help you avoid road hazards and find the safest route to your destination.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section-new">
        <div className="section-container-new">
          <h2 className="section-title-new">Our Mission</h2>
          <p className="mission-text-new">
            At SafeRoute, our mission is to create a community of drivers who work together to make our roads safer. By reporting and receiving real-time updates on road hazards, we can all contribute to a safer driving experience for everyone. Our platform leverages cutting-edge technology to provide you with the most accurate and up-to-date information, ensuring you always have a safe and reliable journey ahead.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section-new">
        <div className="section-container-new">
          <h2 className="section-title-new">How It Works</h2>
          
          <div className="features-grid-new">
            <div className="feature-card-new">
              <div className="feature-icon-new">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3 className="feature-title-new">Report Hazards</h3>
              <p className="feature-desc-new">
                Easily report accidents, potholes, or other dangers on the road.
              </p>
            </div>

            <div className="feature-card-new">
              <div className="feature-icon-new">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M22 17H2a3 3 0 003-3V9a3 3 0 00-3-3h20a3 3 0 00-3 3v5a3 3 0 003 3z"/>
                  <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01"/>
                </svg>
              </div>
              <h3 className="feature-title-new">Receive Alerts</h3>
              <p className="feature-desc-new">
                Get instant notifications about hazards on your planned route.
              </p>
            </div>

            <div className="feature-card-new">
              <div className="feature-icon-new">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="feature-title-new">Find Safer Routes</h3>
              <p className="feature-desc-new">
                Our smart algorithm suggests alternative routes to avoid danger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section-new">
        <div className="section-container-new">
          <h2 className="section-title-new">Our Team</h2>
          
          <div className="team-grid-new">
            {/* Default team members */}
            <div className="team-card-new">
              <div className="team-avatar-new">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="50" fill="#e5e7eb"/>
                  <circle cx="50" cy="35" r="15" fill="#6b7280"/>
                  <path d="M 30 70 Q 50 60 70 70 L 70 100 L 30 100 Z" fill="#6b7280"/>
                </svg>
              </div>
              <h3 className="team-name-new">Jane Doe</h3>
              <p className="team-role-new">Founder & CEO</p>
              <p className="team-bio-new">
                Passionate about using technology to solve real-world problems.
              </p>
            </div>

            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member._id} className="team-card-new">
                  {member.photo ? (
                    <img 
                      src={`${API_BASE_URL}${member.photo}`} 
                      alt={member.name}
                      className="team-avatar-new"
                    />
                  ) : (
                    <div className="team-avatar-new" style={{ background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', color: '#64748b' }}>
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="team-name-new">{member.name}</h3>
                  <p className="team-role-new">{member.position}</p>
                  {member.bio && <p className="team-bio-new">{member.bio}</p>}
                </div>
              ))
            ) : (
              <>
                <div className="team-card-new">
                  <div className="team-avatar-new" style={{ background: '#93c5fd', borderRadius: '50%' }}>
                    <span style={{ fontSize: '40px' }}>👨‍💼</span>
                  </div>
                  <h3 className="team-name-new">John Smith</h3>
                  <p className="team-role-new">Lead Engineer</p>
                  <p className="team-bio-new">
                    Expert in mapping technologies and real-time data processing.
                  </p>
                </div>

                <div className="team-card-new">
                  <div className="team-avatar-new" style={{ background: '#c4b5fd', borderRadius: '50%' }}>
                    <span style={{ fontSize: '40px' }}>👩‍💼</span>
                  </div>
                  <h3 className="team-name-new">Emily White</h3>
                  <p className="team-role-new">UX/UI Designer</p>
                  <p className="team-bio-new">
                    Dedicated to creating intuitive and user-friendly interfaces.
                  </p>
                </div>

                <div className="team-card-new">
                  <div className="team-avatar-new" style={{ background: '#6ee7b7', borderRadius: '50%' }}>
                    <span style={{ fontSize: '40px' }}>👨‍💻</span>
                  </div>
                  <h3 className="team-name-new">Michael Brown</h3>
                  <p className="team-role-new">Community Manager</p>
                  <p className="team-bio-new">
                    Building a strong and engaged SafeRoute user community.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section-new">
        <div className="section-container-new">
          <h2 className="section-title-new">Contact Us</h2>
          
          <form onSubmit={handleContactSubmit} className="contact-form-new">
            <div className="form-row-new">
              <div className="form-group-new">
                <label className="form-label-new">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="form-input-new"
                  required
                />
              </div>
              <div className="form-group-new">
                <label className="form-label-new">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="form-input-new"
                  required
                />
              </div>
            </div>
            <div className="form-group-new">
              <label className="form-label-new">Subject</label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="form-input-new"
                required
              />
            </div>
            <div className="form-group-new">
              <label className="form-label-new">Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="form-textarea-new"
                rows="5"
                required
              />
            </div>
            <button type="submit" className="btn-submit-new">Send Message</button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section-new">
        <div className="section-container-new">
          <h2 className="section-title-new">Frequently Asked Questions</h2>
          
          <div className="faq-list-new">
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <details 
                  key={faq._id} 
                  className="faq-item-new"
                  open={expandedFaq === faq._id}
                  onClick={() => setExpandedFaq(expandedFaq === faq._id ? null : faq._id)}
                >
                  <summary className="faq-question-new">
                    {faq.question}
                    <span className="faq-arrow-new">▼</span>
                  </summary>
                  <div className="faq-answer-new">{faq.answer}</div>
                </details>
              ))
            ) : (
              <>
                <details className="faq-item-new">
                  <summary className="faq-question-new">
                    How accurate is the hazard information?
                    <span className="faq-arrow-new">▼</span>
                  </summary>
                  <div className="faq-answer-new">
                    All hazard reports are verified by our community and moderation team to ensure accuracy. We use a combination of user reports, timestamps, and verification status to provide the most reliable information.
                  </div>
                </details>

                <details className="faq-item-new">
                  <summary className="faq-question-new">
                    Is SafeRoute available in my country?
                    <span className="faq-arrow-new">▼</span>
                  </summary>
                  <div className="faq-answer-new">
                    SafeRoute is currently available in Sri Lanka and expanding to more countries. Check our website for the latest availability in your region.
                  </div>
                </details>

                <details className="faq-item-new">
                  <summary className="faq-question-new">
                    How do you protect my privacy?
                    <span className="faq-arrow-new">▼</span>
                  </summary>
                  <div className="faq-answer-new">
                    We take privacy seriously. Your location data is only used to provide route suggestions and is never shared with third parties. All data is encrypted and stored securely.
                  </div>
                </details>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-new">
        <div className="footer-content-new">
          <div className="footer-social-new">
            <a href="#" className="social-link-new">Facebook</a>
            <a href="#" className="social-link-new">Twitter</a>
            <a href="#" className="social-link-new">Instagram</a>
          </div>
          <div className="footer-links-new">
            <a href="#" className="footer-link-new">Terms of Service</a>
            <span className="footer-divider-new">|</span>
            <a href="#" className="footer-link-new">Privacy Policy</a>
          </div>
          <div className="footer-copy-new">
            © 2024 SafeRoute. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
