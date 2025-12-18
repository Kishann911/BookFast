// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import { setupSocketIO } from './socket/socketHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import resourceRoutes from './routes/resources.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import dashboardRoutes from './routes/dashboard.js';

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

// Setup Socket.IO handlers
setupSocketIO(io);

// Make io accessible to routes
app.set('io', io);

// Initialize Socket.IO in booking controller for real-time updates
import { initializeSocketIO } from './controllers/bookingController.js';
initializeSocketIO(io);

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'BookFast API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'BookFast API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            resources: '/api/resources',
            bookings: '/api/bookings',
            admin: '/api/admin',
            dashboard: '/api/dashboard',
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'test') {
    httpServer.listen(PORT, () => {
        console.log(`\n🚀 BookFast Server running on port ${PORT}`);
        console.log(`📡 Socket.IO ready for real-time connections`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Allowed CORS Origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
        console.log(`\nAPI Endpoints:`);
        console.log(`  - http://localhost:${PORT}/api/auth`);
        console.log(`  - http://localhost:${PORT}/api/resources`);
        console.log(`  - http://localhost:${PORT}/api/bookings\n`);
    });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    httpServer.close(() => process.exit(1));
});

export default app;
