import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a resource name'],
        trim: true
    },
    type: {
        type: String,
        enum: ['room', 'equipment', 'vehicle', 'desk', 'office', 'other'],
        required: [true, 'Please specify resource type']
    },
    capacity: {
        type: Number,
        min: 1,
        default: 1
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    location: {
        type: String,
        trim: true,
        default: ''
    },
    images: [{
        type: String
    }],
    amenities: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available'
    },
    ocrData: {
        type: String,
        select: false // OCR extracted text
    },
    isActive: {
        type: Boolean,
        default: true
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

// Index for faster queries on active resources
resourceSchema.index({ isActive: 1 });

// Instance method to get current status based on bookings
resourceSchema.methods.getCurrentStatus = async function () {
    // If status is manually set to maintenance, return that
    if (this.status === 'maintenance') {
        return 'maintenance';
    }

    // Check if there's an active booking right now
    const Booking = mongoose.model('Booking');
    const now = new Date();

    const activeBooking = await Booking.findOne({
        resourceId: this._id,
        status: 'confirmed',
        startTime: { $lte: now },
        endTime: { $gte: now }
    });

    return activeBooking ? 'occupied' : 'available';
};

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
