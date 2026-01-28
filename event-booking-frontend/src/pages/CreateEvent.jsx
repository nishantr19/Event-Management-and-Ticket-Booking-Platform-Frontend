import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { EVENT_CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';
import '../styles/Auth.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'CONCERT',
    venue: '',
    city: '',
    eventDate: '',
    ticketPrice: '',
    totalSeats: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.venue || 
          !formData.city || !formData.eventDate || !formData.ticketPrice || 
          !formData.totalSeats) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }

      // Format the event data
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        venue: formData.venue.trim(),
        city: formData.city.trim(),
        eventDate: formData.eventDate + ':00', // Add seconds to datetime
        ticketPrice: parseFloat(formData.ticketPrice),
        totalSeats: parseInt(formData.totalSeats),
        imageUrl: formData.imageUrl.trim() || null
      };

      console.log('Sending event data:', eventData);

      const response = await eventService.createEvent(eventData);
      console.log('Event created:', response);
      
      toast.success('Event created successfully!');
      navigate('/events');
    } catch (error) {
      console.error('Error details:', error.response?.data);
      
      // Handle validation errors
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check if it's a validation error object
        if (typeof errorData === 'object' && !errorData.message) {
          const errors = Object.entries(errorData)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          toast.error(`Validation errors: ${errors}`);
        } else {
          const errorMsg = errorData.message || 'Failed to create event';
          toast.error(errorMsg);
        }
      } else {
        toast.error('Failed to create event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h2 className="auth-title">Create New Event</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title (min 3 characters)"
              minLength="3"
              maxLength="200"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description (min 10 characters)"
              rows="4"
              minLength="10"
              maxLength="5000"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {EVENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Venue *</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Enter venue name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Event Date & Time *</label>
              <input
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            <div className="form-group">
              <label>Ticket Price (₹) *</label>
              <input
                type="number"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleChange}
                placeholder="Enter ticket price"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Seats *</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                placeholder="Enter total seats"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;