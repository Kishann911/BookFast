import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import path from 'path';
import fs from 'fs/promises';

/**
 * Process and optimize images
 * @param {string} inputPath - Path to input image
 * @param {Object} options - Processing options
 * @returns {Promise<string>} - Path to processed image
 */
export const processImage = async (inputPath, options = {}) => {
    try {
        const {
            width = 1200,
            height = 800,
            quality = 85,
            format = 'jpeg',
            fit = 'cover'
        } = options;

        const outputPath = inputPath.replace(/\.[^/.]+$/, `_processed.${format}`);

        await sharp(inputPath)
            .resize(width, height, {
                fit,
                position: 'center',
                withoutEnlargement: true
            })
            .jpeg({ quality, progressive: true })
            .toFile(outputPath);

        console.log(`Image processed: ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error('Image processing error:', error);
        throw new Error('Failed to process image');
    }
};

/**
 * Extract text from image using OCR (Tesseract.js)
 * @param {string} imagePath - Path to image file
 * @param {string} lang - Language for OCR (default: 'eng')
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromImage = async (imagePath, lang = 'eng') => {
    let worker = null;

    try {
        console.log('Starting OCR processing for:', imagePath);

        // Create a Tesseract worker
        worker = await createWorker(lang);

        // Perform OCR
        const { data: { text, confidence } } = await worker.recognize(imagePath);

        console.log(`OCR completed with confidence: ${confidence}%`);
        console.log(`Extracted text: ${text.substring(0, 100)}...`);

        await worker.terminate();

        return text.trim();
    } catch (error) {
        if (worker) {
            await worker.terminate();
        }
        console.error('OCR error:', error);
        throw new Error('Failed to extract text from image');
    }
};

/**
 * Create thumbnail from image
 * @param {string} inputPath - Path to input image
 * @param {number} size - Thumbnail size (width/height)
 * @returns {Promise<string>} - Path to thumbnail
 */
export const createThumbnail = async (inputPath, size = 200) => {
    try {
        const outputPath = inputPath.replace(/\.[^/.]+$/, '_thumb.jpg');

        await sharp(inputPath)
            .resize(size, size, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        console.log(`Thumbnail created: ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error('Thumbnail creation error:', error);
        throw new Error('Failed to create thumbnail');
    }
};

/**
 * Validate image file
 * @param {Object} file - Multer file object
 * @returns {Promise<boolean>} - Whether file is valid
 */
export const validateImage = async (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    if (file.size > maxSize) {
        throw new Error('File size exceeds 5MB limit.');
    }

    return true;
};

/**
 * Delete image file
 * @param {string} imagePath - Path to image
 */
export const deleteImage = async (imagePath) => {
    try {
        const fullPath = path.join(process.cwd(), 'uploads', imagePath);
        await fs.unlink(fullPath);
        console.log(`Image deleted: ${fullPath}`);
    } catch (error) {
        console.error('Error deleting image:', error);
        // Don't throw - deletion failure shouldn't break the app
    }
};

/**
 * Convert image to different format
 * @param {string} inputPath - Path to input image
 * @param {string} format - Output format (jpeg, png, webp)
 * @returns {Promise<string>} - Path to converted image
 */
export const convertImageFormat = async (inputPath, format = 'webp') => {
    try {
        const outputPath = inputPath.replace(/\.[^/.]+$/, `.${format}`);

        const sharpInstance = sharp(inputPath);

        switch (format) {
            case 'jpeg':
            case 'jpg':
                await sharpInstance.jpeg({ quality: 90 }).toFile(outputPath);
                break;
            case 'png':
                await sharpInstance.png({ compressionLevel: 9 }).toFile(outputPath);
                break;
            case 'webp':
                await sharpInstance.webp({ quality: 90 }).toFile(outputPath);
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }

        console.log(`Image converted to ${format}: ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error('Format conversion error:', error);
        throw new Error('Failed to convert image format');
    }
};

/**
 * Get image metadata
 * @param {string} imagePath - Path to image
 * @returns {Promise<Object>} - Image metadata
 */
export const getImageMetadata = async (imagePath) => {
    try {
        const metadata = await sharp(imagePath).metadata();
        return {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: metadata.size,
            space: metadata.space,
            channels: metadata.channels,
            hasAlpha: metadata.hasAlpha
        };
    } catch (error) {
        console.error('Metadata extraction error:', error);
        throw new Error('Failed to get image metadata');
    }
};

/**
 * Batch process multiple images
 * @param {Array} imagePaths - Array of image paths
 * @param {Object} options - Processing options
 * @returns {Promise<Array>} - Array of processed image paths
 */
export const batchProcessImages = async (imagePaths, options = {}) => {
    try {
        const results = await Promise.all(
            imagePaths.map(imagePath => processImage(imagePath, options))
        );
        return results;
    } catch (error) {
        console.error('Batch processing error:', error);
        throw new Error('Failed to batch process images');
    }
};

/**
 * Apply watermark to image
 * @param {string} inputPath - Path to input image
 * @param {string} watermarkPath - Path to watermark image
 * @returns {Promise<string>} - Path to watermarked image
 */
export const applyWatermark = async (inputPath, watermarkPath) => {
    try {
        const outputPath = inputPath.replace(/\.[^/.]+$/, '_watermarked.jpg');

        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Resize watermark to 20% of image width
        const watermarkWidth = Math.floor(metadata.width * 0.2);

        const watermark = await sharp(watermarkPath)
            .resize(watermarkWidth)
            .toBuffer();

        await image
            .composite([{
                input: watermark,
                gravity: 'southeast'
            }])
            .jpeg({ quality: 90 })
            .toFile(outputPath);

        console.log(`Watermark applied: ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error('Watermark error:', error);
        throw new Error('Failed to apply watermark');
    }
};

export default {
    processImage,
    extractTextFromImage,
    createThumbnail,
    validateImage,
    deleteImage,
    convertImageFormat,
    getImageMetadata,
    batchProcessImages,
    applyWatermark
};
