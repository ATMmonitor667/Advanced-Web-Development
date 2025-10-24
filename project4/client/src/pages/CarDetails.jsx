import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import CarsAPI from '../services/CarsAPI'
import { formatPrice } from '../utilities/priceCalculator'
import '../css/CarDetails.css'

const CarDetails = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    useEffect(() => {
        document.title = title || 'Car Details'
        loadCar()
    }, [id, title])

    const loadCar = async () => {
        try {
            const data = await CarsAPI.getCarById(id)
            setCar(data)
            setLoading(false)
        } catch (error) {
            setError('Failed to load car details')
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            await CarsAPI.deleteCar(id)
            navigate('/customcars')
        } catch (error) {
            setError('Failed to delete car')
        }
    }

    if (loading) {
        return <div className="loading">Loading car details...</div>
    }

    if (error || !car) {
        return (
            <div className="error-container">
                <div className="error-message">{error || 'Car not found'}</div>
                <Link to="/customcars" className="btn-primary">Back to Gallery</Link>
            </div>
        )
    }

    // Filter out null selections
    const validSelections = car.selections?.filter(s => s.option_id !== null) || []

    return (
        <div className="car-details-container">
            <div className="header">
                <div>
                    <h1>{car.name}</h1>
                    <p>Custom Car Configuration</p>
                </div>
                <div className="header-actions">
                    <Link to={`/edit/${car.id}`} className="btn-secondary">
                        <i className="fa-solid fa-edit"></i> Edit
                    </Link>
                    <button
                        onClick={() => setDeleteConfirm(true)}
                        className="btn-danger"
                    >
                        <i className="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>

            <div className="details-grid">
                <div className="details-card">
                    <div className="price-section">
                        <h2>Total Price</h2>
                        <p className="total-price">{formatPrice(car.total_price)}</p>
                    </div>

                    <div className="metadata">
                        <div className="metadata-item">
                            <i className="fa-solid fa-calendar"></i>
                            <div>
                                <small>Created</small>
                                <p>{new Date(car.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                        {car.updated_at && car.updated_at !== car.created_at && (
                            <div className="metadata-item">
                                <i className="fa-solid fa-clock"></i>
                                <div>
                                    <small>Last Updated</small>
                                    <p>{new Date(car.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="selections-card">
                    <h2>Selected Features</h2>
                    <div className="selections-grid">
                        {validSelections.map((selection, index) => (
                            <div key={index} className="selection-item">
                                <i className={selection.icon_class || 'fa-solid fa-circle'}></i>
                                <div className="selection-info">
                                    <small>{selection.feature_name}</small>
                                    <h3>{selection.option_name}</h3>
                                    <p className="selection-price">{formatPrice(selection.option_price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="actions">
                <Link to="/customcars" className="btn-secondary">
                    <i className="fa-solid fa-arrow-left"></i> Back to Gallery
                </Link>
            </div>

            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete "{car.name}"? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button onClick={handleDelete} className="btn-danger">
                                Yes, Delete
                            </button>
                            <button onClick={() => setDeleteConfirm(false)} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CarDetails