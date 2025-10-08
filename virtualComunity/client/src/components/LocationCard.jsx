import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/LocationCard.css';

const LocationCard = ({ location }) => {
  return (
    <Link to={`/locations/${location.id}`} className="location-card">
      <div className="location-card-image-container">
        <img
          src={location.image_url}
          alt={location.name}
          className="location-card-image"
        />
        <div className="location-card-overlay">
          <span className="location-universe">{location.universe}</span>
        </div>
      </div>
      <div className="location-card-content">
        <h3 className="location-card-title">{location.name}</h3>
        <p className="location-card-description">{location.description}</p>
        <div className="location-card-footer">
          <span className="view-events-link">View Events →</span>
        </div>
      </div>
    </Link>
  );
};

LocationCard.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    universe: PropTypes.string,
    image_url: PropTypes.string
  }).isRequired
};

export default LocationCard;