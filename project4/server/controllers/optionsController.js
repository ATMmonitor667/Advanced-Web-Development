import { pool } from '../database.js'

// Get all features with their options
const getAllFeaturesWithOptions = async (req, res) => {
    try {
        const query = `
            SELECT
                f.id as feature_id,
                f.name as feature_name,
                json_agg(
                    json_build_object(
                        'id', o.id,
                        'name', o.name,
                        'price', o.price,
                        'icon_class', o.icon_class
                    ) ORDER BY o.id
                ) as options
            FROM features f
            LEFT JOIN options o ON f.id = o.feature_id
            GROUP BY f.id, f.name
            ORDER BY f.id
        `

        const results = await pool.query(query)
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('Error getting features with options:', error)
        res.status(400).json({ error: error.message })
    }
}

// Get all options
const getAllOptions = async (req, res) => {
    try {
        const query = `
            SELECT o.*, f.name as feature_name
            FROM options o
            LEFT JOIN features f ON o.feature_id = f.id
            ORDER BY o.feature_id, o.id
        `

        const results = await pool.query(query)
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('Error getting options:', error)
        res.status(400).json({ error: error.message })
    }
}

// Get options by feature ID
const getOptionsByFeature = async (req, res) => {
    try {
        const featureId = parseInt(req.params.featureId)

        const results = await pool.query(
            'SELECT * FROM options WHERE feature_id = $1 ORDER BY id',
            [featureId]
        )

        res.status(200).json(results.rows)
    } catch (error) {
        console.error('Error getting options by feature:', error)
        res.status(400).json({ error: error.message })
    }
}

export default {
    getAllFeaturesWithOptions,
    getAllOptions,
    getOptionsByFeature
}
