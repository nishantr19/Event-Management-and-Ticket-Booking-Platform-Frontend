import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Book Your Favorite Events
          </h1>
          <p className="hero-subtitle">
            Discover concerts, movies, sports events, and more. 
            Book tickets easily with QR code digital ticketing.
          </p>
          <div className="hero-buttons">
            <button 
              onClick={() => navigate('/events')}
              className="btn-primary-large"
            >
              Browse Events
            </button>
            {!isAuthenticated && (
              <button 
                onClick={() => navigate('/register')}
                className="btn-secondary-large"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Easy Booking</h3>
            <p>Book tickets in just a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Digital Tickets</h3>
            <p>QR code based digital ticketing</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payment</h3>
            <p>Safe and secure transactions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Confirmation</h3>
            <p>Get tickets immediately</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Book Your Next Event?</h2>
        <button 
          onClick={() => navigate('/events')}
          className="btn-primary-large"
        >
          Explore Events
        </button>
      </div>
    </div>
  );
};

export default Home;