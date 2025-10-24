import express from 'express'
import optionsController from '../controllers/optionsController.js'

const router = express.Router()

// GET all features with their options
router.get('/features', optionsController.getAllFeaturesWithOptions)

// GET all options
router.get('/', optionsController.getAllOptions)

// GET options by feature ID
router.get('/feature/:featureId', optionsController.getOptionsByFeature)

export default router
