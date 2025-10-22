import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExteriors, getAllRoofs, getAllWheels, getAllInteriors } from '../services/OptionsAPI';
import { createCar } from '../services/CarsAPI';
import { calculateTotalPrice, formatPrice } from '../utilities/priceCalculator';
import { validateCarConfiguration } from '../utilities/validation';
import '../styles/CreateCar.css';

const CreateCar = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [exteriors, setExteriors] = useState([]);
  const [roofs, setRoofs] = useState([]);
  const [wheels, setWheels] = useState([]);
  const [interiors, setInteriors] = useState([]);

  const [selectedExterior, setSelectedExterior] = useState(null);
  const [selectedRoof, setSelectedRoof] = useState(null);
  const [selectedWheels, setSelectedWheels] = useState(null);
  const [selectedInterior, setSelectedInterior] = useState(null);

  const [totalPrice, setTotalPrice] = useState(40000);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [extData, roofData, wheelData, intData] = await Promise.all([
          getAllExteriors(),
          getAllRoofs(),
          getAllWheels(),
          getAllInteriors()
        ]);

        setExteriors(extData);
        setRoofs(roofData);
        setWheels(wheelData);
        setInteriors(intData);

        // Set default selections
        setSelectedExterior(extData[0]);
        setSelectedRoof(roofData[0]);
        setSelectedWheels(wheelData[0]);
        setSelectedInterior(intData[0]);

        setLoading(false);
      } catch (err) {
        console.error('Error loading options:', err);
        setError('Failed to load options');
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const price = calculateTotalPrice(selectedExterior, selectedRoof, selectedWheels, selectedInterior);
    setTotalPrice(price);
  }, [selectedExterior, selectedRoof, selectedWheels, selectedInterior]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validation = validateCarConfiguration(selectedExterior, selectedRoof, selectedWheels, selectedInterior);

    if (!validation.isValid) {
      setError(validation.errors.join('. '));
      return;
    }

    if (!name.trim()) {
      setError('Please enter a name for your car');
      return;
    }

    try {
      const carData = {
        name: name.trim(),
        exterior_id: selectedExterior.id,
        roof_id: selectedRoof.id,
        wheels_id: selectedWheels.id,
        interior_id: selectedInterior.id,
        total_price: totalPrice
      };

      await createCar(carData);
      navigate('/customcars');
    } catch (err) {
      setError(err.message || 'Failed to create car');
    }
  };

  if (loading) {
    return <div className="loading">Loading options...</div>;
  }

  return (
    <div className="create-car-page">
      <div className="page-header">
        <h1>🚗 Build Your Dream Car</h1>
        <p>Customize every detail to create your perfect ride</p>
      </div>

      <div className="builder-container">
        <div className="car-preview">
          <div
            className="car-visual"
            style={{
              backgroundColor: selectedExterior?.color || '#000',
              border: `5px solid ${selectedInterior?.color || '#666'}`
            }}
          >
            <div className="car-body">
              <div className="car-roof" style={{
                backgroundColor: selectedRoof?.convertible ? 'transparent' : selectedExterior?.color || '#000'
              }}>
                {selectedRoof?.type === 'sunroof' && <div className="sunroof">☀️</div>}
                {selectedRoof?.type === 'panoramic' && <div className="panoramic-roof">🌟</div>}
                {selectedRoof?.convertible && <div className="convertible">🌤️</div>}
              </div>
              <div className="car-windows" style={{
                backgroundColor: 'rgba(100, 150, 200, 0.3)'
              }}></div>
            </div>
            <div className="car-wheels">
              <div className="wheel">{selectedWheels?.image_url || '⭕'}</div>
              <div className="wheel">{selectedWheels?.image_url || '⭕'}</div>
            </div>
          </div>

          <div className="price-display">
            <h2>Total Price</h2>
            <p className="price">{formatPrice(totalPrice)}</p>
          </div>
        </div>

        <div className="customization-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="carName">Car Name *</label>
              <input
                type="text"
                id="carName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Dream Machine"
                className="form-input"
                required
              />
            </div>

            <div className="option-section">
              <h3>Exterior Color</h3>
              <div className="options-grid">
                {exteriors.map((ext) => (
                  <button
                    key={ext.id}
                    type="button"
                    className={`option-card ${selectedExterior?.id === ext.id ? 'selected' : ''}`}
                    onClick={() => setSelectedExterior(ext)}
                  >
                    <span className="option-icon">{ext.image_url}</span>
                    <span className="option-name">{ext.name}</span>
                    <span className="option-price">
                      {ext.price > 0 ? `+${formatPrice(ext.price)}` : 'Included'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="option-section">
              <h3>Roof Type</h3>
              <div className="options-grid">
                {roofs.map((roof) => (
                  <button
                    key={roof.id}
                    type="button"
                    className={`option-card ${selectedRoof?.id === roof.id ? 'selected' : ''}`}
                    onClick={() => setSelectedRoof(roof)}
                  >
                    <span className="option-name">{roof.name}</span>
                    <span className="option-detail">{roof.type}</span>
                    <span className="option-price">
                      {roof.price > 0 ? `+${formatPrice(roof.price)}` : 'Included'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="option-section">
              <h3>Wheels</h3>
              <div className="options-grid">
                {wheels.map((wheel) => (
                  <button
                    key={wheel.id}
                    type="button"
                    className={`option-card ${selectedWheels?.id === wheel.id ? 'selected' : ''}`}
                    onClick={() => setSelectedWheels(wheel)}
                  >
                    <span className="option-icon">{wheel.image_url}</span>
                    <span className="option-name">{wheel.name}</span>
                    <span className="option-price">
                      {wheel.price > 0 ? `+${formatPrice(wheel.price)}` : 'Included'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="option-section">
              <h3>Interior</h3>
              <div className="options-grid">
                {interiors.map((interior) => (
                  <button
                    key={interior.id}
                    type="button"
                    className={`option-card ${selectedInterior?.id === interior.id ? 'selected' : ''}`}
                    onClick={() => setSelectedInterior(interior)}
                  >
                    <span className="option-name">{interior.name}</span>
                    <span className="option-detail">{interior.material} - {interior.color}</span>
                    <span className="option-price">
                      {interior.price > 0 ? `+${formatPrice(interior.price)}` : 'Included'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button">
              🚗 Create My Car
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCar;
