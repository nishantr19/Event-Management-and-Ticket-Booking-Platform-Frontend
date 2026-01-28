import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EventCard.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      CONCERT: '#8b5cf6',
      MOVIE: '#ef4444',
      SPORTS: '#10b981',
      THEATRE: '#f59e0b',
      COMEDY: '#ec4899',
      CONFERENCE: '#3b82f6',
      WORKSHOP: '#6366f1',
      OTHER: '#6b7280'
    };
    return colors[category] || colors.OTHER;
  };

  return (
    <div className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
      <div 
        className="event-image"
        style={{ 
          background: event.imageUrl 
            ? `url(${event.imageUrl}) center/cover` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {!event.imageUrl && <span className="event-icon">🎭</span>}
      </div>

      <div className="event-content">
        <span 
          className="event-category"
          style={{ backgroundColor: getCategoryColor(event.category) }}
        >
          {event.category}
        </span>

        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>

        <div className="event-details">
          <div className="event-detail">
            <span>📍</span>
            <span>{event.venue}, {event.city}</span>
          </div>
          <div className="event-detail">
            <span>📅</span>
            <span>{formatDate(event.eventDate)}</span>
          </div>
          <div className="event-detail">
            <span>🎫</span>
            <span>{event.availableSeats} / {event.totalSeats} seats</span>
          </div>
        </div>

        <div className="event-footer">
          <span className="event-price">₹{event.ticketPrice}</span>
          <button className="btn-book">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;