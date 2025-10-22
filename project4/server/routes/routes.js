import express from 'express';
import carsController from '../controllers/cars.js';
import optionsController from '../controllers/options.js';

const router = express.Router();

// Custom cars routes
router.get('/cars', carsController.getAllCars);
router.get('/cars/:id', carsController.getCarById);
router.post('/cars', carsController.createCar);
router.patch('/cars/:id', carsController.updateCar);
router.delete('/cars/:id', carsController.deleteCar);

// Options routes
router.get('/exteriors', optionsController.getAllExteriors);
router.get('/roofs', optionsController.getAllRoofs);
router.get('/wheels', optionsController.getAllWheels);
router.get('/interiors', optionsController.getAllInteriors);

export default router;
