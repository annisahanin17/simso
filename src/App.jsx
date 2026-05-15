import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequestForm from './pages/RequestForm';
import Monitoring from './pages/Monitoring';
import Verification from './pages/Verification';

const normalizeRole = (role) => (role ?? '').toString().trim().toLowerCase();

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles) {
    const allowed = roles.map(normalizeRole);
    if (!allowed.includes(normalizeRole(user.role))) return <Navigate to="/" />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/request" element={
        <ProtectedRoute roles={['Farmasi']}>
          <RequestForm />
        </ProtectedRoute>
      } />
      <Route path="/verify" element={
        <ProtectedRoute roles={['Logistik']}>
          <Verification />
        </ProtectedRoute>
      } />
      <Route path="/monitoring" element={
        <ProtectedRoute roles={['Manajemen', 'Logistik']}>
          <Monitoring />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
