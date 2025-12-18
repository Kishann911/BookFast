import { jest } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Mock email utility using ESM-compliant mocking
// This must correspond to the path imported in your controllers
await jest.unstable_mockModule('../utils/email.js', () => ({
    sendEmail: jest.fn().mockResolvedValue({ messageId: 'mock-email-id' }),
    sendCustomEmail: jest.fn().mockResolvedValue({ messageId: 'mock-email-id' })
}));

// Dynamic imports must be used after unstable_mockModule
const { default: request } = await import('supertest');
const { default: app } = await import('../server.js');
const { default: User } = await import('../models/User.js');
const { default: Resource } = await import('../models/Resource.js');

let mongoServer;
let adminToken;
let userToken;
let userId;
let resourceId;

beforeAll(async () => {
    // Disconnect from any existing connection
    await mongoose.disconnect();

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('API Endpoints Testing', () => {

    // Auth Routes
    describe('Auth Routes', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            userToken = res.body.token;
            userId = res.body._id;
        });

        it('should login user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should get current user profile', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual('test@example.com');
        });
    });

    // Setup Admin for Admin Routes
    describe('Admin Setup', () => {
        it('should create an admin user directly', async () => {
            const admin = await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(200);
            adminToken = res.body.token;
        });
    });

    // Resource Routes
    describe('Resource Routes', () => {
        it('should get all resources (public)', async () => {
            const res = await request(app).get('/api/resources');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
        });

        it('should create a resource (admin only)', async () => {
            const res = await request(app)
                .post('/api/resources')
                .set('Authorization', `Bearer ${adminToken}`)
                .field('name', 'Test Resource')
                .field('type', 'room') // Lowercase enum
                .field('capacity', 10)
                .field('location', 'Room 101')
                .field('description', 'A test resource');

            if (res.statusCode !== 201) {
                console.log('Create Resource Error:', res.body);
            }

            expect(res.statusCode).toEqual(201);
            resourceId = res.body._id;
            expect(res.body.name).toBe('Test Resource');
        });
    });

    // Booking Routes
    describe('Booking Routes', () => {
        it('should create a booking', async () => {
            if (!resourceId) {
                const resource = await Resource.create({
                    name: 'Fallback Resource',
                    type: 'room',
                    capacity: 5,
                    location: 'B1',
                    description: 'Fallback'
                });
                resourceId = resource._id;
            }

            const startTime = new Date();
            startTime.setHours(startTime.getHours() + 24);
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1);

            const res = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    resourceId: resourceId,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    title: 'Test Meeting',
                    notes: 'Testing booking flow'
                });

            if (res.statusCode !== 201) {
                console.log('Create Booking Error:', res.body);
            }

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            // Check nested populated fields if available, otherwise just ID check is fine
        });

        it('should get user bookings', async () => {
            const res = await request(app)
                .get('/api/bookings')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    // Dashboard Routes
    describe('Dashboard Routes', () => {
        it('should get dashboard stats', async () => {
            const res = await request(app)
                .get('/api/dashboard/stats')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('bookings');
            expect(res.body).toHaveProperty('resources');
        });
    });

    // Admin Routes
    describe('Admin Analytics', () => {
        it('should get admin stats', async () => {
            const res = await request(app)
                .get('/api/admin/stats')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('overview');
        });
    });
});
