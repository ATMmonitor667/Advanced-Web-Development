import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CarsAPI from '../services/CarsAPI'
import { formatPrice } from '../utilities/priceCalculator'
import '../css/ViewCars.css'

const ViewCars = ({ title }) => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        document.title = title || 'View Cars'
        loadCars()
    }, [title])

    const loadCars = async () => {
        try {
            const data = await CarsAPI.getAllCars()
            setCars(data)
            setLoading(false)
        } catch (error) {
            setError('Failed to load cars')
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="loading">Loading cars...</div>
    }

    if (error) {
        return <div className="error-message">{error}</div>
    }

    return (
        <div className="view-cars-container">
            <div className="header">
                <h1>🚗 Custom Cars Gallery</h1>
                <p>Browse all custom car builds</p>
                <Link to="/" className="btn-primary">
                    <i className="fa-solid fa-plus"></i> Create New Car
                </Link>
            </div>

            {cars.length === 0 ? (
                <div className="empty-state">
                    <i className="fa-solid fa-car"></i>
                    <h2>No custom cars yet</h2>
                    <p>Start building your dream car!</p>
                    <Link to="/" className="btn-primary">Create Your First Car</Link>
                </div>
            ) : (
                <div className="cars-grid">
                    {cars.map(car => {
                        // Filter out null selections
                        const validSelections = car.selections?.filter(s => s.option_id !== null) || []

                        return (
                            <Link
                                key={car.id}
                                to={`/customcars/${car.id}`}
                                className="car-card"
                            >
                                <div className="car-card-header">
                                    <h3>{car.name}</h3>
                                    <span className="price-badge">{formatPrice(car.total_price)}</span>
                                </div>

                                <div className="car-features">
                                    {validSelections.map((selection, index) => (
                                        <div key={index} className="feature-item">
                                            <i className={selection.icon_class || 'fa-solid fa-circle'}></i>
                                            <div>
                                                <small>{selection.feature_name}</small>
                                                <p>{selection.option_name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="car-card-footer">
                                    <span className="date">
                                        Created: {new Date(car.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ViewCars