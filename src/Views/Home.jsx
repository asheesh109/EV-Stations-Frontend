import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; 

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          EV Charging Management
        </h1>
        
        <p className="hero-subtitle">
          Smart, Efficient, and Sustainable Electric Vehicle Charging Solutions
        </p>
        
        <p className="hero-description">
          Take control of your electric vehicle charging experience with our comprehensive management platform. 
          Monitor charging sessions, track energy consumption, and optimize your charging schedule for maximum efficiency.
        </p>
        
        <div className="cta-buttons">
          <Link to="/register" className="cta-button cta-primary">
            <span>🚀</span>
            Get Started
          </Link>
          <Link to="/login" className="cta-button cta-secondary">
            <span>👤</span>
            Log In
          </Link>
        </div>
        
        {/* Feature Grid */}
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Real-time Monitoring</h3>
            <p className="feature-description">
              Track your charging sessions in real-time with detailed analytics and performance metrics.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Smart Analytics</h3>
            <p className="feature-description">
              Get insights into your charging patterns, energy consumption, and cost optimization opportunities.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔋</div>
            <h3 className="feature-title">Battery Health</h3>
            <p className="feature-description">
              Monitor your EV battery health and receive recommendations for optimal charging practices.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3 className="feature-title">Eco-Friendly</h3>
            <p className="feature-description">
              Track your carbon footprint reduction and contribute to a more sustainable future.
            </p>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1M+</div>
            <div className="stat-label">Charging Sessions</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
        
       <div className="footer-wrapper">
    <div className="footer-note-external">
      Join thousands of EV owners who trust our platform for their charging management needs. 
      Start your journey towards smarter, more efficient electric vehicle charging today.
    </div>
  </div>
      </div>
    </div>
  );
}