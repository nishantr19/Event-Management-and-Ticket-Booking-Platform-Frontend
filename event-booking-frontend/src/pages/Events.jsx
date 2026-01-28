import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import toast from 'react-hot-toast';
import { EVENT_CATEGORIES } from '../utils/constants';
import '../styles/Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadEvents();
  }, [page, selectedCategory]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedCategory) {
        response = await eventService.getEventsByCategory(selectedCategory, page);
      } else {
        response = await eventService.getAllEvents(page);
      }
      setEvents(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      loadEvents();
      return;
    }

    setLoading(true);
    try {
      const response = await eventService.searchEvents(searchKeyword, page);
      setEvents(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(0);
    setSearchKeyword('');
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Discover Events</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search events..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍 Search
          </button>
        </form>

        <div className="category-filter">
          <button
            onClick={() => handleCategoryChange('')}
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          >
            All
          </button>
          {EVENT_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="no-events">
            <p>No events found</p>
          </div>
        ) : (
          <>
            <div className="events-grid">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="page-btn"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages - 1}
                  className="page-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;