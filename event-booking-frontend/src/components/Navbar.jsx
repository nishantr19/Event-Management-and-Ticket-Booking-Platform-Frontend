import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎫 EventBooking
        </Link>

        <div className="nav-menu">
          <Link to="/events" className="nav-link">Events</Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" className="nav-link">My Bookings</Link>
              
              {isAdmin() && (
                <Link to="/create-event" className="nav-link">Create Event</Link>
              )}

              <span className="nav-user">{user?.fullName}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;