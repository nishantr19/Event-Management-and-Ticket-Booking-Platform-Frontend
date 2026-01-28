import React from 'react';

const QRCodeDisplay = ({ qrCodeData, bookingInfo }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px'
    }}>
      <img
        src={`data:image/png;base64,${qrCodeData}`}
        alt="QR Code"
        style={{
          width: '300px',
          height: '300px',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          marginBottom: '20px'
        }}
      />
      {bookingInfo && (
        <div style={{
          textAlign: 'left',
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '16px'
        }}>
          <p><strong>Event:</strong> {bookingInfo.eventTitle}</p>
          <p><strong>Reference:</strong> {bookingInfo.bookingReference}</p>
          <p><strong>Seats:</strong> {bookingInfo.numberOfSeats}</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;