import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CarsAPI from '../services/CarsAPI'
import OptionsAPI from '../services/OptionsAPI'
import { calculateTotalPrice, formatPrice } from '../utilities/priceCalculator'
import { validateSelections, validateCarName } from '../utilities/validation'
import '../css/CreateCar.css'

const CreateCar = ({ title }) => {
    const navigate = useNavigate()
    const [carName, setCarName] = useState('')
    const [features, setFeatures] = useState([])
    const [selections, setSelections] = useState({})
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        document.title = title || 'Create Car'
        loadFeatures()
    }, [title])

    useEffect(() => {
        calculatePrice()
    }, [selections])

    const loadFeatures = async () => {
        try {
            const data = await OptionsAPI.getAllFeaturesWithOptions()
            setFeatures(data)
            setLoading(false)
        } catch (error) {
            setError('Failed to load features')
            setLoading(false)
        }
    }

    const calculatePrice = () => {
        const selectedOptions = Object.values(selections).filter(Boolean)
        const price = calculateTotalPrice(selectedOptions)
        setTotalPrice(price)
    }

    const handleOptionSelect = (featureId, option) => {
        setSelections(prev => ({
            ...prev,
            [featureId]: option
        }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')

        // Validate car name
        const nameValidation = validateCarName(carName)
        if (!nameValidation.isValid) {
            setError(nameValidation.error)
            return
        }

        // Convert selections to array
        const selectionsArray = Object.entries(selections).map(([featureId, option]) => ({
            feature_id: parseInt(featureId),
            option_id: option.id,
            price: option.price
        }))

        // Validate selections
        const validation = validateSelections(selectionsArray)
        if (!validation.isValid) {
            setError(validation.errors.join('. '))
            return
        }

        try {
            const carData = {
                name: carName,
                selections: selectionsArray,
                total_price: totalPrice
            }

            await CarsAPI.createCar(carData)
            setSuccessMessage('Car created successfully!')

            // Reset form
            setTimeout(() => {
                navigate('/customcars')
            }, 1500)
        } catch (error) {
            setError(error.message || 'Failed to create car')
        }
    }

    if (loading) {
        return <div className="loading">Loading options...</div>
    }

    return (
        <div className="create-car-container">
            <div className="header">
                <h1>🚗 Build Your Custom Car</h1>
                <p>Select your preferred options below</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="create-car-form">
                <div className="form-group">
                    <label htmlFor="carName">Car Name *</label>
                    <input
                        type="text"
                        id="carName"
                        value={carName}
                        onChange={(e) => setCarName(e.target.value)}
                        placeholder="Enter a name for your custom car"
                        required
                    />
                </div>

                <div className="features-grid">
                    {features.map(feature => (
                        <div key={feature.feature_id} className="feature-section">
                            <h2>{feature.feature_name}</h2>
                            <div className="options-grid">
                                {feature.options.map(option => (
                                    <div
                                        key={option.id}
                                        className={`option-card ${selections[feature.feature_id]?.id === option.id ? 'selected' : ''}`}
                                        onClick={() => handleOptionSelect(feature.feature_id, option)}
                                    >
                                        <i className={option.icon_class || 'fa-solid fa-circle'}></i>
                                        <h3>{option.name}</h3>
                                        <p className="price">{formatPrice(option.price)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="total-price-section">
                    <h2>Total Price: {formatPrice(totalPrice)}</h2>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">
                        Create Car
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate('/customcars')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateCar