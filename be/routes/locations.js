import express from 'express';
import { createLocationHandler } from '../controllers/locationController.js';

const router = express.Router();

router.post('/', createLocationHandler);

export default router;