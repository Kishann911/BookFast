import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import './Settings.css';

const Settings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        organization: ''
    });

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        // Simulate API call
        showToast('Profile updated successfully!', 'success');
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            showToast('Passwords do not match', 'error');
            return;
        }
        showToast('Password changed successfully!', 'success');
        setPasswordData({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="settings-page">
            <header className="page-header">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </Button>
                <div className="header-title">
                    <h1>Settings</h1>
                    <p className="subtitle">Manage your account preferences</p>
                </div>
            </header>

            <main className="settings-content">
                {/* Tabs */}
                <div className="settings-tabs">
                    <button
                        className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <span className="tab-icon">👤</span>
                        Profile
                    </button>
                    <button
                        className={`tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <span className="tab-icon">🔒</span>
                        Security
                    </button>
                    <button
                        className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <span className="tab-icon">🔔</span>
                        Notifications
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <Card className="settings-panel">
                        <h2 className="panel-title">Profile Information</h2>
                        <form onSubmit={handleProfileUpdate} className="settings-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <Input
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <Input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone</label>
                                    <Input
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Organization</label>
                                    <Input
                                        value={profileData.organization}
                                        onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                                        placeholder="Company Name"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <Card className="settings-panel">
                        <h2 className="panel-title">Change Password</h2>
                        <form onSubmit={handlePasswordChange} className="settings-form">
                            <div className="form-group">
                                <label>Current Password</label>
                                <Input
                                    type="password"
                                    value={passwordData.current}
                                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <Input
                                    type="password"
                                    value={passwordData.new}
                                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <Input
                                    type="password"
                                    value={passwordData.confirm}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <div className="form-actions">
                                <Button type="submit">Update Password</Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <Card className="settings-panel">
                        <h2 className="panel-title">Notification Preferences</h2>
                        <div className="settings-form">
                            <div className="toggle-group">
                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>Email Notifications</h4>
                                        <p>Receive booking confirmations and reminders via email</p>
                                    </div>
                                    <input type="checkbox" className="toggle-switch" defaultChecked />
                                </div>

                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>Booking Reminders</h4>
                                        <p>Get reminded 15 minutes before your booking</p>
                                    </div>
                                    <input type="checkbox" className="toggle-switch" defaultChecked />
                                </div>

                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>Conflict Notifications</h4>
                                        <p>Alert when booking conflicts are detected</p>
                                    </div>
                                    <input type="checkbox" className="toggle-switch" defaultChecked />
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default Settings;
