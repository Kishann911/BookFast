import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getBookingAnalytics,
    exportData
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, admin);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private/Admin
router.get('/users', getAllUsers);

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', updateUserRole);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', deleteUser);

// @route   GET /api/admin/analytics/bookings
// @desc    Get booking analytics
// @access  Private/Admin
router.get('/analytics/bookings', getBookingAnalytics);

// @route   GET /api/admin/export/:type
// @desc    Export data (users, resources, bookings)
// @access  Private/Admin
router.get('/export/:type', exportData);

export default router;
