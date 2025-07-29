// src/routes/auth.routes.ts
import express from 'express';
import { requestSignupOtp, verifyOtpAndSignup, loginUser, getUserProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup-otp', requestSignupOtp);
router.post('/verify-otp', verifyOtpAndSignup);
router.post('/login', loginUser);
router.get('/user', protect, getUserProfile); // To get logged in user info

export default router;
