import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, MoreVertical, MessageSquare, Clock } from 'lucide-react';
import SideMenu from '../components/SideMenu';
import './Landing.css';

const Contact = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="landing">
            <section className="hero-new" style={{ minHeight: '60vh', height: 'auto', paddingBottom: '60px', background: '#FF8C42' }}>
                <div className="hero-menu-container">
                    <MoreVertical
                        className="hero-menu-icon"
                        onClick={() => setIsMenuOpen(true)}
                    />
                </div>
                <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                <div className="hero-banner" onClick={() => navigate('/')} style={{ background: '#F5F1E8' }}>
                    <p className="banner-text">
                        <ArrowLeft size={16} className="banner-arrow-icon" style={{ transform: 'rotate(0)' }} />
                        BACK TO HOME
                    </p>
                </div>

                <div className="hero-giant-text" style={{ fontSize: '10vw' }}>CONTACT</div>

                <div className="container" style={{ position: 'relative', zIndex: 5, marginTop: '100px' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', background: '#F5F1E8', padding: '60px', border: '5px solid #1a1a1a', boxShadow: '12px 12px 0 #1a1a1a' }}>
                        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem' }}>Get in Touch</h2>
                        <p style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', marginBottom: '40px', color: '#4a4a4a' }}>
                            We're here to help you revolutionize your resource management. Whether you have a question about features, pricing, or enterprise solutions, our team is ready to answer.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ background: '#1a1a1a', padding: '15px', color: '#fff' }}><Mail size={24} /></div>
                                    <div>
                                        <h4 style={{ margin: 0, fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: '#1a1a1a' }}>EMAIL US</h4>
                                        <p style={{ margin: 0, fontFamily: 'Space Grotesk', color: '#4a4a4a' }}>hello@bookfast.com</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ background: '#1a1a1a', padding: '15px', color: '#fff' }}><Phone size={24} /></div>
                                    <div>
                                        <h4 style={{ margin: 0, fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: '#1a1a1a' }}>CALL US</h4>
                                        <p style={{ margin: 0, fontFamily: 'Space Grotesk', color: '#4a4a4a' }}>+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ background: '#1a1a1a', padding: '15px', color: '#fff' }}><MapPin size={24} /></div>
                                    <div>
                                        <h4 style={{ margin: 0, fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: '#1a1a1a' }}>VISIT US</h4>
                                        <p style={{ margin: 0, fontFamily: 'Space Grotesk', color: '#4a4a4a' }}>123 Startup Blvd, Tech City</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#fff', padding: '30px', border: '3px solid #1a1a1a' }}>
                                <div style={{ marginBottom: '20px', color: '#6BA353' }}><MessageSquare size={32} /></div>
                                <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '1.25rem', marginBottom: '10px', color: '#1a1a1a' }}>Live Chat</h4>
                                <p style={{ fontFamily: 'Space Grotesk', color: '#4a4a4a', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    Need instant answers? Our support team is available Mon-Fri, 9am - 6pm EST.
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', fontSize: '0.9rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                                    <Clock size={16} /> <span>Avg. Response: 2 mins</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
