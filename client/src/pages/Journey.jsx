import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Flag, Rocket, Trophy, Globe } from 'lucide-react';
import SideMenu from '../components/SideMenu';
import './Landing.css';

const Journey = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const milestones = [
        {
            year: "2023",
            title: "The Friction Point",
            description: "Working from a crowded startup hub, we realized 30% of our meeting time was spent just finding a room. The idea for BookFast was conceived on a napkin.",
            icon: <Flag size={24} />
        },
        {
            year: "Q1 2024",
            title: "The Architecture",
            description: "We scrapped the traditional database polling model. We built a custom WebSocket engine capable of handling 50k+ concurrent state changes.",
            icon: <Rocket size={24} />
        },
        {
            year: "Q3 2024",
            title: "First Deployment",
            description: "We launched beta with TechFlow Inc. They reported a complete elimination of double bookings in week one.",
            icon: <Trophy size={24} />
        },
        {
            year: "2025",
            title: "Going Global",
            description: "Now serving teams across 12 countries. We're expanding beyond rooms to manage fleets, expensive equipment, and specialized labs.",
            icon: <Globe size={24} />
        }
    ];

    return (
        <div className="landing">
            <section className="hero-new" style={{ minHeight: '60vh', height: 'auto', paddingBottom: '60px', background: '#1a1a1a' }}>
                <div className="hero-menu-container">
                    <MoreVertical
                        className="hero-menu-icon"
                        onClick={() => setIsMenuOpen(true)}
                        style={{ color: '#F5F1E8' }}
                    />
                </div>
                <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                <div className="hero-banner" onClick={() => navigate('/')}>
                    <p className="banner-text">
                        <ArrowLeft size={16} className="banner-arrow-icon" style={{ transform: 'rotate(0)' }} />
                        BACK TO HOME
                    </p>
                </div>

                <div className="hero-giant-text" style={{ fontSize: '10vw', color: '#1a1a1a' }}>JOURNAL</div>

                <div className="container" style={{ position: 'relative', zIndex: 5, marginTop: '100px' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', background: '#F5F1E8', padding: '60px', border: '5px solid #6BA353', boxShadow: '12px 12px 0 #6BA353' }}>
                        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem', color: '#1a1a1a' }}>The Journey</h2>
                        <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '10px' }}>From Idea to Reality</h4>

                        <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {milestones.map((milestone, index) => (
                                <div key={index} style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ background: '#1a1a1a', color: '#6BA353', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #6BA353' }}>
                                            {milestone.icon}
                                        </div>
                                        {index !== milestones.length - 1 && (
                                            <div style={{ width: '3px', background: '#ddd', flexGrow: 1, margin: '10px 0' }}></div>
                                        )}
                                    </div>
                                    <div>
                                        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 'bold', color: '#6BA353' }}>{milestone.year}</span>
                                        <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.5rem', margin: '5px 0 10px', color: '#1a1a1a' }}>{milestone.title}</h3>
                                        <p style={{ fontFamily: 'Space Grotesk', color: '#4a4a4a', lineHeight: '1.6' }}>{milestone.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Journey;
