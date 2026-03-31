import { pool } from '../database.js'

const REQUIRED_FEATURE_IDS = [1, 2, 3, 4]

const itemSelectQuery = `
    SELECT
        ci.*,
        COALESCE(
            json_agg(
                json_build_object(
                    'feature_id', f.id,
                    'feature_name', f.name,
                    'option_id', o.id,
                    'option_name', o.name,
                    'option_price', o.price,
                    'icon_class', o.icon_class
                )
                ORDER BY f.id
            ) FILTER (WHERE o.id IS NOT NULL),
            '[]'::json
        ) as selections
    FROM custom_items ci
    LEFT JOIN item_selections isel ON ci.id = isel.custom_item_id
    LEFT JOIN features f ON isel.feature_id = f.id
    LEFT JOIN options o ON isel.option_id = o.id
`

const validateSelections = async (client, selections) => {
    if (!Array.isArray(selections) || selections.length === 0) {
        throw new Error('Selections are required.')
    }

    const selectedFeatures = [...new Set(selections.map((selection) => selection.feature_id))]

    if (
        selectedFeatures.length !== REQUIRED_FEATURE_IDS.length ||
        !REQUIRED_FEATURE_IDS.every((featureId) => selectedFeatures.includes(featureId))
    ) {
        throw new Error('All four features must be selected before saving.')
    }

    const optionIds = selections.map((selection) => selection.option_id)
    const optionsResult = await client.query(
        `
            SELECT id, feature_id, name, price
            FROM options
            WHERE id = ANY($1::int[])
        `,
        [optionIds]
    )

    if (optionsResult.rows.length !== optionIds.length) {
        throw new Error('One or more selected options are invalid.')
    }

    const optionMap = new Map(
        optionsResult.rows.map((option) => [option.id, option])
    )

    let totalPrice = 0

    selections.forEach((selection) => {
        const option = optionMap.get(selection.option_id)

        if (!option || option.feature_id !== selection.feature_id) {
            throw new Error('Selected options do not match the requested features.')
        }

        totalPrice += Number(option.price)
    })

    const hasElectric = selections.some(
        (selection) => optionMap.get(selection.option_id)?.name === 'Electric'
    )
    const hasSport = selections.some(
        (selection) => optionMap.get(selection.option_id)?.name === 'Sport'
    )

    if (hasElectric && hasSport) {
        throw new Error(
            'Invalid combination: Electric engine is not compatible with sport wheels.'
        )
    }

    return {
        selections: selections.map((selection) => ({
            feature_id: selection.feature_id,
            option_id: selection.option_id,
        })),
        totalPrice,
    }
}

const getAllCustomItems = async (_, res) => {
    try {
        const results = await pool.query(`
            ${itemSelectQuery}
            GROUP BY ci.id
            ORDER BY ci.created_at DESC
        `)

        res.status(200).json(results.rows)
    } catch (error) {
        console.error('Error getting custom items:', error)
        res.status(400).json({ error: error.message })
    }
}

const getCustomItemById = async (req, res) => {
    try {
        const itemId = Number.parseInt(req.params.id, 10)
        const results = await pool.query(
            `
                ${itemSelectQuery}
                WHERE ci.id = $1
                GROUP BY ci.id
            `,
            [itemId]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found.' })
        }

        res.status(200).json(results.rows[0])
    } catch (error) {
        console.error('Error getting custom item:', error)
        res.status(400).json({ error: error.message })
    }
}

const createCustomItem = async (req, res) => {
    const client = await pool.connect()

    try {
        const name = req.body.name?.trim()
        const { selections } = req.body

        if (!name) {
            return res.status(400).json({ error: 'Name is required.' })
        }

        const validated = await validateSelections(client, selections)

        await client.query('BEGIN')

        const itemResult = await client.query(
            `
                INSERT INTO custom_items (name, total_price)
                VALUES ($1, $2)
                RETURNING *
            `,
            [name, validated.totalPrice]
        )

        const customItemId = itemResult.rows[0].id

        for (const selection of validated.selections) {
            await client.query(
                `
                    INSERT INTO item_selections (custom_item_id, feature_id, option_id)
                    VALUES ($1, $2, $3)
                `,
                [customItemId, selection.feature_id, selection.option_id]
            )
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

const updateCustomItem = async (req, res) => {
    const client = await pool.connect()

    try {
        const itemId = Number.parseInt(req.params.id, 10)
        const name = req.body.name?.trim()
        const { selections } = req.body

        if (!name) {
            return res.status(400).json({ error: 'Name is required.' })
        }

        const validated = await validateSelections(client, selections)

        await client.query('BEGIN')

        const itemResult = await client.query(
            `
                UPDATE custom_items
                SET name = $1, total_price = $2, updated_at = CURRENT_TIMESTAMP
                WHERE id = $3
                RETURNING *
            `,
            [name, validated.totalPrice, itemId]
        )

        if (itemResult.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ error: 'Custom item not found.' })
        }

        await client.query(
            'DELETE FROM item_selections WHERE custom_item_id = $1',
            [itemId]
        )

        for (const selection of validated.selections) {
            await client.query(
                `
                    INSERT INTO item_selections (custom_item_id, feature_id, option_id)
                    VALUES ($1, $2, $3)
                `,
                [itemId, selection.feature_id, selection.option_id]
            )
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

const deleteCustomItem = async (req, res) => {
    try {
        const itemId = Number.parseInt(req.params.id, 10)
        const results = await pool.query(
            'DELETE FROM custom_items WHERE id = $1 RETURNING *',
            [itemId]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found.' })
        }

        res.status(200).json({
            message: 'Custom item deleted successfully.',
            item: results.rows[0],
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
    deleteCustomItem,
}
