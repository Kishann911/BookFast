import express from 'express';
import {
    getUserBookings,
    getAllBookings,
    getResourceBookings,
    getBooking,
    createBooking,
    updateBooking,
    cancelBooking,
    checkConflict
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get current user's bookings
// @access  Private
router.get('/', protect, getUserBookings);

// @route   GET /api/bookings/all
// @desc    Get all bookings (Admin)
// @access  Private/Admin
router.get('/all', protect, admin, getAllBookings);

// @route   GET /api/bookings/resource/:id
// @desc    Get bookings for a specific resource
// @access  Public
router.get('/resource/:id', getResourceBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, getBooking);

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, createBooking);

// @route   POST /api/bookings/check-conflict
// @desc    Check for booking conflicts
// @access  Private
router.post('/check-conflict', protect, checkConflict);

// @route   PUT /api/bookings/:id
// @desc    Update a booking
// @access  Private
router.put('/:id', protect, updateBooking);

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.delete('/:id', protect, cancelBooking);

export default router;
