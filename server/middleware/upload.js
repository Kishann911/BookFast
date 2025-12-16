import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const ensureUploadDirs = () => {
    const dirs = [
        './uploads',
        './uploads/profiles',
        './uploads/resources',
        './uploads/temp'
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    });
};

// Initialize directories
ensureUploadDirs();

// Configure storage for different upload types
const createStorage = (destination) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            // Generate unique filename: timestamp-randomstring-originalname
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            const nameWithoutExt = path.basename(file.originalname, ext);
            cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
        }
    });
};

// File filter for images only
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF, WebP)'));
    }
};

// File filter for documents
const documentFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only document files are allowed (PDF, DOC, DOCX, TXT)'));
    }
};

// Multer upload configurations
export const uploadProfileImage = multer({
    storage: createStorage('./uploads/profiles'),
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('profileImage');

export const uploadResourceImages = multer({
    storage: createStorage('./uploads/resources'),
    fileFilter: imageFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 10 // Max 10 files
    }
}).array('images', 10);

export const uploadSingleResourceImage = multer({
    storage: createStorage('./uploads/resources'),
    fileFilter: imageFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
}).single('image');

export const uploadDocument = multer({
    storage: createStorage('./uploads/temp'),
    fileFilter: documentFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit for documents
    }
}).single('document');

// Generic upload for any file type (use with caution)
export const uploadAny = multer({
    storage: createStorage('./uploads/temp'),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
}).any();

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File size too large',
                details: err.message
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                message: 'Too many files uploaded',
                details: err.message
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                message: 'Unexpected file field',
                details: err.message
            });
        }
        return res.status(400).json({
            message: 'File upload error',
            details: err.message
        });
    } else if (err) {
        // Other errors (e.g., from file filter)
        return res.status(400).json({
            message: err.message || 'File upload failed'
        });
    }
    next();
};

export default {
    uploadProfileImage,
    uploadResourceImages,
    uploadSingleResourceImage,
    uploadDocument,
    uploadAny,
    handleUploadError
};
