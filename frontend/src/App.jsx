import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Candidate pages
import Dashboard from './pages/Candidate/Dashboard';
import UploadResume from './pages/Candidate/UploadResume';
import CreateInterview from './pages/Candidate/CreateInterview';
import InterviewScreen from './pages/Candidate/InterviewScreen';
import Results from './pages/Candidate/Results';
import Profile from './pages/Candidate/Profile';

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminInterviews from './pages/Admin/Interviews';

import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const root = window.document.body;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Candidate Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload-resume" 
            element={
              <ProtectedRoute>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <UploadResume />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-interview" 
            element={
              <ProtectedRoute>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <CreateInterview />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/interview/:id" 
            element={
              <ProtectedRoute>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <InterviewScreen />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results/:id" 
            element={
              <ProtectedRoute>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <Results />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <AdminUsers />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/interviews" 
            element={
              <ProtectedRoute adminOnly>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <AdminInterviews />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
