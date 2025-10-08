import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLocationById } from '../services/LocationsAPI';
import { getEventsByLocation } from '../services/EventsAPI';
import EventCard from '../components/EventCard';
import '../styles/LocationDetailPage.css';

const LocationDetailPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationData, eventsData] = await Promise.all([
          getLocationById(id),
          getEventsByLocation(id)
        ]);
        setLocation(locationData);
        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading location details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const filterEvents = () => {
    const now = new Date();

    if (filter === 'upcoming') {
      return events.filter(event => new Date(event.start_time) > now);
    } else if (filter === 'past') {
      return events.filter(event => new Date(event.end_time) < now);
    }
    return events;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading location details...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="error-container">
        <h2>Location not found</h2>
        <Link to="/" className="back-btn">← Back to Home</Link>
      </div>
    );
  }

  const filteredEvents = filterEvents();

  return (
    <div className="location-detail-page">
      <div className="location-header">
        <Link to="/" className="back-btn">← Back to Locations</Link>

        <div className="location-hero">
          <img
            src={location.image_url}
            alt={location.name}
            className="location-hero-image"
          />
          <div className="location-info-overlay">
            <h1 className="location-name">{location.name}</h1>
            <p className="location-universe">🌟 {location.universe}</p>
            <p className="location-description">{location.description}</p>
          </div>
        </div>
      </div>

      <div className="events-section">
        <div className="events-header">
          <h2>Events at {location.name}</h2>
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({events.length})
            </button>
            <button
              className={filter === 'upcoming' ? 'active' : ''}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={filter === 'past' ? 'active' : ''}
              onClick={() => setFilter('past')}
            >
              Past
            </button>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <p className="no-events">No {filter} events found for this location.</p>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetailPage;