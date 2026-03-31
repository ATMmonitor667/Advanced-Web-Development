import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CarPreview from '../components/CarPreview'
import CarsAPI from '../services/CarsAPI'
import OptionsAPI from '../services/OptionsAPI'
import { calculateTotalPrice, formatPrice } from '../utilities/priceCalculator'
import { buildSelectionsFromForm, featureNames } from '../utilities/carAppearance'
import { validateSelections, validateCarName } from '../utilities/validation'
import '../css/CreateCar.css'

const EditCar = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [carName, setCarName] = useState('')
    const [features, setFeatures] = useState([])
    const [selections, setSelections] = useState({})
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        document.title = title || 'Bolt Bucket | Edit'
        loadData()
    }, [id, title])

    useEffect(() => {
        const selectedOptions = Object.values(selections).filter(Boolean)
        setTotalPrice(calculateTotalPrice(selectedOptions))
    }, [selections])

    const loadData = async () => {
        try {
            const [featuresData, carData] = await Promise.all([
                OptionsAPI.getAllFeaturesWithOptions(),
                CarsAPI.getCarById(id),
            ])

            const nextSelections = {}
            const validSelections = carData.selections?.filter((selection) => selection.option_id) || []

            validSelections.forEach((selection) => {
                const feature = featuresData.find(
                    (item) => item.feature_id === selection.feature_id
                )
                const option = feature?.options.find(
                    (item) => item.id === selection.option_id
                )

                if (feature && option) {
                    nextSelections[feature.feature_id] = option
                }
            })

            setFeatures(featuresData)
            setCarName(carData.name)
            setSelections(nextSelections)
        } catch (loadError) {
            setError('Failed to load the saved build.')
        } finally {
            setLoading(false)
        }
    }

    const currentSelections = buildSelectionsFromForm(features, selections)

    const getSelectedOptionName = (featureName) => {
        const feature = features.find((item) => item.feature_name === featureName)
        return feature ? selections[feature.feature_id]?.name || '' : ''
    }

    const isOptionDisabled = (featureName, optionName) => {
        const selectedEngine = getSelectedOptionName(featureNames.engine)
        const selectedWheels = getSelectedOptionName(featureNames.wheels)

        return (
            (featureName === featureNames.wheels &&
                optionName === 'Sport' &&
                selectedEngine === 'Electric') ||
            (featureName === featureNames.engine &&
                optionName === 'Electric' &&
                selectedWheels === 'Sport')
        )
    }

    const getOptionStatus = (featureName, optionName) => {
        if (!isOptionDisabled(featureName, optionName)) {
            return ''
        }

        if (featureName === featureNames.wheels) {
            return 'Unavailable with Electric drive'
        }

        return 'Unavailable with Sport wheels'
    }

    const handleOptionSelect = (feature, option) => {
        if (isOptionDisabled(feature.feature_name, option.name)) {
            return
        }

        setSelections((prev) => ({
            ...prev,
            [feature.feature_id]: option,
        }))
        setError('')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSuccessMessage('')

        const nameValidation = validateCarName(carName)
        if (!nameValidation.isValid) {
            setError(nameValidation.error)
            return
        }

        const selectionsArray = currentSelections.map((selection) => ({
            feature_id: selection.feature_id,
            option_id: selection.option_id,
            price: selection.option_price,
        }))

        const validation = validateSelections(selectionsArray)
        if (!validation.isValid) {
            setError(validation.errors.join(' '))
            return
        }

        try {
            await CarsAPI.updateCar(id, {
                name: carName.trim(),
                selections: selectionsArray,
                total_price: totalPrice,
            })

            setSuccessMessage('Custom car updated successfully.')

            setTimeout(() => {
                navigate(`/customcars/${id}`)
            }, 900)
        } catch (submitError) {
            setError(submitError.message || 'Failed to update custom car.')
        }
    }

    if (loading) {
        return <div className="loading">Loading saved build...</div>
    }

    return (
        <div className="builder-page">
            <div className="builder-shell">
                <div className="builder-heading">
                    <div>
                        <p className="builder-eyebrow">Edit Saved Build</p>
                        <h1>Fine-tune your custom car before you lock it in.</h1>
                        <p className="builder-subtitle">
                            Update the name, swap parts, and save the refreshed build back
                            to your garage.
                        </p>
                    </div>
                </div>

                {error && <div className="builder-message error-message">{error}</div>}
                {successMessage && (
                    <div className="builder-message success-message">{successMessage}</div>
                )}

                <div className="builder-layout">
                    <aside className="builder-sidebar">
                        <CarPreview selections={currentSelections} totalPrice={totalPrice} />
                    </aside>

                    <form onSubmit={handleSubmit} className="builder-form">
                        <section className="builder-card">
                            <div className="form-group">
                                <label htmlFor="carName">Build Name</label>
                                <input
                                    type="text"
                                    id="carName"
                                    value={carName}
                                    onChange={(event) => setCarName(event.target.value)}
                                    placeholder="Example: Canyon Runner"
                                    maxLength={50}
                                    required
                                />
                            </div>
                        </section>

                        {features.map((feature) => (
                            <section key={feature.feature_id} className="builder-card feature-card">
                                <div className="feature-card-header">
                                    <div>
                                        <p className="feature-label">{feature.feature_name}</p>
                                        <h2>Adjust your {feature.feature_name.toLowerCase()}</h2>
                                    </div>
                                    <span className="feature-hint">Choose one option</span>
                                </div>

                                <div className="options-grid">
                                    {feature.options.map((option) => {
                                        const selected =
                                            selections[feature.feature_id]?.id === option.id
                                        const disabled =
                                            isOptionDisabled(feature.feature_name, option.name) &&
                                            !selected

                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                className={`option-card${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
                                                onClick={() => handleOptionSelect(feature, option)}
                                                disabled={disabled}
                                                aria-pressed={selected}
                                            >
                                                <span className="option-card-feature">
                                                    {feature.feature_name}
                                                </span>
                                                <h3>{option.name}</h3>
                                                <p className="option-price">
                                                    {option.price === 0
                                                        ? 'Included'
                                                        : `+${formatPrice(option.price)}`}
                                                </p>
                                                <span className="option-status">
                                                    {selected
                                                        ? 'Selected'
                                                        : getOptionStatus(
                                                              feature.feature_name,
                                                              option.name
                                                          ) || 'Available'}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </section>
                        ))}

                        <section className="builder-card builder-total">
                            <div>
                                <p className="feature-label">Updated Total</p>
                                <h2>{formatPrice(totalPrice)}</h2>
                            </div>

                            <div className="builder-actions">
                                <button type="submit" className="btn-primary">
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => navigate(`/customcars/${id}`)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditCar
