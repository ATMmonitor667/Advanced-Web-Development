import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CarPreview from '../components/CarPreview'
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
        document.title = title || 'Bolt Bucket | Details'
        loadCar()
    }, [id, title])

    const loadCar = async () => {
        try {
            const data = await CarsAPI.getCarById(id)
            setCar(data)
        } catch (loadError) {
            setError('Failed to load custom car details.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            await CarsAPI.deleteCar(id)
            navigate('/customcars')
        } catch (deleteError) {
            setError('Failed to delete the selected car.')
        }
    }

    if (loading) {
        return <div className="loading">Loading build details...</div>
    }

    if (error || !car) {
        return (
            <div className="details-error-state">
                <div className="error-message">{error || 'Car not found.'}</div>
                <Link to="/customcars" className="btn-primary">
                    Back to Garage
                </Link>
            </div>
        )
    }

    const validSelections = car.selections?.filter((selection) => selection.option_id) || []

    return (
        <div className="details-page">
            <div className="details-shell">
                <div className="details-breadcrumb">
                    <Link to="/customcars">Back to Garage</Link>
                </div>

                <div className="details-layout">
                    <aside className="details-sidebar">
                        <CarPreview selections={validSelections} totalPrice={car.total_price} />
                    </aside>

                    <section className="details-content">
                        <header className="details-header">
                            <div>
                                <p className="details-eyebrow">Saved Build</p>
                                <h1>{car.name}</h1>
                                <p className="details-subtitle">
                                    Full specification overview with edit and delete controls.
                                </p>
                            </div>

                            <div className="details-actions">
                                <Link to={`/edit/${car.id}`} className="btn-edit">
                                    Edit Build
                                </Link>
                                <button
                                    type="button"
                                    className="btn-danger"
                                    onClick={() => setDeleteConfirm(true)}
                                >
                                    Delete Build
                                </button>
                            </div>
                        </header>

                        <section className="details-card">
                            <div className="details-card-header">
                                <div>
                                    <p className="details-card-label">Build Total</p>
                                    <h2>{formatPrice(car.total_price)}</h2>
                                </div>
                            </div>

                            <div className="details-selection-grid">
                                {validSelections.map((selection) => (
                                    <div
                                        key={`${car.id}-${selection.feature_id}`}
                                        className="details-selection-item"
                                    >
                                        <span>{selection.feature_name}</span>
                                        <strong>{selection.option_name}</strong>
                                        <p>{formatPrice(selection.option_price)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="details-card">
                            <div className="details-card-header">
                                <div>
                                    <p className="details-card-label">Build Timeline</p>
                                    <h2>Project history</h2>
                                </div>
                            </div>

                            <div className="details-meta-grid">
                                <div className="details-meta-item">
                                    <span>Created</span>
                                    <strong>
                                        {new Date(car.created_at).toLocaleString()}
                                    </strong>
                                </div>
                                <div className="details-meta-item">
                                    <span>Last updated</span>
                                    <strong>
                                        {new Date(car.updated_at || car.created_at).toLocaleString()}
                                    </strong>
                                </div>
                            </div>
                        </section>
                    </section>
                </div>
            </div>

            {deleteConfirm && (
                <div
                    className="modal-overlay"
                    onClick={() => setDeleteConfirm(false)}
                >
                    <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                        <p className="details-card-label">Delete Build</p>
                        <h2>Remove {car.name}?</h2>
                        <p>
                            This will permanently remove the build and all selected
                            configuration data from the database.
                        </p>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn-danger"
                                onClick={handleDelete}
                            >
                                Delete Permanently
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setDeleteConfirm(false)}
                            >
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
