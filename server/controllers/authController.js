import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            // Send welcome email
            try {
                await sendEmail({
                    to: user.email,
                    subject: 'Welcome to BookFast!',
                    template: 'welcome',
                    data: { name: user.name }
                });
            } catch (error) {
                console.error('Welcome email failed:', error);
                // Continue even if email fails
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            // Handle file upload if present
            if (req.file) {
                user.profileImage = `/uploads/profiles/${req.file.filename}`;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get reset token logic here manually since it's not in the model
        // Generate and hash password token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                template: 'passwordReset',
                data: {
                    name: user.name,
                    resetUrl
                }
            });

            res.status(200).json({ message: 'Email sent' });
        } catch (error) {
            console.error(error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            data: 'Password updated success',
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
