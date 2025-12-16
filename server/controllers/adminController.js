import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Resource from '../models/Resource.js';

// @desc    Get dashboard statistics (Admin)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalResources,
            totalBookings,
            activeBookings,
            cancelledBookings,
            recentBookings,
            resourceUtilization
        ] = await Promise.all([
            User.countDocuments(),
            Resource.countDocuments({ isActive: true }),
            Booking.countDocuments(),
            Booking.countDocuments({
                status: 'confirmed',
                endTime: { $gte: new Date() }
            }),
            Booking.countDocuments({ status: 'cancelled' }),
            Booking.find()
                .populate('userId', 'name email')
                .populate('resourceId', 'name type')
                .sort({ createdAt: -1 })
                .limit(10),
            Resource.aggregate([
                {
                    $lookup: {
                        from: 'bookings',
                        localField: '_id',
                        foreignField: 'resourceId',
                        as: 'bookings'
                    }
                },
                {
                    $project: {
                        name: 1,
                        type: 1,
                        bookingCount: { $size: '$bookings' }
                    }
                },
                { $sort: { bookingCount: -1 } },
                { $limit: 5 }
            ])
        ]);

        res.json({
            overview: {
                totalUsers,
                totalResources,
                totalBookings,
                activeBookings,
                cancelledBookings,
                cancellationRate: totalBookings > 0
                    ? ((cancelledBookings / totalBookings) * 100).toFixed(2)
                    : 0
            },
            recentBookings,
            topResources: resourceUtilization
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;

        const query = {};

        if (role) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password -resetPasswordToken -resetPasswordExpire')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user role (Admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from demoting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot change your own role' });
        }

        user.role = role;
        await user.save();

        res.json({
            message: `User role updated to ${role}`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        // Cancel all user's active bookings
        await Booking.updateMany(
            {
                userId: user._id,
                status: 'confirmed',
                endTime: { $gte: new Date() }
            },
            { status: 'cancelled' }
        );

        await user.deleteOne();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get booking analytics (Admin)
// @route   GET /api/admin/analytics/bookings
// @access  Private/Admin
export const getBookingAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const matchStage = {};
        if (startDate && endDate) {
            matchStage.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const [
            bookingsByStatus,
            bookingsByResource,
            bookingsByDay,
            bookingsByHour
        ] = await Promise.all([
            // Bookings by status
            Booking.aggregate([
                ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Bookings by resource type
            Booking.aggregate([
                ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
                {
                    $lookup: {
                        from: 'resources',
                        localField: 'resourceId',
                        foreignField: '_id',
                        as: 'resource'
                    }
                },
                { $unwind: '$resource' },
                {
                    $group: {
                        _id: '$resource.type',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Bookings by day of week
            Booking.aggregate([
                ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
                {
                    $group: {
                        _id: { $dayOfWeek: '$startTime' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),

            // Bookings by hour
            Booking.aggregate([
                ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
                {
                    $group: {
                        _id: { $hour: '$startTime' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        res.json({
            bookingsByStatus,
            bookingsByResource,
            bookingsByDay: bookingsByDay.map(item => ({
                day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][item._id - 1],
                count: item.count
            })),
            bookingsByHour
        });
    } catch (error) {
        console.error('Get booking analytics error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Export data (Admin)
// @route   GET /api/admin/export/:type
// @access  Private/Admin
export const exportData = async (req, res) => {
    try {
        const { type } = req.params;
        let data;

        switch (type) {
            case 'users':
                data = await User.find().select('-password -resetPasswordToken -resetPasswordExpire');
                break;
            case 'resources':
                data = await Resource.find();
                break;
            case 'bookings':
                data = await Booking.find()
                    .populate('userId', 'name email')
                    .populate('resourceId', 'name type');
                break;
            default:
                return res.status(400).json({ message: 'Invalid export type' });
        }

        res.json({
            type,
            count: data.length,
            exportDate: new Date().toISOString(),
            data
        });
    } catch (error) {
        console.error('Export data error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export default {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getBookingAnalytics,
    exportData
};
