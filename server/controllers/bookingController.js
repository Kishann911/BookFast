import Booking from '../models/Booking.js';
import Resource from '../models/Resource.js';
import { sendEmail } from '../utils/email.js';

// Socket.IO will be accessed via req.app.get('io')
let io = null;

export const emitBookingUpdate = (event, data) => {
    if (io) {
        io.to(`resource:${data.resourceId}`).emit(event, data);
    }
};

// Initialize io reference
export const initializeSocketIO = (socketIO) => {
    io = socketIO;
};

// @desc    Get current user's bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;

        const query = { userId: req.user._id };

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        // Filter by date range if provided
        if (startDate && endDate) {
            query.startTime = { $gte: new Date(startDate) };
            query.endTime = { $lte: new Date(endDate) };
        }

        const bookings = await Booking.find(query)
            .populate('resourceId', 'name type capacity images')
            .sort({ startTime: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/all
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
    try {
        const { status, resourceId, userId, startDate, endDate } = req.query;

        const query = {};

        if (status) query.status = status;
        if (resourceId) query.resourceId = resourceId;
        if (userId) query.userId = userId;

        if (startDate && endDate) {
            query.startTime = { $gte: new Date(startDate) };
            query.endTime = { $lte: new Date(endDate) };
        }

        const bookings = await Booking.find(query)
            .populate('resourceId', 'name type capacity')
            .populate('userId', 'name email')
            .sort({ startTime: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get bookings for a specific resource
// @route   GET /api/bookings/resource/:id
// @access  Public
export const getResourceBookings = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = {
            resourceId: req.params.id,
            status: 'confirmed'
        };

        // Filter by date range if provided
        if (startDate && endDate) {
            query.startTime = { $gte: new Date(startDate) };
            query.endTime = { $lte: new Date(endDate) };
        }

        const bookings = await Booking.find(query)
            .populate('userId', 'name email')
            .sort({ startTime: 1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get resource bookings error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('resourceId', 'name type capacity description images')
            .populate('userId', 'name email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns this booking or is admin
        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new booking with conflict prevention
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    try {
        const { resourceId, startTime, endTime, notes } = req.body;

        // Validate required fields
        if (!resourceId || !startTime || !endTime) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Validate dates
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        if (end <= start) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        if (start < new Date()) {
            return res.status(400).json({ message: 'Cannot book in the past' });
        }

        // Validate resource exists
        const resource = await Resource.findById(resourceId);
        if (!resource || !resource.isActive) {
            return res.status(404).json({ message: 'Resource not found or inactive' });
        }

        // Check for conflicts - CRITICAL for real-time booking
        const hasConflict = await Booking.hasConflict(resourceId, start, end);

        if (hasConflict) {
            return res.status(409).json({
                message: 'Booking conflict: This time slot is already booked',
                conflict: true
            });
        }

        // Create booking
        const booking = await Booking.create({
            resourceId,
            userId: req.user._id,
            startTime: start,
            endTime: end,
            notes
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate('resourceId', 'name type capacity images')
            .populate('userId', 'name email');

        // Emit real-time update via Socket.IO
        emitBookingUpdate('bookingCreated', populatedBooking);

        // Send confirmation email
        try {
            await sendEmail({
                to: req.user.email,
                subject: 'Booking Confirmation - BookFast',
                template: 'bookingConfirmation',
                data: {
                    userName: req.user.name,
                    resourceName: resource.name,
                    startTime: start.toLocaleString(),
                    endTime: end.toLocaleString(),
                    bookingId: booking._id
                }
            });
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Don't fail booking if email fails
        }

        res.status(201).json(populatedBooking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a booking
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (req, res) => {
    try {
        const { startTime, endTime, notes } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns this booking or is admin
        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        // Check if booking is already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot update cancelled booking' });
        }

        // If updating times, check for conflicts
        if (startTime || endTime) {
            const start = new Date(startTime || booking.startTime);
            const end = new Date(endTime || booking.endTime);

            if (end <= start) {
                return res.status(400).json({ message: 'End time must be after start time' });
            }

            // Check for conflicts (excluding current booking)
            const hasConflict = await Booking.hasConflict(
                booking.resourceId,
                start,
                end,
                booking._id
            );

            if (hasConflict) {
                return res.status(409).json({
                    message: 'Booking conflict: This time slot is already booked',
                    conflict: true
                });
            }

            booking.startTime = start;
            booking.endTime = end;
        }

        if (notes !== undefined) {
            booking.notes = notes;
        }

        const updatedBooking = await booking.save();
        const populatedBooking = await Booking.findById(updatedBooking._id)
            .populate('resourceId', 'name type capacity')
            .populate('userId', 'name email');

        // Emit real-time update
        emitBookingUpdate('bookingUpdated', populatedBooking);

        res.json(populatedBooking);
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('resourceId', 'name')
            .populate('userId', 'name email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns this booking or is admin
        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        // Check if already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        booking.status = 'cancelled';
        await booking.save();

        // Emit real-time update
        emitBookingUpdate('bookingCancelled', booking);

        // Send cancellation email
        try {
            await sendEmail({
                to: booking.userId.email,
                subject: 'Booking Cancellation - BookFast',
                template: 'bookingCancellation',
                data: {
                    userName: booking.userId.name,
                    resourceName: booking.resourceId.name,
                    startTime: booking.startTime.toLocaleString(),
                    bookingId: booking._id
                }
            });
        } catch (emailError) {
            console.error('Error sending cancellation email:', emailError);
        }

        res.json({ message: 'Booking cancelled', booking });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Check for booking conflicts (utility endpoint)
// @route   POST /api/bookings/check-conflict
// @access  Private
export const checkConflict = async (req, res) => {
    try {
        const { resourceId, startTime, endTime, excludeBookingId } = req.body;

        if (!resourceId || !startTime || !endTime) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const hasConflict = await Booking.hasConflict(
            resourceId,
            new Date(startTime),
            new Date(endTime),
            excludeBookingId
        );

        res.json({ hasConflict });
    } catch (error) {
        console.error('Check conflict error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
