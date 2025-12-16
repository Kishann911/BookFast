import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="error-animation">
                    <div className="error-number">4</div>
                    <div className="error-icon">🔥</div>
                    <div className="error-number">4</div>
                </div>

                <h1 className="error-title">Page Not Found</h1>
                <p className="error-message">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="error-actions">
                    <Button onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </div>

                <div className="helpful-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li>
                            <button onClick={() => navigate('/')}>
                                🏠 Home
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/bookings/new')}>
                                📅 New Booking
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/my-bookings')}>
                                📋 My Bookings
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/settings')}>
                                ⚙️ Settings
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Animated background elements */}
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>
            <div className="bg-orb orb-3"></div>
        </div>
    );
};

export default NotFound;
