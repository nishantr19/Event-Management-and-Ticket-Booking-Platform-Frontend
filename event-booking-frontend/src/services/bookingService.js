import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async (page = 0, size = 10) => {
    const response = await api.get(`/bookings/my-bookings?page=${page}&size=${size}`);
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  getQRCode: async (id) => {
    const response = await api.get(`/bookings/${id}/qr-code`);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  }
};