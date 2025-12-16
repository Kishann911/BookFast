import Resource from '../models/Resource.js';
import { processImage, extractTextFromImage } from '../utils/imageProcessing.js';

// @desc    Get all active resources
// @route   GET /api/resources
// @access  Public
export const getResources = async (req, res) => {
    try {
        const { type, minCapacity, maxCapacity, search } = req.query;

        const query = { isActive: true };

        // Filter by type
        if (type) {
            query.type = type;
        }

        // Filter by capacity range
        if (minCapacity || maxCapacity) {
            query.capacity = {};
            if (minCapacity) query.capacity.$gte = parseInt(minCapacity);
            if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity);
        }

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const resources = await Resource.find(query).sort({ name: 1 });

        // Calculate current status for each resource
        const resourcesWithStatus = await Promise.all(
            resources.map(async (resource) => {
                const currentStatus = await resource.getCurrentStatus();
                return {
                    ...resource.toObject(),
                    status: currentStatus
                };
            })
        );

        res.json(resourcesWithStatus);
    } catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all resources (including inactive) - Admin
// @route   GET /api/resources/all
// @access  Private/Admin
export const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find({}).sort({ name: 1 });

        // Calculate current status for each resource
        const resourcesWithStatus = await Promise.all(
            resources.map(async (resource) => {
                const currentStatus = await resource.getCurrentStatus();
                return {
                    ...resource.toObject(),
                    status: currentStatus
                };
            })
        );

        res.json(resourcesWithStatus);
    } catch (error) {
        console.error('Get all resources error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
export const getResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Calculate current status
        const currentStatus = await resource.getCurrentStatus();
        const resourceWithStatus = {
            ...resource.toObject(),
            status: currentStatus
        };

        res.json(resourceWithStatus);
    } catch (error) {
        console.error('Get resource error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private/Admin
export const createResource = async (req, res) => {
    try {
        const { name, type, capacity, description, location, amenities, status } = req.body;

        // Validate required fields
        if (!name || !type) {
            return res.status(400).json({ message: 'Please provide name and type' });
        }

        const resourceData = {
            name,
            type,
            capacity: capacity || 1,
            description: description || '',
            location: location || '',
            amenities: amenities || [],
            status: status || 'available'
        };

        // Handle image uploads
        if (req.files && req.files.length > 0) {
            resourceData.images = req.files.map(file => `/uploads/resources/${file.filename}`);
        }

        const resource = await Resource.create(resourceData);
        res.status(201).json(resource);
    } catch (error) {
        console.error('Create resource error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
export const updateResource = async (req, res) => {
    try {
        const { name, type, capacity, description, location, amenities, isActive, status } = req.body;

        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Update fields
        resource.name = name || resource.name;
        resource.type = type || resource.type;
        resource.capacity = capacity !== undefined ? capacity : resource.capacity;
        resource.description = description !== undefined ? description : resource.description;
        resource.location = location !== undefined ? location : resource.location;
        resource.amenities = amenities !== undefined ? amenities : resource.amenities;
        resource.isActive = isActive !== undefined ? isActive : resource.isActive;
        resource.status = status !== undefined ? status : resource.status;

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/resources/${file.filename}`);
            resource.images = [...(resource.images || []), ...newImages];
        }

        const updatedResource = await resource.save();
        res.json(updatedResource);
    } catch (error) {
        console.error('Update resource error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete/Deactivate a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
export const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Soft delete - set isActive to false
        resource.isActive = false;
        await resource.save();

        res.json({ message: 'Resource deactivated successfully' });
    } catch (error) {
        console.error('Delete resource error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload and process resource image with OCR
// @route   POST /api/resources/:id/upload-image
// @access  Private/Admin
export const uploadResourceImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Process the image (resize, optimize)
        const processedImagePath = await processImage(req.file.path, {
            width: 1200,
            height: 800,
            quality: 85
        });

        const imageUrl = `/uploads/resources/${req.file.filename}`;

        // Add to resource images
        if (!resource.images) {
            resource.images = [];
        }
        resource.images.push(imageUrl);

        // Extract text from image using OCR (if enabled)
        let extractedText = null;
        if (req.query.enableOCR === 'true') {
            try {
                extractedText = await extractTextFromImage(req.file.path);

                // You can use the extracted text to auto-fill description or other fields
                if (extractedText && !resource.description) {
                    resource.ocrData = extractedText; // Store OCR data
                }
            } catch (ocrError) {
                console.error('OCR processing error:', ocrError);
                // Continue even if OCR fails
            }
        }

        await resource.save();

        res.json({
            message: 'Image uploaded successfully',
            imageUrl,
            extractedText,
            resource
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Remove image from resource
// @route   DELETE /api/resources/:id/images
// @access  Private/Admin
export const removeResourceImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (!resource.images || resource.images.length === 0) {
            return res.status(400).json({ message: 'No images to remove' });
        }

        resource.images = resource.images.filter(img => img !== imageUrl);
        await resource.save();

        res.json({ message: 'Image removed successfully', resource });
    } catch (error) {
        console.error('Remove image error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get resource statistics (Admin)
// @route   GET /api/resources/:id/stats
// @access  Private/Admin
export const getResourceStats = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const Booking = (await import('../models/Booking.js')).default;

        // Get booking statistics
        const totalBookings = await Booking.countDocuments({
            resourceId: req.params.id,
            status: 'confirmed'
        });

        const activeBookings = await Booking.countDocuments({
            resourceId: req.params.id,
            status: 'confirmed',
            endTime: { $gte: new Date() }
        });

        const cancelledBookings = await Booking.countDocuments({
            resourceId: req.params.id,
            status: 'cancelled'
        });

        // Get upcoming bookings
        const upcomingBookings = await Booking.find({
            resourceId: req.params.id,
            status: 'confirmed',
            startTime: { $gte: new Date() }
        })
            .populate('userId', 'name email')
            .sort({ startTime: 1 })
            .limit(10);

        res.json({
            resource,
            stats: {
                totalBookings,
                activeBookings,
                cancelledBookings,
                utilizationRate: totalBookings > 0 ? ((totalBookings - cancelledBookings) / totalBookings * 100).toFixed(2) : 0
            },
            upcomingBookings
        });
    } catch (error) {
        console.error('Get resource stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
