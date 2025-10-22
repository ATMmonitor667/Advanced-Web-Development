import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCars, deleteCar } from '../services/CarsAPI';
import { formatPrice } from '../utilities/priceCalculator';
import '../styles/AllCars.css';

const AllCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const data = await getAllCars();
      setCars(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load cars');
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteCar(id);
        setCars(cars.filter(car => car.id !== id));
      } catch (err) {
        alert('Failed to delete car');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading your garage...</div>;
  }

  return (
    <div className="all-cars-page">
      <div className="page-header">
        <h1>🏎️ My Garage</h1>
        <p>Your custom car collection</p>
        <Link to="/" className="create-new-btn">
          + Create New Car
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {cars.length === 0 ? (
        <div className="empty-state">
          <h2>No cars in your garage yet</h2>
          <p>Start building your dream car!</p>
          <Link to="/" className="cta-button">
            Build Your First Car
          </Link>
        </div>
      ) : (
        <div className="cars-grid">
          {cars.map((car) => (
            <div key={car.id} className="car-card">
              <div
                className="car-card-visual"
                style={{
                  backgroundColor: car.exterior_color || '#000',
                  border: `4px solid ${car.interior_color || '#666'}`
                }}
              >
                <div className="car-card-body">
                  <div className="car-card-roof">
                    {car.convertible && '🌤️'}
                    {car.roof_type === 'sunroof' && '☀️'}
                    {car.roof_type === 'panoramic' && '🌟'}
                  </div>
                </div>
                <div className="car-card-wheels">
                  <span>⭕</span>
                  <span>⭕</span>
                </div>
              </div>

              <div className="car-card-content">
                <h3 className="car-name">{car.name}</h3>

                <div className="car-specs">
                  <div className="spec">
                    <span className="spec-label">Exterior:</span>
                    <span className="spec-value">{car.exterior_name}</span>
                  </div>
                  <div className="spec">
                    <span className="spec-label">Roof:</span>
                    <span className="spec-value">{car.roof_name}</span>
                  </div>
                  <div className="spec">
                    <span className="spec-label">Wheels:</span>
                    <span className="spec-value">{car.wheels_name}</span>
                  </div>
                  <div className="spec">
                    <span className="spec-label">Interior:</span>
                    <span className="spec-value">{car.interior_name}</span>
                  </div>
                </div>

                <div className="car-price">
                  {formatPrice(car.total_price)}
                </div>

                <div className="car-card-actions">
                  <Link to={`/customcars/${car.id}`} className="btn btn-view">
                    View Details
                  </Link>
                  <Link to={`/edit/${car.id}`} className="btn btn-edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(car.id, car.name)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCars;
