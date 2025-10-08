import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllLocations } from '../services/LocationsAPI';
import LocationCard from '../components/LocationCard';
import '../styles/HomePage.css';

const HomePage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getAllLocations();
        setLocations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading locations:', error);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading battle locations...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="hero-header">
        <h1 className="title">⚔️ Anime Battle Locations</h1>
        <p className="subtitle">
          Explore legendary battle arenas from your favorite anime series
        </p>
        <Link to="/events" className="view-all-events-btn">
          View All Events →
        </Link>
      </header>

      <main className="locations-container">
        <h2 className="section-title">Select a Location</h2>
        <div className="locations-grid">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </main>

      <footer className="page-footer">
        <p>© 2025 Anime Battle Locations | Powered by Epic Battles</p>
      </footer>
    </div>
  );
};

export default HomePage;