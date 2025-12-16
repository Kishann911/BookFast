import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Calendar from '../components/Calendar';
import TimeSlotPicker from '../components/TimeSlotPicker';
import './NewBooking.css';

const NewBooking = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedResource, setSelectedResource] = useState('');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    // Fetch resources from API
    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/api/resources`);
                setResources(res.data);
            } catch (error) {
                console.error('Error fetching resources:', error);
                showToast('Failed to load resources', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);


    const timeSlots = [
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '10:00', endTime: '11:00' },
        { startTime: '11:00', endTime: '12:00' },
        { startTime: '12:00', endTime: '13:00' },
        { startTime: '13:00', endTime: '14:00' },
        { startTime: '14:00', endTime: '15:00' },
        { startTime: '15:00', endTime: '16:00' },
        { startTime: '16:00', endTime: '17:00' },
    ];

    const bookedSlots = [
        { startTime: '10:00', endTime: '11:00' },
        { startTime: '14:00', endTime: '15:00' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedResource || !selectedDate || !selectedSlot) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            // Format start and end times
            const startTime = new Date(selectedDate);
            const [startHour, startMinute] = selectedSlot.startTime.split(':');
            startTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

            const endTime = new Date(selectedDate);
            const [endHour, endMinute] = selectedSlot.endTime.split(':');
            endTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

            const bookingData = {
                resourceId: selectedResource,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                notes: ''
            };

            await axios.post(`${API_URL}/api/bookings`, bookingData);
            showToast('Booking created successfully!', 'success');
            setTimeout(() => {
                navigate('/my-bookings');
            }, 1500);
        } catch (error) {
            console.error('Error creating booking:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create booking';
            showToast(errorMessage, 'error');
        }
    };

    return (
        <div className="new-booking-page">
            <header className="page-header">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                    ← Back
                </Button>
                <div className="header-title">
                    <h1>New Booking</h1>
                    <p className="subtitle">Reserve a resource for your meeting or work session</p>
                </div>
            </header>

            <main className="booking-form-container">
                <form onSubmit={handleSubmit} className="booking-form">
                    {/* Resource Selection */}
                    <Card className="form-section">
                        <h3 className="form-section-title">Select Resource</h3>
                        {loading ? (
                            <div className="loading-state">
                                <p>Loading resources...</p>
                            </div>
                        ) : resources.length === 0 ? (
                            <div className="empty-state">
                                <p>No resources available. Please contact your administrator.</p>
                            </div>
                        ) : (
                            <div className="resource-grid">
                                {resources.map(resource => {
                                    const typeIcons = {
                                        room: '🚪',
                                        desk: '💼',
                                        office: '🏛️',
                                        equipment: '🔧',
                                        vehicle: '🚗',
                                        other: '🏢'
                                    };
                                    const icon = typeIcons[resource.type] || '🏢';

                                    return (
                                        <div
                                            key={resource._id}
                                            className={`resource-option ${selectedResource === resource._id ? 'selected' : ''}`}
                                            onClick={() => setSelectedResource(resource._id)}
                                        >
                                            <div className="resource-icon">{icon}</div>
                                            <div className="resource-info">
                                                <h4>{resource.name}</h4>
                                                <p>Capacity: {resource.capacity}</p>
                                                {resource.location && <p className="resource-location">📍 {resource.location}</p>}
                                            </div>
                                            {selectedResource === resource._id && (
                                                <div className="selected-indicator">✓</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>

                    {/* Date & Time Selection */}
                    {selectedResource && (
                        <Card className="form-section">
                            <h3 className="form-section-title">Select Date & Time</h3>
                            <div className="datetime-section">
                                <Calendar
                                    selectedDate={selectedDate}
                                    onDateSelect={setSelectedDate}
                                    bookedSlots={[]}
                                />

                                {selectedDate && (
                                    <TimeSlotPicker
                                        slots={timeSlots}
                                        selectedSlot={selectedSlot}
                                        onSlotSelect={setSelectedSlot}
                                        bookedSlots={bookedSlots}
                                    />
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Summary & Submit */}
                    {selectedResource && selectedDate && selectedSlot && (
                        <Card className="form-section">
                            <h3 className="form-section-title">Booking Summary</h3>
                            <div className="booking-summary">
                                <div className="summary-item">
                                    <span className="summary-label">Resource:</span>
                                    <span className="summary-value">
                                        {resources.find(r => r._id === selectedResource)?.name}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Date:</span>
                                    <span className="summary-value">
                                        {selectedDate.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Time:</span>
                                    <span className="summary-value">
                                        {selectedSlot.startTime} - {selectedSlot.endTime}
                                    </span>
                                </div>
                            </div>

                            <div className="form-actions">
                                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Confirm Booking
                                </Button>
                            </div>
                        </Card>
                    )}
                </form>
            </main>
        </div>
    );
};

export default NewBooking;
