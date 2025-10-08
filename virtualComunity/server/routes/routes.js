import express from 'express';
import locationsController from '../controllers/locations.js';
import eventsController from '../controllers/events.js';

const router = express.Router();

// Location routes
router.get('/locations', locationsController.getLocations);
router.get('/locations/:id', locationsController.getLocationById);

// Event routes
router.get('/events', eventsController.getEvents);
router.get('/events/:id', eventsController.getEventById);
router.get('/locations/:locationId/events', eventsController.getEventsByLocation);

export default router;