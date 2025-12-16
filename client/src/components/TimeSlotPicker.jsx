import './TimeSlotPicker.css';

const TimeSlotPicker = ({ slots = [], selectedSlot, onSlotSelect, bookedSlots = [] }) => {
    const isSlotBooked = (slot) => {
        return bookedSlots.some(booked =>
            booked.startTime === slot.startTime && booked.endTime === slot.endTime
        );
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="time-slot-picker">
            <h4 className="time-slot-title">Select Time Slot</h4>
            <div className="time-slot-grid">
                {slots.map((slot, index) => {
                    const booked = isSlotBooked(slot);
                    const selected = selectedSlot?.startTime === slot.startTime &&
                        selectedSlot?.endTime === slot.endTime;

                    return (
                        <button
                            key={index}
                            className={`time-slot ${booked ? 'booked' : ''} ${selected ? 'selected' : ''
                                }`}
                            onClick={() => !booked && onSlotSelect(slot)}
                            disabled={booked}
                        >
                            <span className="slot-time">
                                {formatTime(slot.startTime)}
                            </span>
                            <span className="slot-separator">-</span>
                            <span className="slot-time">
                                {formatTime(slot.endTime)}
                            </span>
                            {booked && <span className="slot-status">Booked</span>}
                        </button>
                    );
                })}
            </div>
            {slots.length === 0 && (
                <p className="no-slots-message">
                    No time slots available for this date.
                </p>
            )}
        </div>
    );
};

export default TimeSlotPicker;
