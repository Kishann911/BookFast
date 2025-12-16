import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import Card from '../components/Card';
import './Dashboard.css';
import bornfire from '../assets/bornfire.svg';
import {
    Calendar,
    ClipboardList,
    Building2,
    Settings,
    Bell,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/dashboard/stats`);
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const quickActions = [
        { label: 'New Booking', action: () => navigate('/bookings/new'), icon: Calendar },
        { label: 'My Bookings', action: () => navigate('/my-bookings'), icon: ClipboardList },
        { label: 'Browse Resources', action: () => navigate('/resources'), icon: Building2 },
        ...(user?.role === 'admin' ? [{ label: 'Admin Dashboard', action: () => navigate('/admin'), icon: Settings }] : []),
        { label: 'Settings', action: () => navigate('/settings'), icon: Settings }
    ];

    if (loading) {
        return (
            <div className="analytics-dashboard">
                <div className="loading-container">
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="dashboard-title">Dashboard Analytics</h1>
                        <p className="dashboard-subtitle">
                            Welcome back, <strong>{user?.name}</strong>
                        </p>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn" title="Notifications">
                            <Bell size={20} />
                        </button>
                        <button
                            className="icon-btn"
                            title="Settings"
                            onClick={() => navigate('/settings')}
                        >
                            <Settings size={20} />
                        </button>
                        <Button variant="ghost" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Dashboard */}
            <main className="dashboard-content">
                {/* Left Sidebar Stats */}
                <aside className="dashboard-sidebar-left">
                    <Card className="stat-card">
                        <div className="stat-header">
                            <span className="stat-label">All Resources</span>
                            <span className="stat-trend positive"><TrendingUp size={16} /></span>
                        </div>
                        <div className="stat-value-large">{stats?.resources?.total || 0}</div>
                        <div className="stat-footer">
                            <div className="status-breakdown">
                                <div className="status-item">
                                    <span className="status-dot" style={{ background: '#6BA353' }}></span>
                                    <span>Available: {stats?.resources?.byStatus?.available || 0}</span>
                                </div>
                                <div className="status-item">
                                    <span className="status-dot" style={{ background: '#4A90E2' }}></span>
                                    <span>Occupied: {stats?.resources?.byStatus?.occupied || 0}</span>
                                </div>
                                <div className="status-item">
                                    <span className="status-dot" style={{ background: '#FF8C42' }}></span>
                                    <span>Maintenance: {stats?.resources?.byStatus?.maintenance || 0}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="stat-card">
                        <h4 className="section-title">Recent Activity</h4>
                        <div className="activity-list">
                            {stats?.recentActivity?.slice(0, 5).map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-indicator" style={{
                                        backgroundColor: activity.status === 'confirmed' ? '#6BA353' : '#FF8C42'
                                    }}></div>
                                    <div className="activity-details">
                                        <span className="activity-name">{activity.resourceId?.name || 'Unknown'}</span>
                                        <span className="activity-value">{activity.userId?.name || 'User'}</span>
                                        <span className="activity-percent">{activity.status}</span>
                                    </div>
                                </div>
                            )) || <p>No recent activity</p>}
                        </div>
                    </Card>

                    <Card className="stat-card earnings-card">
                        <h4 className="section-title">Booking Statistics</h4>
                        <div className="earnings-value">
                            {stats?.bookings?.total || 0}
                        </div>
                        <div className="earnings-change">
                            <span className="change-badge positive">Total</span>
                            <span className="change-text">All-time bookings</span>
                        </div>
                        <div className="category-stats">
                            <div className="category-item">
                                <span className="category-name">Active</span>
                                <span className="category-value">{stats?.bookings?.active || 0}</span>
                                <span className="category-icon"><CheckCircle size={14} /></span>
                            </div>
                            <div className="category-item">
                                <span className="category-name">Upcoming</span>
                                <span className="category-value">{stats?.bookings?.upcoming || 0}</span>
                                <span className="category-icon"><Clock size={14} /></span>
                            </div>
                            <div className="category-item">
                                <span className="category-name">Cancelled</span>
                                <span className="category-value">{stats?.bookings?.cancelled || 0}</span>
                                <span className="category-icon"><XCircle size={14} /></span>
                            </div>
                        </div>
                    </Card>
                </aside>

                {/* Center - Main Visual */}
                <div className="dashboard-center">
                    <Card className="central-card">
                        <div className="central-visual">
                            <img src={bornfire} alt="BookFast Logo" className="central-logo" />

                            {/* Animated rings around logo */}
                            <div className="pulse-ring ring-1"></div>
                            <div className="pulse-ring ring-2"></div>
                            <div className="pulse-ring ring-3"></div>
                        </div>

                        <div className="central-stats">
                            <div className="central-stat-item">
                                <div className="central-stat-value">{stats?.bookings?.active || 0}</div>
                                <div className="central-stat-label">Active Bookings</div>
                            </div>
                            <div className="central-stat-item">
                                <div className="central-stat-value">{stats?.resources?.byStatus?.available || 0}</div>
                                <div className="central-stat-label">Available Resources</div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        {quickActions.map((action, index) => {
                            const IconComponent = action.icon;
                            return (
                                <button
                                    key={index}
                                    className="quick-action-btn"
                                    onClick={action.action}
                                >
                                    <span className="action-icon">
                                        <IconComponent size={24} />
                                    </span>
                                    <span className="action-label">{action.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="dashboard-sidebar-right">
                    <Card className="stat-card">
                        <h4 className="section-title">Top Resources</h4>
                        <div className="top-resources-list">
                            {stats?.resources?.topResources?.slice(0, 5).map((resource, index) => (
                                <div key={index} className="top-resource-item">
                                    <div className="resource-rank">{index + 1}</div>
                                    <div className="resource-info">
                                        <div className="resource-name">{resource.name}</div>
                                        <div className="resource-bookings">{resource.bookingCount} bookings</div>
                                    </div>
                                </div>
                            )) || <p>No booking data yet</p>}
                        </div>
                    </Card>

                    {stats?.users && (
                        <Card className="stat-card">
                            <h4 className="section-title">User Statistics</h4>
                            <div className="user-stats">
                                <div className="user-stat-item">
                                    <span className="user-stat-label">Total Users</span>
                                    <span className="user-stat-value">{stats.users.total}</span>
                                </div>
                                <div className="user-stat-item">
                                    <span className="user-stat-label">Recent (7 days)</span>
                                    <span className="user-stat-value">{stats.users.recentRegistrations}</span>
                                </div>
                            </div>
                        </Card>
                    )}
                </aside>
            </main>
        </div>
    );
};

export default Dashboard;
