import express from 'express';
import {
    register,
    login,
    getMe,
    updateProfile,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { uploadProfileImage, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, uploadProfileImage, handleUploadError, updateProfile);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   PUT /api/auth/reset-password/:resetToken
// @desc    Reset password
// @access  Public
router.put('/reset-password/:resetToken', resetPassword);

export default router;
