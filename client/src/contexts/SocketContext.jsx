import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(SOCKET_URL, {
            transports: ['polling', 'websocket'], // Try polling first for better firewall traversing
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            withCredentials: true,
            path: '/socket.io/'
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket.IO connected');
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Socket.IO disconnected');
            setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.close();
        };
    }, []);

    const joinResource = (resourceId) => {
        if (socket) {
            socket.emit('join:resource', resourceId);
            console.log(`Joined resource room: ${resourceId}`);
        }
    };

    const leaveResource = (resourceId) => {
        if (socket) {
            socket.emit('leave:resource', resourceId);
            console.log(`Left resource room: ${resourceId}`);
        }
    };

    const lockSlot = (resourceId, startTime, endTime, userId) => {
        if (socket) {
            socket.emit('slot:lock', { resourceId, startTime, endTime, userId });
        }
    };

    const unlockSlot = (resourceId, startTime, endTime) => {
        if (socket) {
            socket.emit('slot:unlock', { resourceId, startTime, endTime });
        }
    };

    const broadcastBookingCreated = (booking) => {
        if (socket) {
            socket.emit('booking:created', booking);
        }
    };

    const broadcastBookingCancelled = (booking) => {
        if (socket) {
            socket.emit('booking:cancelled', booking);
        }
    };

    const value = {
        socket,
        connected,
        joinResource,
        leaveResource,
        lockSlot,
        unlockSlot,
        broadcastBookingCreated,
        broadcastBookingCancelled
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
