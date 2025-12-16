import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import {
    MoreVertical,
    Zap,
    ShieldCheck,
    Database,
    Rocket,
    Building2,
    Factory,
    GraduationCap,
    Stethoscope,
    User,
    Check,
    Loader2,
    X,
    Star,
    ArrowRight
} from 'lucide-react';
import SideMenu from '../components/SideMenu';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const [demoSlots, setDemoSlots] = useState([
        { id: 1, time: '10:00 AM', status: 'available' },
        { id: 2, time: '11:00 AM', status: 'available' },
        { id: 3, time: '12:00 PM', status: 'available' },
        { id: 4, time: '1:00 PM', status: 'available' }
    ]);
    const [userActions, setUserActions] = useState({ user1: null, user2: null });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Live conflict demo animation
    useEffect(() => {
        const runDemo = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // User 1 hovers over slot 2
            setUserActions({ user1: 'hovering', user2: null });
            await new Promise(resolve => setTimeout(resolve, 1000));

            // User 2 also hovers over slot 2
            setUserActions({ user1: 'hovering', user2: 'hovering' });
            await new Promise(resolve => setTimeout(resolve, 1500));

            // User 1 clicks first - locks the slot
            setDemoSlots(prev => prev.map(slot =>
                slot.id === 2 ? { ...slot, status: 'tentative' } : slot
            ));
            setUserActions({ user1: 'booking', user2: 'hovering' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            // User 1 confirms - slot becomes booked
            setDemoSlots(prev => prev.map(slot =>
                slot.id === 2 ? { ...slot, status: 'booked' } : slot
            ));
            setUserActions({ user1: 'confirmed', user2: 'blocked' });
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Reset demo
            setDemoSlots(prev => prev.map(slot => ({ ...slot, status: 'available' })));
            setUserActions({ user1: null, user2: null });
        };

        const interval = setInterval(runDemo, 10000);
        runDemo(); // Run immediately

        return () => clearInterval(interval);
    }, []);

    const getSlotClassName = (status) => {
        return `demo-slot demo-slot-${status}`;
    };

    return (
        <div className="landing">
            {/* Hero Section */}
            <section className="hero-new">
                {/* Top Right Menu Icon */}
                <div className="hero-menu-container">
                    <MoreVertical
                        className="hero-menu-icon"
                        onClick={() => setIsMenuOpen(true)}
                    />
                </div>

                <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                {/* Top Banner */}
                <div className="hero-banner" onClick={() => navigate('/login')}>
                    <p className="banner-text">
                        BOOKFAST IS NOW LIVE. START BOOKING WITHOUT CONFLICTS
                        <ArrowRight size={16} className="banner-arrow-icon" />
                    </p>
                </div>

                {/* Giant background word */}
                <div className="hero-giant-text">BOOKFAST</div>

                {/* Bottom left text block */}
                <div className="hero-text-left">
                    <p className="hero-description">
                        THE REAL-TIME BOOKING PLATFORM THAT<br />
                        ELIMINATES CONFLICTS BEFORE THEY HAPPEN.<br />
                        STARTING WITH YOUR TEAM.
                    </p>
                </div>

                {/* Bottom right text block */}
                <div className="hero-text-right">
                    <p className="hero-tagline-right">
                        LIGHTNING-FAST<br />
                        EXPERIENCES FOR<br />
                        AMBITIOUS TEAMS
                    </p>
                </div>

                {/* Footer corners */}
                <div className="hero-footer-left">
                    CONTACT : INFO@BOOKFAST
                </div>
                <div className="hero-footer-right">
                    MUMBAI : {new Date().toLocaleTimeString('en-US', { hour12: false })}
                </div>
            </section>

            {/* Live Conflict Demo */}
            <section className="demo-section">
                <div className="container">
                    <h2 className="section-title">See It In Action</h2>
                    <p className="section-subtitle">
                        Watch how BookFast prevents conflicts in real-time
                    </p>

                    <div className="demo-container">
                        <div className="demo-users">
                            <div className={`demo-user user-1 ${userActions.user1 ? 'active' : ''}`}>
                                <div className="user-avatar">
                                    <User size={40} color="#F5F1E8" />
                                </div>
                                <span className="user-name">User 1</span>
                                {userActions.user1 && (
                                    <span className="user-status">{userActions.user1}</span>
                                )}
                            </div>
                            <div className={`demo-user user-2 ${userActions.user2 ? 'active' : ''}`}>
                                <div className="user-avatar">
                                    <User size={40} color="#F5F1E8" />
                                </div>
                                <span className="user-name">User 2</span>
                                {userActions.user2 && (
                                    <span className="user-status">{userActions.user2}</span>
                                )}
                            </div>
                        </div>

                        <Card className="demo-calendar">
                            <h3 className="demo-calendar-title">Conference Room A</h3>
                            <div className="demo-slots">
                                {demoSlots.map(slot => (
                                    <div key={slot.id} className={getSlotClassName(slot.status)}>
                                        <span className="slot-time">{slot.time}</span>
                                        <span className="slot-status-badge">
                                            {slot.status === 'available' && (
                                                <>
                                                    <Check size={16} className="status-icon" /> Available
                                                </>
                                            )}
                                            {slot.status === 'tentative' && (
                                                <>
                                                    <Loader2 size={16} className="status-icon animate-spin" /> Locking...
                                                </>
                                            )}
                                            {slot.status === 'booked' && (
                                                <>
                                                    <X size={16} className="status-icon" /> Booked
                                                </>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="container">
                    <h2 className="section-title">How BookFast Works</h2>
                    <div className="steps">
                        <Card className="step">
                            <div className="step-number">1</div>
                            <h3>Select</h3>
                            <p>Choose your resource and time slot</p>
                        </Card>
                        <div className="arrow">
                            <ArrowRight size={40} color="#F5F1E8" />
                        </div>
                        <Card className="step">
                            <div className="step-number">2</div>
                            <h3>Lock</h3>
                            <p>Slot is instantly locked for you</p>
                        </Card>
                        <div className="arrow">
                            <ArrowRight size={40} color="#F5F1E8" />
                        </div>
                        <Card className="step">
                            <div className="step-number">3</div>
                            <h3>Confirm</h3>
                            <p>Booking confirmed, everyone sees it</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Why BookFast */}
            <section className="why-bookfast">
                <div className="container">
                    <h2 className="section-title">Why BookFast Wins</h2>
                    <div className="features-grid">
                        <Card hoverable className="feature">
                            <div className="feature-icon">
                                <Zap size={64} strokeWidth={1} />
                            </div>
                            <h3>Real-Time Engine</h3>
                            <p>WebSocket-powered updates in &lt;100ms. See changes instantly.</p>
                        </Card>
                        <Card hoverable className="feature">
                            <div className="feature-icon">
                                <ShieldCheck size={64} strokeWidth={1} />
                            </div>
                            <h3>Conflict Prevention</h3>
                            <p>Not detection, prevention. Conflicts can't happen by design.</p>
                        </Card>
                        <Card hoverable className="feature">
                            <div className="feature-icon">
                                <Database size={64} strokeWidth={1} />
                            </div>
                            <h3>Single Source of Truth</h3>
                            <p>Server-authoritative state. No optimistic UI lies.</p>
                        </Card>
                        <Card hoverable className="feature">
                            <div className="feature-icon">
                                <Rocket size={64} strokeWidth={1} />
                            </div>
                            <h3>Sub-300ms Bookings</h3>
                            <p>From click to confirmation in under 300 milliseconds.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Who It's For */}
            <section className="who-its-for">
                <div className="container">
                    <h2 className="section-title">Built For Teams Who Move Fast</h2>
                    <div className="personas">
                        <div className="persona">
                            <div className="persona-icon">
                                <Building2 size={48} strokeWidth={1.5} />
                            </div>
                            <h4>Startups</h4>
                            <p>Shared meeting rooms without chaos</p>
                        </div>
                        <div className="persona">
                            <div className="persona-icon">
                                <Factory size={48} strokeWidth={1.5} />
                            </div>
                            <h4>Enterprises</h4>
                            <p>Conference rooms, vehicles, equipment</p>
                        </div>
                        <div className="persona">
                            <div className="persona-icon">
                                <GraduationCap size={48} strokeWidth={1.5} />
                            </div>
                            <h4>Universities</h4>
                            <p>Labs, studios, shared spaces</p>
                        </div>
                        <div className="persona">
                            <div className="persona-icon">
                                <Stethoscope size={48} strokeWidth={1.5} />
                            </div>
                            <h4>Hospitals</h4>
                            <p>Equipment booking made reliable</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Reviews */}
            <section className="customer-reviews">
                <div className="container">
                    <h2 className="section-title">What Our Customers Say</h2>
                    <p className="section-subtitle">
                        Join thousands of teams who've eliminated booking conflicts with BookFast
                    </p>
                    <div className="reviews-grid">
                        <div className="review-card">
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="#FF8C42" color="#FF8C42" />
                                ))}
                            </div>
                            <p className="review-text">
                                "BookFast has completely transformed how our team manages conference rooms. No more double-bookings, no more awkward hallway conversations. The real-time updates are instantaneous."
                            </p>
                            <div className="review-author">
                                <div className="author-avatar">SM</div>
                                <div className="author-info">
                                    <h4>Sarah Mitchell</h4>
                                    <p>Operations Manager, TechFlow Inc.</p>
                                </div>
                            </div>
                        </div>

                        <div className="review-card">
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="#FF8C42" color="#FF8C42" />
                                ))}
                            </div>
                            <p className="review-text">
                                "We went from 15+ booking conflicts per week to zero. The WebSocket technology is genuinely impressive - everyone sees availability updates in real-time."
                            </p>
                            <div className="review-author">
                                <div className="author-avatar">JK</div>
                                <div className="author-info">
                                    <h4>James Kumar</h4>
                                    <p>IT Director, MedHealth Systems</p>
                                </div>
                            </div>
                        </div>

                        <div className="review-card">
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="#FF8C42" color="#FF8C42" />
                                ))}
                            </div>
                            <p className="review-text">
                                "The sub-300ms booking confirmation feels instant. Our team loves how simple and reliable it is. Best resource management tool we've implemented."
                            </p>
                            <div className="review-author">
                                <div className="author-avatar">PR</div>
                                <div className="author-info">
                                    <h4>Priya Raghavan</h4>
                                    <p>Facilities Coordinator, Startup Hub</p>
                                </div>
                            </div>
                        </div>

                        <div className="review-card">
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="#FF8C42" color="#FF8C42" />
                                ))}
                            </div>
                            <p className="review-text">
                                "Finally, a booking system that actually prevents conflicts instead of just detecting them. The server-authoritative approach makes all the difference."
                            </p>
                            <div className="review-author">
                                <div className="author-avatar">MC</div>
                                <div className="author-info">
                                    <h4>Marcus Chen</h4>
                                    <p>Product Lead, CloudScale Labs</p>
                                </div>
                            </div>
                        </div>

                        <div className="review-card">
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="#FF8C42" color="#FF8C42" />
                                ))}
                            </div>
                            <p className="review-text">
                                "Our university needed a reliable system for lab bookings. BookFast handles hundreds of concurrent users without breaking a sweat. Exceptional performance."
                            </p>
                            <div className="review-author">
                                <div className="author-avatar">AD</div>
                                <div className="author-info">
                                    <h4>Dr. Angela Davis</h4>
                                    <p>Department Head, State University</p>
                                </div>
                            </div>
                        </div>

                        <div className="review-card">
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="#FF8C42" color="#FF8C42" />
                                ))}
                            </div>
                            <p className="review-text">
                                "The best part? Zero learning curve. Our entire organization was up and running in minutes. The interface is intuitive and the conflict prevention is bulletproof."
                            </p>
                            <div className="review-author">
                                <div className="author-avatar">RJ</div>
                                <div className="author-info">
                                    <h4>Robert Johnson</h4>
                                    <p>CEO, Enterprise Solutions Group</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta">
                <div className="container">
                    <h2 className="cta-title">Ready to eliminate booking conflicts?</h2>
                    <p className="cta-subtitle">
                        Start booking with confidence. Real-time. Every time.
                    </p>
                    <Button size="lg" onClick={() => navigate('/register')}>
                        Get Started Free
                    </Button>
                </div>
            </section>

            {/* Site Footer */}
            <footer className="site-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h2 className="footer-logo">BookFast</h2>
                            <p className="footer-tagline">
                                Partner with a scheduling engine<br />
                                that's as ambitious as you are.
                            </p>
                            <button className="footer-contact-btn" onClick={() => navigate('/contact')}>
                                CONTACT US
                            </button>
                        </div>

                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>NAVIGATE</h4>
                                <ul>
                                    <li onClick={() => navigate('/')}>Homepage</li>
                                    <li onClick={() => navigate('/about')}>About</li>
                                    <li onClick={() => navigate('/journey')}>Journal</li>
                                    <li onClick={() => navigate('/contact')}>Contact</li>
                                </ul>
                            </div>
                            <div className="footer-column">
                                <h4>SOCIALS</h4>
                                <ul>
                                    <li>Twitter (X)</li>
                                    <li>LinkedIn</li>
                                    <li>Instagram</li>
                                    <li>Dribbble</li>
                                </ul>
                            </div>
                            <div className="footer-column">
                                <h4>CONTACT</h4>
                                <ul>
                                    <li>(555) 123-4567</li>
                                    <li>hello@bookfast.com</li>
                                    <li>Mumbai, India</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            © 2025 BOOKFAST. Site created by Kishan Ojha. All rights reserved.
                        </div>
                        <div className="footer-location">
                            MUMBAI • SAN FRANCISCO • LONDON
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

