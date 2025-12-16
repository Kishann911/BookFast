import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'info'
    });

    const showToast = (message, type = 'info', duration = 3000) => {
        setToast({
            isVisible: true,
            message,
            type,
            duration
        });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, isVisible: false }));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
                duration={toast.duration}
            />
        </ToastContext.Provider>
    );
};
