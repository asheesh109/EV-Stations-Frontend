import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import StationList from '../Components/Stations/StationList';
import StationDetails from '../components/Stations/StationDetails';
import StationForm from '../components/Stations/StationForm';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState({ name: 'Loading...', email: '' });
  const [stats, setStats] = useState({
    totalStations: 0,
    activeStations: 0,
    maintenance: 0,
    revenue: 0
  });

  const logout = () => {

    navigate('/login');
  };

  const isActiveRoute = (path) => {
    const currentPath = location.pathname;
    if (path === '' && (currentPath === '/dashboard' || currentPath === '/dashboard/')) return true;
    if (path === 'new' && currentPath.includes('/dashboard/new')) return true;
    if (path === 'stations' && currentPath.includes('/dashboard') && !currentPath.includes('/new')) return true;
    return false;
  };

  
  useEffect(() => {
   
    const fetchUserData = async () => {
    try {
      const response = await apiCall('/auth/me');
      if (response) {
        setCurrentUser({
          name: response.user.name,
          email: response.user.email,
          id: response.user.id
        });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setCurrentUser({
          name: userData.name || 'User',
          email: userData.email || '',
          id: userData.id
        });
      }
    }
  };

    
    const fetchStats = async () => {
      setStats({
        totalStations: 45,
        activeStations: 42,
        maintenance: 3,
        revenue: 152
      });
    };

    fetchUserData();
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>Station Manager</h1>
          </div>
          
          <div className="header-actions">
            <div className="user-info">
              <div className="user-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="user-name" title={currentUser.email}>
                {currentUser.name}
              </span>
            </div>
            
            <button className="logout-btn" onClick={logout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-links">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActiveRoute('') ? 'active' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Dashboard
            </Link>
            
            <Link 
              to="/dashboard/stations" 
              className={`nav-link ${location.pathname.includes('/stations') ? 'active' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
              </svg>
              All Stations
            </Link>
            
            <Link 
              to="/dashboard/new" 
              className={`nav-link ${isActiveRoute('new') ? 'active' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Add Station
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="content-wrapper">
          <Routes>
            {/* Dashboard Home - Overview with Stats */}
            <Route path="/" element={
              <DashboardHome stats={stats} currentUser={currentUser} />
            } />
            
            {/* All Stations List */}
            <Route path="/stations" element={
              <>
                <div className="page-header">
                  <h2>All Stations</h2>
                  <p>Manage and monitor all your charging stations</p>
                </div>
                <StationList searchTerm={searchTerm} />
              </>
            } />
            
            {/* Add New Station */}
            <Route path="/new" element={
              <>
                <div className="page-header">
                  <h2>Add New Station</h2>
                  <p>Create a new charging station</p>
                </div>
                <StationForm />
              </>
            } />
            
            {/* Station Details */}
            <Route path="/station/:id" element={
              <>
                <div className="page-header">
                  <h2>Station Details</h2>
                  <p>View and manage station information</p>
                </div>
                <StationDetails />
              </>
            } />
            
            {/* Edit Station */}
            <Route path="/station/:id/edit" element={
              <>
                <div className="page-header">
                  <h2>Edit Station</h2>
                  <p>Update station information</p>
                </div>
                <StationForm />
              </>
            } />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>&copy; 2024 Station Manager. All rights reserved.</p>
          <div className="footer-links">
            <a href="#support">Support</a>
            <a href="#docs">Documentation</a>
            <a href="#api">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


function DashboardHome({ stats, currentUser }) {
  return (
    <>
      <div className="page-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, {currentUser.name}!</p>
      </div>
      
      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-value">{stats.totalStations}</div>
          <div className="stat-label">Total Stations</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon active">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-value">{stats.activeStations}</div>
          <div className="stat-label">Active Stations</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-value">{stats.maintenance}</div>
          <div className="stat-label">Under Maintenance</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
              <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-value">${stats.revenue.toLocaleString()}</div>
          <div className="stat-label">Monthly Revenue</div>
        </div>
      </div>
      
    
      
      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="activity-content">
              <p><strong>Station Alpha-01</strong> came online</p>
              <span className="activity-time">2 minutes ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="activity-content">
              <p>New charging session started at <strong>Station Beta-05</strong></p>
              <span className="activity-time">15 minutes ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.29 3.86L1.82 18C1.64486 18.3024 1.55625 18.6453 1.56383 18.9928C1.57142 19.3402 1.67475 19.6792 1.86298 19.9757C2.05121 20.2723 2.31779 20.5157 2.6353 20.6808C2.9528 20.8458 3.30903 20.9267 3.67 20.92H20.33C20.691 20.9267 21.0472 20.8458 21.3647 20.6808C21.6822 20.5157 21.9488 20.2723 22.137 19.9757C22.3253 19.6792 22.4286 19.3402 22.4362 18.9928C22.4437 18.6453 22.3551 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15133C12.6817 2.97954 12.3438 2.88477 12 2.88477C11.6562 2.88477 11.3183 2.97954 11.0188 3.15133C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="activity-content">
              <p><strong>Station Gamma-03</strong> requires maintenance</p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}