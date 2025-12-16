import { useEffect } from 'react';
import './Modal.css';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    className = ''
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal modal-${size} ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    {title && <h3 className="modal-title">{title}</h3>}
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                </div>
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;
