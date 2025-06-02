
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/Api';
import '../../styles/Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password
      });
      
      console.log('Login response:', res.data); 
      
   
      if (!res.data.token) {
        throw new Error('No token received from server');
      }
      
     
      const token = res.data.token;
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
      
      
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      setSuccess('Login successful! Redirecting...');
      
     
      setFormData({ email: '', password: '' });
      
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
      
    } catch (err) {
      console.error('Login error:', err);
      
     
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (err.response?.status === 404) {
        errorMessage = 'Server not found. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            ⚡
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to your account to continue managing your EV charging experience
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="auth-form-group">
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

         

          {error && (
            <div className="auth-error">
              {/* <span className="error-icon">⚠️</span> */}
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {/* <span className="success-icon">✅</span> */}
              {success}
            </div>
          )}

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <button 
            onClick={handleBackToHome}
            className="back-button"
            type="button"
            disabled={loading}
          >
            Back to Home
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="auth-link"
              onClick={() => navigate('/register')}
              disabled={loading}
            >
              Create one now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}