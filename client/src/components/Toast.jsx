import { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible && duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">{icons[type]}</div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={onClose} aria-label="Close">
                ×
            </button>
        </div>
    );
};

export default Toast;
