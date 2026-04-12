import express from 'express';
import { AlertController } from '../modules/alert/alert.controller.js';

const router = express.Router();

// Chỉ xài router.post cho hàm testAlert
router.post('/test', AlertController.testAlert);

export default router;