import express from 'express'
import rateLimit from 'express-rate-limit';
import { loginUser, registerUser } from '../controllers/userController.js';

const router = express.Router();

// Define rate limiting rule for login to prevent brute-force attacks
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: "Too many login attempts from this IP, please try again after 1 minute",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/login', loginLimiter, loginUser);
router.post('/register', registerUser);

export default router;