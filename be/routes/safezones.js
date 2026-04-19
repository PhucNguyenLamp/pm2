import express from 'express';
import { getSafezonesHandler, createCircleSafezoneHandler, createRectangleSafezoneHandler, checkSafezoneHandler } from '../controllers/safezoneController.js';

const router = express.Router();

router.get('/', getSafezonesHandler);
router.post('/circle', createCircleSafezoneHandler);
router.post('/rectangle', createRectangleSafezoneHandler);
router.post('/inside', checkSafezoneHandler);
export default router;