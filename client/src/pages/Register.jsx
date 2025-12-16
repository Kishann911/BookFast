import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { MoreVertical } from 'lucide-react';
import SideMenu from '../components/SideMenu';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-menu-trigger">
                <MoreVertical
                    size={28}
                    className="hero-menu-icon"
                    onClick={() => setIsMenuOpen(true)}
                />
            </div>
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Left Panel - Form Section */}
            <div className="auth-left-panel">
                <div className="auth-content">
                    <div className="auth-header">
                        <h1 className="auth-logo" onClick={() => navigate('/')}>
                            BookFast
                        </h1>
                        <p className="auth-tagline">If it's booked, you know it. Instantly.</p>
                    </div>

                    <Card className="auth-card">
                        <h2 className="auth-title">Create Account</h2>
                        <p className="auth-subtitle">Start booking without conflicts</p>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <Input
                                label="Full Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="At least 6 characters"
                                required
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repeat your password"
                                required
                            />

                            <Button
                                type="submit"
                                size="lg"
                                disabled={loading}
                                className="auth-submit"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        <p className="auth-footer">
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Sign in
                            </Link>
                        </p>
                    </Card>
                </div>
            </div>

            {/* Right Panel - Illustration Section */}
            <div className="auth-right-panel">
                <div className="auth-illustration">
                    <img
                        src="/assets/image.png"
                        alt="Computer illustration"
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;
