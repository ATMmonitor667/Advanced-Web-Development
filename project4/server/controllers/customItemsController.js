import { pool } from '../database.js'

// Get all custom items with their selections
const getAllCustomItems = async (req, res) => {
    try {
        const query = `
            SELECT
                ci.*,
                json_agg(
                    json_build_object(
                        'feature_id', f.id,
                        'feature_name', f.name,
                        'option_id', o.id,
                        'option_name', o.name,
                        'option_price', o.price,
                        'icon_class', o.icon_class
                    )
                ) as selections
            FROM custom_items ci
            LEFT JOIN item_selections isel ON ci.id = isel.custom_item_id
            LEFT JOIN features f ON isel.feature_id = f.id
            LEFT JOIN options o ON isel.option_id = o.id
            GROUP BY ci.id
            ORDER BY ci.created_at DESC
        `

        const results = await pool.query(query)
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('Error getting custom items:', error)
        res.status(400).json({ error: error.message })
    }
}

// Get a single custom item by ID
const getCustomItemById = async (req, res) => {
    try {
        const itemId = parseInt(req.params.id)

        const query = `
            SELECT
                ci.*,
                json_agg(
                    json_build_object(
                        'feature_id', f.id,
                        'feature_name', f.name,
                        'option_id', o.id,
                        'option_name', o.name,
                        'option_price', o.price,
                        'icon_class', o.icon_class
                    )
                ) as selections
            FROM custom_items ci
            LEFT JOIN item_selections isel ON ci.id = isel.custom_item_id
            LEFT JOIN features f ON isel.feature_id = f.id
            LEFT JOIN options o ON isel.option_id = o.id
            WHERE ci.id = $1
            GROUP BY ci.id
        `

        const results = await pool.query(query, [itemId])

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found' })
        }

        res.status(200).json(results.rows[0])
    } catch (error) {
        console.error('Error getting custom item:', error)
        res.status(400).json({ error: error.message })
    }
}

// Create a new custom item
const createCustomItem = async (req, res) => {
    const client = await pool.connect()

    try {
        const { name, selections, total_price } = req.body

        // Validation: Check for incompatible combinations
        // Example: Electric engine cannot have sport wheels
        const hasElectric = selections.some(s => s.option_id === 13) // Electric engine
        const hasSport = selections.some(s => s.option_id === 6) // Sport wheels

        if (hasElectric && hasSport) {
            return res.status(400).json({
                error: 'Invalid combination: Electric engine is not compatible with sport wheels'
            })
        }

        await client.query('BEGIN')

        // Insert custom item
        const insertItemQuery = `
            INSERT INTO custom_items (name, total_price)
            VALUES ($1, $2)
            RETURNING *
        `
        const itemResult = await client.query(insertItemQuery, [name, total_price])
        const customItemId = itemResult.rows[0].id

        // Insert selections
        for (const selection of selections) {
            const insertSelectionQuery = `
                INSERT INTO item_selections (custom_item_id, feature_id, option_id)
                VALUES ($1, $2, $3)
            `
            await client.query(insertSelectionQuery, [
                customItemId,
                selection.feature_id,
                selection.option_id
            ])
        }

        await client.query('COMMIT')
        res.status(201).json(itemResult.rows[0])
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error creating custom item:', error)
        res.status(400).json({ error: error.message })
    } finally {
        client.release()
    }
}

// Update a custom item
const updateCustomItem = async (req, res) => {
    const client = await pool.connect()

    try {
        const itemId = parseInt(req.params.id)
        const { name, selections, total_price } = req.body

        // Validation: Check for incompatible combinations
        const hasElectric = selections.some(s => s.option_id === 13)
        const hasSport = selections.some(s => s.option_id === 6)

        if (hasElectric && hasSport) {
            return res.status(400).json({
                error: 'Invalid combination: Electric engine is not compatible with sport wheels'
            })
        }

        await client.query('BEGIN')

        // Update custom item
        const updateItemQuery = `
            UPDATE custom_items
            SET name = $1, total_price = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
        `
        const itemResult = await client.query(updateItemQuery, [name, total_price, itemId])

        if (itemResult.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ error: 'Custom item not found' })
        }

        // Delete existing selections
        await client.query('DELETE FROM item_selections WHERE custom_item_id = $1', [itemId])

        // Insert new selections
        for (const selection of selections) {
            const insertSelectionQuery = `
                INSERT INTO item_selections (custom_item_id, feature_id, option_id)
                VALUES ($1, $2, $3)
            `
            await client.query(insertSelectionQuery, [
                itemId,
                selection.feature_id,
                selection.option_id
            ])
        }

        await client.query('COMMIT')
        res.status(200).json(itemResult.rows[0])
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error updating custom item:', error)
        res.status(400).json({ error: error.message })
    } finally {
        client.release()
    }
}

// Delete a custom item
const deleteCustomItem = async (req, res) => {
    try {
        const itemId = parseInt(req.params.id)

        const results = await pool.query(
            'DELETE FROM custom_items WHERE id = $1 RETURNING *',
            [itemId]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found' })
        }

        res.status(200).json({
            message: 'Custom item deleted successfully',
            item: results.rows[0]
        })
    } catch (error) {
        console.error('Error deleting custom item:', error)
        res.status(400).json({ error: error.message })
    }
}

export default {
    getAllCustomItems,
    getCustomItemById,
    createCustomItem,
    updateCustomItem,
    deleteCustomItem
}
