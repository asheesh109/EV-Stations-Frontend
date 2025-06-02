import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from '../Views/Home';
import Dashboard from '../Views/Dashboard'; 
import Login from '../Components/Auth/Login';
import Register from '../Components/Auth/Register';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (token) {
    console.log('Token found, allowing access to protected route');
    return children;
  }
  
  console.log('No token found, redirecting to login');
  return <Navigate to="/login" replace />;
};

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
