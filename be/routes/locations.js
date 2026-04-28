import express from 'express';
import { createLocationHandler, getCurrentLocationHandler, getLocationsHandler } from '../controllers/locationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createLocationHandler);
router.get('/locations', verifyToken, getLocationsHandler);
router.get('/current', verifyToken, getCurrentLocationHandler);


export default router;