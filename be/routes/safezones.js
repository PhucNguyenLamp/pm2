import express from 'express';
import { getSafezonesHandler, createCircleSafezoneHandler, createRectangleSafezoneHandler, checkSafezoneHandler } from '../controllers/safezoneController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getSafezonesHandler);
router.post('/circle', verifyToken, createCircleSafezoneHandler);
router.post('/rectangle', verifyToken, createRectangleSafezoneHandler);
router.post('/inside', verifyToken, checkSafezoneHandler);
export default router;