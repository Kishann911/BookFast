import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ToastProvider } from './contexts/ToastContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Journey from './pages/Journey';
import MyBookings from './pages/MyBookings';
import NewBooking from './pages/NewBooking';

import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import Resources from './pages/Resources';
import NotFound from './pages/NotFound';
import './styles/global.css';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SocketProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/journey" element={<Journey />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/new"
                element={
                  <ProtectedRoute>
                    <NewBooking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              {/* 404 Route - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </SocketProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

