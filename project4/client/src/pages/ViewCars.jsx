import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CarPreview from '../components/CarPreview'
import CarsAPI from '../services/CarsAPI'
import '../css/ViewCars.css'

const ViewCars = ({ title }) => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        document.title = title || 'Bolt Bucket | Garage'
        loadCars()
    }, [title])

    const loadCars = async () => {
        try {
            const data = await CarsAPI.getAllCars()
            setCars(data)
        } catch (loadError) {
            setError('Failed to load saved cars.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (carId, name) => {
        const confirmed = window.confirm(`Delete "${name}" from your garage?`)

        if (!confirmed) {
            return
        }

        try {
            await CarsAPI.deleteCar(carId)
            setCars((prev) => prev.filter((car) => car.id !== carId))
        } catch (deleteError) {
            setError('Failed to delete the selected car.')
        }
    }

    if (loading) {
        return <div className="loading">Loading your garage...</div>
    }

    return (
        <div className="garage-page">
            <div className="garage-shell">
                <header className="garage-header">
                    <div>
                        <p className="garage-eyebrow">Saved Builds</p>
                        <h1>Your custom car garage.</h1>
                        <p>
                            Review every saved configuration, jump into the detail view,
                            edit a build, or remove it directly from the list.
                        </p>
                    </div>

                    <Link to="/" className="btn-primary">
                        Create New Build
                    </Link>
                </header>

                {error && <div className="error-message">{error}</div>}

                {cars.length === 0 ? (
                    <section className="garage-empty">
                        <h2>No custom cars saved yet.</h2>
                        <p>
                            Build your first configuration to see it appear here.
                        </p>
                        <Link to="/" className="btn-primary">
                            Start Customizing
                        </Link>
                    </section>
                ) : (
                    <section className="garage-grid">
                        {cars.map((car) => {
                            const validSelections =
                                car.selections?.filter((selection) => selection.option_id) || []

                            return (
                                <article key={car.id} className="garage-card">
                                    <CarPreview
                                        selections={validSelections}
                                        totalPrice={car.total_price}
                                        compact
                                    />

                                    <div className="garage-card-body">
                                        <div className="garage-card-heading">
                                            <div>
                                                <p className="garage-card-label">
                                                    Custom Build
                                                </p>
                                                <h2>{car.name}</h2>
                                            </div>
                                            <span className="garage-card-date">
                                                {new Date(car.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="garage-selection-grid">
                                            {validSelections.map((selection) => (
                                                <div
                                                    key={`${car.id}-${selection.feature_id}`}
                                                    className="garage-selection-item"
                                                >
                                                    <span>{selection.feature_name}</span>
                                                    <strong>{selection.option_name}</strong>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="garage-actions">
                                            <Link
                                                to={`/customcars/${car.id}`}
                                                className="btn-secondary"
                                            >
                                                View Details
                                            </Link>
                                            <Link
                                                to={`/edit/${car.id}`}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn-danger"
                                                onClick={() => handleDelete(car.id, car.name)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </section>
                )}
            </div>
        </div>
    )
}

export default ViewCars
