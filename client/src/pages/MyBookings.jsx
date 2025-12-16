import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import './MyBookings.css';

const MyBookings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/bookings`);
            setBookings(res.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            showToast('Failed to load bookings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const hours = Math.abs(end - start) / 1000 / 60 / 60;
        return hours.toFixed(1);
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'tentative': return 'warning';
            case 'completed': return 'default';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const handleCancelBooking = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        if (selectedBooking) {
            try {
                await axios.delete(`${API_URL}/api/bookings/${selectedBooking._id}`);
                showToast('Booking cancelled successfully', 'success');
                setShowCancelModal(false);
                setSelectedBooking(null);
                // Refresh bookings list
                fetchBookings();
            } catch (error) {
                console.error('Error cancelling booking:', error);
                showToast('Failed to cancel booking', 'error');
            }
        }
    };

    // Determine booking status based on dates
    const getBookingStatus = (booking) => {
        const now = new Date();
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);

        if (booking.status === 'cancelled') {
            return 'cancelled';
        } else if (end < now) {
            return 'completed';
        } else if (start <= now && end >= now) {
            return 'active';
        } else {
            return booking.status; // confirmed or tentative
        }
    };

    const activeBookings = bookings.filter(b => {
        const status = getBookingStatus(b);
        return status === 'confirmed' || status === 'tentative' || status === 'active';
    });

    const pastBookings = bookings.filter(b => {
        const status = getBookingStatus(b);
        return status === 'completed' || status === 'cancelled';
    });

    if (loading) {
        return (
            <div className="my-bookings-page">
                <div className="loading-container">
                    <p>Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-bookings-page">
            <header className="page-header">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </Button>
                <div className="header-title">
                    <h1>My Bookings</h1>
                    <p className="subtitle">Manage your resource reservations</p>
                </div>
                <div className="header-actions">
                    <Button onClick={() => navigate('/bookings/new')}>
                        + New Booking
                    </Button>
                </div>
            </header>

            <main className="bookings-content">
                {/* Active Bookings Section */}
                <section className="bookings-section">
                    <div className="section-header">
                        <h2>Active Bookings</h2>
                        <Badge>{activeBookings.length}</Badge>
                    </div>

                    {activeBookings.length === 0 ? (
                        <Card className="empty-state">
                            <div className="empty-icon">📅</div>
                            <h3>No active bookings</h3>
                            <p>You don't have any upcoming reservations.</p>
                            <Button onClick={() => navigate('/bookings/new')}>
                                Create New Booking
                            </Button>
                        </Card>
                    ) : (
                        <div className="bookings-grid">
                            {activeBookings.map(booking => (
                                <Card key={booking._id} className="booking-card">
                                    <div className="booking-header">
                                        <h3>{booking.resourceId?.name || 'Unknown Resource'}</h3>
                                        <Badge variant={getStatusVariant(getBookingStatus(booking))}>
                                            {getBookingStatus(booking)}
                                        </Badge>
                                    </div>

                                    <div className="booking-details">
                                        <div className="detail-row">
                                            <span className="detail-icon">📅</span>
                                            <span className="detail-label">Date:</span>
                                            <span className="detail-value">
                                                {formatDate(booking.startTime)}
                                            </span>
                                        </div>

                                        <div className="detail-row">
                                            <span className="detail-icon">🕐</span>
                                            <span className="detail-label">Time:</span>
                                            <span className="detail-value">
                                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                            </span>
                                        </div>

                                        <div className="detail-row">
                                            <span className="detail-icon">⏱️</span>
                                            <span className="detail-label">Duration:</span>
                                            <span className="detail-value">
                                                {calculateDuration(booking.startTime, booking.endTime)} hours
                                            </span>
                                        </div>

                                        {booking.resourceId?.type && (
                                            <div className="detail-row">
                                                <span className="detail-icon">🏢</span>
                                                <span className="detail-label">Type:</span>
                                                <span className="detail-value">
                                                    {booking.resourceId.type}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="booking-actions">
                                        <Button
                                            variant="outline"
                                            size="small"
                                            onClick={() => navigate(`/bookings/${booking._id}`)}
                                        >
                                            View Details
                                        </Button>
                                        {getBookingStatus(booking) !== 'cancelled' && (
                                            <Button
                                                variant="ghost"
                                                size="small"
                                                onClick={() => handleCancelBooking(booking)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                {/* Past Bookings Section */}
                <section className="bookings-section">
                    <div className="section-header">
                        <h2>Past Bookings</h2>
                        <Badge>{pastBookings.length}</Badge>
                    </div>

                    {pastBookings.length === 0 ? (
                        <Card className="empty-state-minimal">
                            <p>No past bookings to display.</p>
                        </Card>
                    ) : (
                        <div className="bookings-list">
                            {pastBookings.map(booking => (
                                <Card key={booking._id} className="booking-list-item">
                                    <div className="list-item-content">
                                        <div className="list-item-main">
                                            <h4>{booking.resourceId?.name || 'Unknown Resource'}</h4>
                                            <p>{formatDate(booking.startTime)} • {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                                        </div>
                                        <Badge variant={getStatusVariant(getBookingStatus(booking))}>
                                            {getBookingStatus(booking)}
                                        </Badge>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Cancel Confirmation Modal */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                title="Cancel Booking"
                footer={
                    <div className="modal-footer-actions">
                        <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
                            Keep Booking
                        </Button>
                        <Button variant="primary" onClick={confirmCancel}>
                            Confirm Cancel
                        </Button>
                    </div>
                }
            >
                <p>Are you sure you want to cancel this booking?</p>
                {selectedBooking && (
                    <div className="cancel-booking-details">
                        <strong>{selectedBooking.resourceId?.name || 'Unknown Resource'}</strong>
                        <p>{formatDate(selectedBooking.startTime)}</p>
                        <p>{formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}</p>
                    </div>
                )}
                <p className="warning-text">This action cannot be undone.</p>
            </Modal>
        </div>
    );
};

export default MyBookings;
