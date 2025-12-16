import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import './SideMenu.css';

const SideMenu = ({ isOpen, onClose }) => {
    const menuRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <div className={`side-menu-overlay ${isOpen ? 'open' : ''}`}>
            <div className="side-menu-panel" ref={menuRef}>
                <button className="side-menu-close" onClick={onClose} aria-label="Close Menu">
                    <X size={24} color="#1a1a1a" />
                </button>

                <nav className="side-menu-nav">
                    <ul>
                        <li><Link to="/" onClick={onClose}>HOME</Link></li>
                        <li><Link to="/about" onClick={onClose}>ABOUT</Link></li>
                        <li><Link to="/contact" onClick={onClose}>CONTACT</Link></li>
                        <li><Link to="/journey" onClick={onClose}>JOURNAL</Link></li>
                    </ul>
                </nav>

                <div className="side-menu-footer">
                    <a href="#" className="social-link">LINKEDIN</a>
                    <a href="#" className="social-link">TWITTER</a>
                    <a href="#" className="social-link">INSTAGRAM</a>
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
