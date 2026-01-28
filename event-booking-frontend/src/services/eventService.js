import api from './api';

export const eventService = {
  getAllEvents: async (page = 0, size = 12) => {
    const response = await api.get(`/events?page=${page}&size=${size}`);
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  searchEvents: async (keyword, page = 0, size = 12) => {
    const response = await api.get(`/events/search?keyword=${keyword}&page=${page}&size=${size}`);
    return response.data;
  },

  getEventsByCategory: async (category, page = 0, size = 12) => {
    const response = await api.get(`/events/category/${category}?page=${page}&size=${size}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};