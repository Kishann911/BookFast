// Tentative slot locks
// Map structure: resourceId -> Map(slotKey -> { userId, expiresAt })
const slotLocks = new Map();

// Auto-cleanup expired locks every 10 seconds (disable in tests to allow Jest to exit)
if (process.env.NODE_ENV !== 'test') {
    setInterval(() => {
        const now = Date.now();
        for (const [resourceId, slots] of slotLocks.entries()) {
            for (const [slotKey, lock] of slots.entries()) {
                if (lock.expiresAt < now) {
                    slots.delete(slotKey);
                }
            }
            if (slots.size === 0) {
                slotLocks.delete(resourceId);
            }
        }
    }, 10000);
}

const generateSlotKey = (startTime, endTime) => {
    return `${startTime}_${endTime}`;
};

export const setupSocketIO = (io) => {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Join a resource room to receive updates
        socket.on('join:resource', (resourceId) => {
            socket.join(`resource:${resourceId}`);
            console.log(`Socket ${socket.id} joined resource:${resourceId}`);
        });

        // Leave a resource room
        socket.on('leave:resource', (resourceId) => {
            socket.leave(`resource:${resourceId}`);
            console.log(`Socket ${socket.id} left resource:${resourceId}`);
        });

        // Tentatively lock a time slot (when user is selecting)
        socket.on('slot:lock', ({ resourceId, startTime, endTime, userId }) => {
            if (!slotLocks.has(resourceId)) {
                slotLocks.set(resourceId, new Map());
            }

            const slotKey = generateSlotKey(startTime, endTime);
            const resourceSlots = slotLocks.get(resourceId);

            // Lock expires in 30 seconds
            resourceSlots.set(slotKey, {
                userId,
                expiresAt: Date.now() + 30000
            });

            // Broadcast to all users viewing this resource
            io.to(`resource:${resourceId}`).emit('slot:locked', {
                resourceId,
                startTime,
                endTime,
                userId
            });

            console.log(`Slot locked: ${resourceId} - ${slotKey}`);
        });

        // Release a tentative lock
        socket.on('slot:unlock', ({ resourceId, startTime, endTime }) => {
            if (slotLocks.has(resourceId)) {
                const slotKey = generateSlotKey(startTime, endTime);
                const resourceSlots = slotLocks.get(resourceId);
                resourceSlots.delete(slotKey);

                io.to(`resource:${resourceId}`).emit('slot:unlocked', {
                    resourceId,
                    startTime,
                    endTime
                });

                console.log(`Slot unlocked: ${resourceId} - ${slotKey}`);
            }
        });

        // Broadcast new booking creation
        socket.on('booking:created', (booking) => {
            io.to(`resource:${booking.resourceId}`).emit('booking:created', booking);
            console.log(`Booking created broadcast: ${booking._id}`);
        });

        // Broadcast booking cancellation
        socket.on('booking:cancelled', (booking) => {
            io.to(`resource:${booking.resourceId}`).emit('booking:cancelled', booking);
            console.log(`Booking cancelled broadcast: ${booking._id}`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Export helper to broadcast from API routes
export const broadcastBookingCreated = (io, booking) => {
    io.to(`resource:${booking.resourceId}`).emit('booking:created', booking);
};

export const broadcastBookingCancelled = (io, booking) => {
    io.to(`resource:${booking.resourceId}`).emit('booking:cancelled', booking);
};
