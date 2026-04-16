import express from 'express';
import { createLocationHandler, getCurrentLocationHandler, getLocationsHandler } from '../controllers/locationController.js';

const router = express.Router();

router.post('/', createLocationHandler);
router.get('/locations', getLocationsHandler);
router.get('/current', getCurrentLocationHandler);


export default router;