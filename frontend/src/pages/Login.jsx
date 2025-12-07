import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call backend API
      const response = await fetch('http://localhost:5004/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Login successful - store token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      console.log('Login successful:', data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prompt user for their Google email
      const googleEmail = prompt('Enter your Google email address:');
      
      if (!googleEmail) {
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(googleEmail)) {
        throw new Error('Please enter a valid email address');
      }

      // Prompt for name (for new users)
      const userName = prompt('Enter your full name:', 'Google User');
      
      const googleUser = {
        email: googleEmail,
        fullName: userName || 'Google User',
        role: 'user'
      };
      
      // Try to login first
      let response = await fetch('http://localhost:5004/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: googleUser.email,
          password: 'google_auth_' + googleUser.email,
        }),
      });

      let data = await response.json();

      // If user doesn't exist, register them first
      if (!response.ok && (data.message?.includes('Invalid') || data.message?.includes('not found'))) {
        console.log('User not found, registering new Google user...');
        
        // Register new Google user
        const registerResponse = await fetch('http://localhost:5004/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: googleUser.fullName,
            email: googleUser.email,
            password: 'google_auth_' + googleUser.email,
            role: googleUser.role,
          }),
        });

        const registerData = await registerResponse.json();
        
        if (!registerResponse.ok) {
          throw new Error(registerData.message || 'Registration failed');
        }

        // Now login with the newly created account
        response = await fetch('http://localhost:5004/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: googleUser.email,
            password: 'google_auth_' + googleUser.email,
          }),
        });

        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      // Login successful - store token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('loginMethod', 'google');
      
      console.log('Google login successful:', data);
      alert('✅ Google login successful! Welcome to SafeRoute!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Create a guest user with random ID
      const guestId = 'guest_' + Date.now() + Math.floor(Math.random() * 1000);
      const guestUser = {
        email: `${guestId}@guest.saferoute.com`,
        fullName: 'Guest User',
        role: 'user'
      };
      
      console.log('Creating guest account...');
      
      // Register guest user
      const registerResponse = await fetch('http://localhost:5004/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: guestUser.fullName,
          email: guestUser.email,
          password: 'guest_password_' + guestId,
          role: guestUser.role,
        }),
      });

      const registerData = await registerResponse.json();
      
      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Guest registration failed');
      }

      console.log('Guest registered, logging in...');

      // Login as guest
      const loginResponse = await fetch('http://localhost:5004/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: guestUser.email,
          password: 'guest_password_' + guestId,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Guest login failed');
      }

      // Login successful - store token
      localStorage.setItem('token', loginData.data.token);
      localStorage.setItem('user', JSON.stringify(loginData.data.user));
      localStorage.setItem('isGuest', 'true');
      localStorage.setItem('loginMethod', 'guest');
      
      console.log('Guest login successful:', loginData);
      alert('✅ Welcome! You are using SafeRoute as a guest.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Guest login error:', err);
      setError(err.message || 'Guest mode failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo/Header */}
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">SafeRoute</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="login-card">
          <h1 className="login-title">Login to SafeRoute</h1>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Submit Button */}
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* Google Login */}
          <button onClick={handleGoogleLogin} className="btn-google">
            <span className="google-icon">G</span>
            Login with Google
          </button>

          {/* Guest Continue */}
          <button onClick={handleGuestContinue} className="btn-guest">
            Continue as Guest
          </button>

          {/* Sign Up Link */}
          <div className="signup-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
