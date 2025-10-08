import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/EventCard.css';

const EventCard = ({ event, showLocation = false }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const startTime = new Date(event.start_time);
      const endTime = new Date(event.end_time);

      // Check if event has passed
      if (now > endTime) {
        setIsPast(true);
        const timeSince = now - endTime;
        setTimeRemaining(formatTimeDifference(timeSince, true));
        return;
      }

      // Calculate countdown to event start
      const diff = startTime - now;
      if (diff > 0) {
        setTimeRemaining(formatTimeDifference(diff, false));
      } else {
        setTimeRemaining('In Progress');
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [event]);

  const formatTimeDifference = (ms, isPast) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return isPast ? `Ended ${days}d ago` : `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return isPast ? `Ended ${hours}h ago` : `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return isPast ? `Ended ${minutes}m ago` : `${minutes}m ${seconds % 60}s`;
    } else {
      return isPast ? `Ended ${seconds}s ago` : `${seconds}s`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`event-card ${isPast ? 'past-event' : ''}`}>
      <div className="event-card-image-container">
        <img
          src={event.image_url}
          alt={event.title}
          className="event-card-image"
        />
        <div className={`event-countdown ${isPast ? 'past' : 'upcoming'}`}>
          <span className="countdown-icon">{isPast ? '✓' : '⏰'}</span>
          <span className="countdown-text">{timeRemaining}</span>
        </div>
      </div>

      <div className="event-card-content">
        <h3 className={`event-card-title ${isPast ? 'past-title' : ''}`}>
          {event.title}
        </h3>

        {showLocation && event.location_name && (
          <Link to={`/locations/${event.location_id}`} className="event-location-badge">
            📍 {event.location_name}
          </Link>
        )}

        <p className="event-description">{event.description}</p>

        <div className="event-details">
          <div className="event-time">
            <span className="time-label">Start:</span>
            <span className="time-value">{formatDate(event.start_time)}</span>
          </div>
          <div className="event-time">
            <span className="time-label">End:</span>
            <span className="time-value">{formatDate(event.end_time)}</span>
          </div>
        </div>

        <div className="event-universe-tag">
          🌟 {event.universe}
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    location_id: PropTypes.number,
    location_name: PropTypes.string,
    universe: PropTypes.string,
    image_url: PropTypes.string
  }).isRequired,
  showLocation: PropTypes.bool
};

export default EventCard;