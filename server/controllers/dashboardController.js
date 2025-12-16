import Booking from '../models/Booking.js';
import Resource from '../models/Resource.js';
import User from '../models/User.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();

        // Booking Statistics
        const totalBookings = await Booking.countDocuments();
        const activeBookings = await Booking.countDocuments({
            status: 'confirmed',
            startTime: { $lte: now },
            endTime: { $gte: now }
        });
        const upcomingBookings = await Booking.countDocuments({
            status: 'confirmed',
            startTime: { $gt: now }
        });
        const cancelledBookings = await Booking.countDocuments({
            status: 'cancelled'
        });

        // Resource Statistics
        const totalResources = await Resource.countDocuments({ isActive: true });

        // Resources by status (calculate dynamically)
        const resources = await Resource.find({ isActive: true });
        const resourcesByStatus = {
            available: 0,
            occupied: 0,
            maintenance: 0
        };

        for (const resource of resources) {
            const status = await resource.getCurrentStatus();
            if (resourcesByStatus[status] !== undefined) {
                resourcesByStatus[status]++;
            }
        }

        // Resources by type
        const resourcesByType = await Resource.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        // Most booked resources (top 5)
        const topResources = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: '$resourceId', bookingCount: { $sum: 1 } } },
            { $sort: { bookingCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'resources',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            { $unwind: '$resource' },
            {
                $project: {
                    name: '$resource.name',
                    type: '$resource.type',
                    bookingCount: 1
                }
            }
        ]);

        // Recent Activity (last 10 bookings)
        const recentActivity = await Booking.find()
            .populate('resourceId', 'name type')
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .limit(10)
            .select('resourceId userId status startTime endTime createdAt');

        // Booking trends (last 7 days)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const bookingTrends = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    status: 'confirmed'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // User statistics (if admin)
        let userStats = null;
        if (req.user.role === 'admin') {
            const totalUsers = await User.countDocuments();
            const recentUsers = await User.countDocuments({
                createdAt: { $gte: sevenDaysAgo }
            });
            userStats = {
                total: totalUsers,
                recentRegistrations: recentUsers
            };
        }

        // Compile response
        const stats = {
            bookings: {
                total: totalBookings,
                active: activeBookings,
                upcoming: upcomingBookings,
                cancelled: cancelledBookings
            },
            resources: {
                total: totalResources,
                byStatus: resourcesByStatus,
                byType: resourcesByType.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                topResources
            },
            recentActivity,
            bookingTrends,
            users: userStats
        };

        res.json(stats);
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
