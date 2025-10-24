import express from 'express'
import customItemsController from '../controllers/customItemsController.js'

const router = express.Router()

// GET all custom items
router.get('/', customItemsController.getAllCustomItems)

// GET a single custom item by ID
router.get('/:id', customItemsController.getCustomItemById)

// POST create a new custom item
router.post('/', customItemsController.createCustomItem)

// PUT update a custom item
router.put('/:id', customItemsController.updateCustomItem)

// DELETE a custom item
router.delete('/:id', customItemsController.deleteCustomItem)

export default router
