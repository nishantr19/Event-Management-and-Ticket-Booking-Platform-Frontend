import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import toast from 'react-hot-toast';
import '../styles/Booking.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.content);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQR = (booking) => {
    setSelectedBooking(booking);
    setShowQRModal(true);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      loadBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: '#10b981',
      PENDING: '#f59e0b',
      CANCELLED: '#ef4444',
      EXPIRED: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return <div className="loading-page">Loading bookings...</div>;
  }

  return (
    <div className="bookings-page">
      <div className="container">
        <h1 className="page-title">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You haven't made any bookings yet</p>
            <a href="/events" className="btn-browse">Browse Events</a>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card-item">
                <div className="booking-header">
                  <div>
                    <h3 className="booking-event-title">{booking.eventTitle}</h3>
                    <p className="booking-reference">
                      Booking Reference: <strong>{booking.bookingReference}</strong>
                    </p>
                  </div>
                  <span 
                    className="booking-status"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details-grid">
                  <div className="booking-detail">
                    <span className="detail-icon">📍</span>
                    <div>
                      <div className="detail-label">Venue</div>
                      <div className="detail-value">{booking.eventVenue}</div>
                    </div>
                  </div>

                  <div className="booking-detail">
                    <span className="detail-icon">🌆</span>
                    <div>
                      <div className="detail-label">City</div>
                      <div className="detail-value">{booking.eventCity}</div>
                    </div>
                  </div>

                  <div className="booking-detail">
                    <span className="detail-icon">📅</span>
                    <div>
                      <div className="detail-label">Event Date</div>
                      <div className="detail-value">{formatDate(booking.eventDate)}</div>
                    </div>
                  </div>

                  <div className="booking-detail">
                    <span className="detail-icon">🎫</span>
                    <div>
                      <div className="detail-label">Seats</div>
                      <div className="detail-value">{booking.numberOfSeats}</div>
                    </div>
                  </div>

                  <div className="booking-detail">
                    <span className="detail-icon">💰</span>
                    <div>
                      <div className="detail-label">Total Amount</div>
                      <div className="detail-value">₹{booking.totalAmount}</div>
                    </div>
                  </div>

                  <div className="booking-detail">
                    <span className="detail-icon">📆</span>
                    <div>
                      <div className="detail-label">Booked At</div>
                      <div className="detail-value">{formatDate(booking.bookedAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  {booking.status === 'CONFIRMED' && (
                    <>
                      <button
                        onClick={() => handleViewQR(booking)}
                        className="btn-view-qr"
                      >
                        View QR Code
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="btn-cancel"
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Your Ticket</h2>
              <button onClick={() => setShowQRModal(false)} className="modal-close">
                ✕
              </button>
            </div>

            <div className="qr-code-section">
              <img
                src={`data:image/png;base64,${selectedBooking.qrCodeData}`}
                alt="QR Code"
                className="qr-code-image"
              />
              <div className="qr-info">
                <p><strong>Event:</strong> {selectedBooking.eventTitle}</p>
                <p><strong>Reference:</strong> {selectedBooking.bookingReference}</p>
                <p><strong>Seats:</strong> {selectedBooking.numberOfSeats}</p>
                <p><strong>Date:</strong> {formatDate(selectedBooking.eventDate)}</p>
              </div>
              <p className="qr-instruction">
                Show this QR code at the venue entrance
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;