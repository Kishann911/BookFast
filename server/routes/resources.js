import express from 'express';
import {
    getResources,
    getAllResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
    uploadResourceImage,
    removeResourceImage,
    getResourceStats
} from '../controllers/resourceController.js';
import { protect, admin } from '../middleware/auth.js';
import {
    uploadResourceImages,
    uploadSingleResourceImage,
    handleUploadError
} from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/resources
// @desc    Get all active resources (with filtering)
// @access  Public
router.get('/', getResources);

// @route   GET /api/resources/all
// @desc    Get all resources including inactive (Admin)
// @access  Private/Admin
router.get('/all', protect, admin, getAllResources);

// @route   GET /api/resources/:id
// @desc    Get single resource
// @access  Public
router.get('/:id', getResource);

// @route   GET /api/resources/:id/stats
// @desc    Get resource statistics (Admin)
// @access  Private/Admin
router.get('/:id/stats', protect, admin, getResourceStats);

// @route   POST /api/resources
// @desc    Create a new resource (with image upload)
// @access  Private/Admin
router.post('/', protect, admin, uploadResourceImages, handleUploadError, createResource);

// @route   POST /api/resources/:id/upload-image
// @desc    Upload and process resource image with optional OCR
// @access  Private/Admin
router.post('/:id/upload-image', protect, admin, uploadSingleResourceImage, handleUploadError, uploadResourceImage);

// @route   PUT /api/resources/:id
// @desc    Update a resource
// @access  Private/Admin
router.put('/:id', protect, admin, uploadResourceImages, handleUploadError, updateResource);

// @route   DELETE /api/resources/:id/images
// @desc    Remove image from resource
// @access  Private/Admin
router.delete('/:id/images', protect, admin, removeResourceImage);

// @route   DELETE /api/resources/:id
// @desc    Soft delete a resource (set isActive to false)
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteResource);

export default router;
