
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Target, Heart, Users } from 'lucide-react';
import SideMenu from '../components/SideMenu';
import './Landing.css';

const About = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="landing">
             <section className="hero-new" style={{ minHeight: '60vh', height: 'auto', paddingBottom: '60px' }}>
                <div className="hero-menu-container">
                    <MoreVertical 
                        className="hero-menu-icon" 
                        onClick={() => setIsMenuOpen(true)}
                    />
                </div>
                <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                <div className="hero-banner" onClick={() => navigate('/')}>
                     <p className="banner-text">
                        <ArrowLeft size={16} className="banner-arrow-icon" style={{ transform: 'rotate(0)' }}/>
                        BACK TO HOME
                    </p>
                </div>
                
                <div className="hero-giant-text" style={{ fontSize: '10vw' }}>ABOUT</div>
                
                <div className="container" style={{ position: 'relative', zIndex: 5, marginTop: '100px' }}>
                     <div style={{ maxWidth: '900px', margin: '0 auto', background: '#F5F1E8', padding: '60px', border: '5px solid #1a1a1a', boxShadow: '12px 12px 0 #1a1a1a' }}>
                        
                        <div style={{ marginBottom: '60px' }}>
                            <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: '30px' }}>Our Mission</h2>
                            <p style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', lineHeight: '1.6', color: '#4a4a4a' }}>
                                To eliminate the friction of shared resources. We envision a world where booking a room, a vehicle, or a piece of equipment is as instantaneous and reliable as flipping a light switch. No conflicts, no double-bookings, just seamless access.
                            </p>
                        </div>

                        <div style={{ marginBottom: '60px' }}>
                            <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: '30px' }}>The Story</h2>
                            <p style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', lineHeight: '1.6', color: '#4a4a4a', marginBottom: '20px' }}>
                                BookFast was born from a simple frustration: the chaos of double-booked meeting rooms and the friction of scheduling shared resources. In 2023, our founders watched as high-performing teams wasted hours every week negotiating space.
                            </p>
                            <p style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', lineHeight: '1.6', color: '#4a4a4a' }}>
                                We realized existing tools were built for a slower era. They relied on "refreshing" pages. We decided to build the operating system for physical spaces using a WebSocket-first architecture that pushes updates instantly—faster than you can blink.
                            </p>
                        </div>

                        <div>
                            <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: '40px' }}>Core Values</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                                <div>
                                    <div style={{ marginBottom: '15px', color: '#6BA353' }}><Target size={32} /></div>
                                    <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a' }}>Precision</h4>
                                    <p style={{ fontFamily: 'Space Grotesk', color: '#4a4a4a' }}>We don't guess. We know. Our state is always the single source of truth.</p>
                                </div>
                                <div>
                                    <div style={{ marginBottom: '15px', color: '#FF8C42' }}><Heart size={32} /></div>
                                    <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a' }}>Simplicity</h4>
                                    <p style={{ fontFamily: 'Space Grotesk', color: '#4a4a4a' }}>If it needs a manual, it's too complex. We design for intuition.</p>
                                </div>
                                <div>
                                    <div style={{ marginBottom: '15px', color: '#1a1a1a' }}><Users size={32} /></div>
                                    <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a' }}>Respect</h4>
                                    <p style={{ fontFamily: 'Space Grotesk', color: '#4a4a4a' }}>We respect your time. That's why we measure latency in milliseconds.</p>
                                </div>
                            </div>
                        </div>

                     </div>
                </div>
            </section>
        </div>
    );
};

export default About;
