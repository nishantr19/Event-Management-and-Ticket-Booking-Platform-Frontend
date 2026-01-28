import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [id]);

  const loadEventDetails = async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (error) {
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (numberOfSeats < 1 || numberOfSeats > event.availableSeats) {
      toast.error('Invalid number of seats');
      return;
    }

    setBooking(true);
    try {
      const bookingData = {
        eventId: event.id,
        numberOfSeats: parseInt(numberOfSeats)
      };
      
      const response = await bookingService.createBooking(bookingData);
      toast.success('Booking successful!');
      navigate('/my-bookings');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Booking failed';
      toast.error(errorMsg);
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading-page">Loading event details...</div>;
  }

  if (!event) {
    return <div className="loading-page">Event not found</div>;
  }

  const totalAmount = event.ticketPrice * numberOfSeats;

  return (
    <div className="event-details-page">
      <div className="event-banner" style={{
        background: event.imageUrl 
          ? `url(${event.imageUrl}) center/cover` 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        {!event.imageUrl && <span className="banner-icon">🎭</span>}
      </div>

      <div className="container">
        <div className="event-details-content">
          <div className="event-main-info">
            <span className="event-category-badge">{event.category}</span>
            <h1 className="event-main-title">{event.title}</h1>
            
            <div className="event-info-grid">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <div className="info-label">Venue</div>
                  <div className="info-value">{event.venue}</div>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">🌆</span>
                <div>
                  <div className="info-label">City</div>
                  <div className="info-value">{event.city}</div>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📅</span>
                <div>
                  <div className="info-label">Date & Time</div>
                  <div className="info-value">{formatDate(event.eventDate)}</div>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">🎫</span>
                <div>
                  <div className="info-label">Available Seats</div>
                  <div className="info-value">{event.availableSeats} / {event.totalSeats}</div>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">💰</span>
                <div>
                  <div className="info-label">Ticket Price</div>
                  <div className="info-value">₹{event.ticketPrice}</div>
                </div>
              </div>
            </div>

            <div className="event-description-section">
              <h2>About this Event</h2>
              <p>{event.description}</p>
            </div>
          </div>

          <div className="booking-card">
            <h3>Book Tickets</h3>
            
            <div className="price-display">
              <span className="price-label">Price per ticket</span>
              <span className="price-value">₹{event.ticketPrice}</span>
            </div>

            <div className="seats-selector">
              <label>Number of Seats</label>
              <input
                type="number"
                min="1"
                max={event.availableSeats}
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(e.target.value)}
                disabled={event.availableSeats === 0}
              />
            </div>

            <div className="total-amount">
              <span>Total Amount</span>
              <span className="amount-value">₹{totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={handleBooking}
              disabled={event.availableSeats === 0 || booking}
              className="btn-book-now"
            >
              {booking ? 'Booking...' : event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
            </button>

            {event.availableSeats > 0 && event.availableSeats <= 10 && (
              <div className="warning-message">
                ⚠️ Only {event.availableSeats} seats left!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;