import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents } from '../services/EventsAPI';
import { getAllLocations } from '../services/LocationsAPI';
import EventCard from '../components/EventCard';
import '../styles/AllEventsPage.css';

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, locationsData] = await Promise.all([
          getAllEvents(),
          getAllLocations()
        ]);
        setEvents(eventsData);
        setLocations(locationsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading events:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterEvents = () => {
    let filtered = [...events];
    const now = new Date();

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(event => event.location_id === parseInt(selectedLocation));
    }

    // Filter by time
    if (timeFilter === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.start_time) > now);
    } else if (timeFilter === 'past') {
      filtered = filtered.filter(event => new Date(event.end_time) < now);
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  const filteredEvents = filterEvents();

  return (
    <div className="all-events-page">
      <header className="events-header">
        <Link to="/" className="back-btn">← Back to Locations</Link>
        <h1 className="page-title">⚔️ All Battle Events</h1>
        <p className="page-subtitle">Browse and filter events from all locations</p>
      </header>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="location-filter">Filter by Location:</label>
          <select
            id="location-filter"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name} ({location.universe})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="time-filter">Filter by Time:</label>
          <select
            id="time-filter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      <div className="events-count">
        <p>Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}</p>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="no-events">No events found matching your filters.</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} showLocation={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEventsPage;