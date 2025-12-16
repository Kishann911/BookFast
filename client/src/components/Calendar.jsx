import { useState, useMemo } from 'react';
import './Calendar.css';

const Calendar = ({ onDateSelect, selectedDate, bookedSlots = [], availableSlots = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysArray = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay.getDay(); i++) {
            daysArray.push(null);
        }

        // Add all days in month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            daysArray.push(new Date(year, month, day));
        }

        return daysArray;
    }, [currentMonth]);

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const isPast = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const hasBookings = (date) => {
        if (!date) return false;
        return bookedSlots.some(slot =>
            new Date(slot.date).toDateString() === date.toDateString()
        );
    };

    const handleDateClick = (date) => {
        if (!isPast(date)) {
            onDateSelect(date);
        }
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button
                    className="calendar-nav"
                    onClick={goToPreviousMonth}
                    aria-label="Previous month"
                >
                    ‹
                </button>
                <h3 className="calendar-title">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                    className="calendar-nav"
                    onClick={goToNextMonth}
                    aria-label="Next month"
                >
                    ›
                </button>
            </div>

            <div className="calendar-weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-weekday">{day}</div>
                ))}
            </div>

            <div className="calendar-days">
                {daysInMonth.map((date, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''
                            } ${isSelected(date) ? 'selected' : ''} ${isPast(date) ? 'past' : ''
                            } ${hasBookings(date) ? 'has-bookings' : ''}`}
                        onClick={() => date && handleDateClick(date)}
                    >
                        {date && (
                            <>
                                <span className="day-number">{date.getDate()}</span>
                                {hasBookings(date) && <span className="booking-indicator"></span>}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
