import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCarById, deleteCar } from '../services/CarsAPI';
import { formatPrice } from '../utilities/priceCalculator';
import '../styles/ViewCar.css';

const ViewCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const data = await getCarById(id);
      setCar(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load car details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${car.name}"?`)) {
      try {
        await deleteCar(id);
        navigate('/customcars');
      } catch (err) {
        alert('Failed to delete car');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading car details...</div>;
  }

  if (error || !car) {
    return (
      <div className="error-state">
        <h2>Car not found</h2>
        <Link to="/customcars" className="back-link">
          ← Back to Garage
        </Link>
      </div>
    );
  }

  return (
    <div className="view-car-page">
      <div className="page-header">
        <Link to="/customcars" className="back-link">
          ← Back to Garage
        </Link>
        <h1>{car.name}</h1>
      </div>

      <div className="car-detail-container">
        <div className="car-visual-section">
          <div
            className="car-large-visual"
            style={{
              backgroundColor: car.exterior_color || '#000',
              border: `8px solid ${car.interior_color || '#666'}`
            }}
          >
            <div className="car-detail-body">
              <div
                className="car-detail-roof"
                style={{
                  backgroundColor: car.convertible ? 'transparent' : car.exterior_color || '#000'
                }}
              >
                {car.convertible && <div className="roof-badge">🌤️ Convertible</div>}
                {car.roof_type === 'sunroof' && <div className="roof-badge">☀️ Sunroof</div>}
                {car.roof_type === 'panoramic' && <div className="roof-badge">🌟 Panoramic</div>}
              </div>
              <div className="car-detail-windows"></div>
            </div>
            <div className="car-detail-wheels">
              <div className="wheel-large">⭕</div>
              <div className="wheel-large">⭕</div>
            </div>
          </div>

          <div className="price-badge">
            <h2>Total Value</h2>
            <p className="price-large">{formatPrice(car.total_price)}</p>
          </div>
        </div>

        <div className="car-details-section">
          <h2>Configuration Details</h2>

          <div className="detail-card">
            <h3>🎨 Exterior</h3>
            <p className="detail-name">{car.exterior_name}</p>
            <p className="detail-price">
              {car.exterior_price > 0 ? `+${formatPrice(car.exterior_price)}` : 'Included'}
            </p>
          </div>

          <div className="detail-card">
            <h3>🏠 Roof</h3>
            <p className="detail-name">{car.roof_name}</p>
            <p className="detail-info">{car.roof_type}</p>
            {car.convertible && <p className="detail-badge">Convertible</p>}
            <p className="detail-price">
              {car.roof_price > 0 ? `+${formatPrice(car.roof_price)}` : 'Included'}
            </p>
          </div>

          <div className="detail-card">
            <h3>⚙️ Wheels</h3>
            <p className="detail-name">{car.wheels_name}</p>
            <p className="detail-info">{car.wheels_size}" diameter</p>
            <p className="detail-price">
              {car.wheels_price > 0 ? `+${formatPrice(car.wheels_price)}` : 'Included'}
            </p>
          </div>

          <div className="detail-card">
            <h3>🪑 Interior</h3>
            <p className="detail-name">{car.interior_name}</p>
            <p className="detail-info">{car.interior_material} - {car.interior_color}</p>
            <p className="detail-price">
              {car.interior_price > 0 ? `+${formatPrice(car.interior_price)}` : 'Included'}
            </p>
          </div>

          <div className="action-buttons">
            <Link to={`/edit/${car.id}`} className="btn btn-primary">
              ✏️ Edit Configuration
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              🗑️ Delete Car
            </button>
          </div>

          <div className="detail-meta">
            <p>Created: {new Date(car.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCar;
