
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/Api'; 
import '../../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: '', width: 0 });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      return { level: '', width: 0 };
    } else if (password.length < 6) {
      return { level: 'weak', width: 33 };
    } else if (password.length < 10 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { level: 'medium', width: 66 };
    } else {
      return { level: 'strong', width: 100 };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (error) setError(null);
  };

  const handleCheckboxChange = (e) => {
    setAgreeToTerms(e.target.checked);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
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
      
      const response = await api.post('/auth/register', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      console.log('Registration response:', response.data); 

      
      if (response.data.success !== false) {
        setSuccess('Registration successful! Redirecting to login...');
        
        
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setAgreeToTerms(false);
        
       
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1500);
        } else {
          
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
        }
      }

    } catch (err) {
      console.error('Registration error:', err);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 409) {
        errorMessage = 'Email already exists. Please use a different email.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid registration data. Please check your inputs.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🌱</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join us today and start your journey
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error">
              <span className="error-icon"></span>
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              <span className="success-icon"></span>
              {success}
            </div>
          )}

          <div className="auth-form-group">
            <input
              type="text"
              name="name"
              className="auth-input"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div className="auth-form-group">
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div className="auth-form-group">
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
            {formData.password && (
              <div className="password-strength">
                <div className="password-strength-bar">
                  <div 
                    className={`password-strength-fill ${passwordStrength.level}`}
                    style={{ width: `${passwordStrength.width}%` }}
                  ></div>
                </div>
                <div className={`password-strength-text ${passwordStrength.level}`}>
                  {passwordStrength.level === 'weak' && 'Weak password'}
                  {passwordStrength.level === 'medium' && 'Medium strength'}
                  {passwordStrength.level === 'strong' && 'Strong password'}
                </div>
              </div>
            )}
          </div>

          <div className="auth-form-group">
            <input
              type="password"
              name="confirmPassword"
              className="auth-input"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={handleCheckboxChange}
                disabled={loading}
              />
              <span className="checkmark"></span>
              <span>
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading && <div className="loading-spinner"></div>}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <button
            type="button"
            className="back-button"
            onClick={handleBackToLogin}
            disabled={loading}
          >
            Back to Login
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button"
              className="auth-link" 
              onClick={handleBackToLogin}
              disabled={loading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;