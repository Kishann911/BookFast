import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        required: [true, 'Please provide a resource ID']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user ID']
    },
    startTime: {
        type: Date,
        required: [true, 'Please provide a start time']
    },
    endTime: {
        type: Date,
        required: [true, 'Please provide an end time'],
        validate: {
            validator: function (value) {
                return value > this.startTime;
            },
            message: 'End time must be after start time'
        }
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for fast conflict detection queries
// This index helps find overlapping bookings efficiently
bookingSchema.index({ resourceId: 1, startTime: 1, endTime: 1 });

// Index for user bookings queries
bookingSchema.index({ userId: 1, startTime: -1 });

// Index for status queries
bookingSchema.index({ status: 1 });

// Static method to check for conflicts
bookingSchema.statics.hasConflict = async function (resourceId, startTime, endTime, excludeBookingId = null) {
    const query = {
        resourceId,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
        status: 'confirmed'
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const conflict = await this.findOne(query);
    return !!conflict;
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
