import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import Dashboard from './pages/Dashboard';
import ProcessPage from './pages/ProcessPage';
import Profile from './pages/Profile';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import NotFoundPage from './pages/NotFoundPage';

// Component to protect routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // Redirects non-authenticated users to the login page
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main Application Component with Routing
const AppContent = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes (Main App Functionality) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/process"
            element={
              <ProtectedRoute>
                <ProcessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// The top-level component that wraps the router and context
const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;