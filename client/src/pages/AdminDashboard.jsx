import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    // Fetch resources on mount
    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/resources/all`);
            setResources(res.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
            showToast('Failed to load resources', 'error');
        } finally {
            setLoading(false);
        }
    };

    const [newResource, setNewResource] = useState({
        name: '',
        capacity: '',
        type: 'room',
        status: 'available'
    });

    const handleAddResource = async () => {
        if (!newResource.name || !newResource.capacity) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        const capacity = parseInt(newResource.capacity);
        if (isNaN(capacity) || capacity < 1) {
            showToast('Capacity must be a valid positive number', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', newResource.name);
            formData.append('type', newResource.type);
            formData.append('capacity', capacity);
            formData.append('status', newResource.status);
            formData.append('isActive', 'true');

            await axios.post(`${API_URL}/api/resources`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            showToast('Resource added successfully!', 'success');
            setShowAddModal(false);
            setNewResource({ name: '', capacity: '', type: 'room', status: 'available' });
            fetchResources(); // Refresh list
        } catch (error) {
            console.error('Error adding resource:', error);
            showToast(error.response?.data?.message || 'Failed to add resource', 'error');
        }
    };

    const handleEditResource = async () => {
        if (!selectedResource) return;

        const capacity = parseInt(selectedResource.capacity);
        if (isNaN(capacity) || capacity < 1) {
            showToast('Capacity must be a valid positive number', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', selectedResource.name);
            formData.append('type', selectedResource.type);
            formData.append('capacity', capacity);
            formData.append('status', selectedResource.status);
            if (selectedResource.isActive !== undefined) {
                formData.append('isActive', selectedResource.isActive);
            }

            await axios.put(`${API_URL}/api/resources/${selectedResource._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            showToast('Resource updated successfully!', 'success');
            setShowEditModal(false);
            setSelectedResource(null);
            fetchResources(); // Refresh list
        } catch (error) {
            console.error('Error updating resource:', error);
            showToast(error.response?.data?.message || 'Failed to update resource', 'error');
        }
    };

    const handleDeleteResource = async (id) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            try {
                await axios.delete(`${API_URL}/api/resources/${id}`);
                showToast('Resource deleted successfully!', 'success');
                fetchResources(); // Refresh list
            } catch (error) {
                console.error('Error deleting resource:', error);
                showToast(error.response?.data?.message || 'Failed to delete resource', 'error');
            }
        }
    };

    const openEditModal = (resource) => {
        setSelectedResource({ ...resource });
        setShowEditModal(true);
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'available': return 'success';
            case 'occupied': return 'warning';
            case 'maintenance': return 'error';
            default: return 'default';
        }
    };

    const stats = {
        total: resources.length,
        available: resources.filter(r => r.status === 'available').length,
        occupied: resources.filter(r => r.status === 'occupied').length,
        maintenance: resources.filter(r => r.status === 'maintenance').length
    };

    if (loading) {
        return <div className="loading-container">Loading dashboard...</div>;
    }

    return (
        <div className="admin-dashboard-page">
            <header className="page-header">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </Button>
                <div className="header-title">
                    <h1>Admin Dashboard</h1>
                    <p className="subtitle">Manage resources and bookings</p>
                </div>
                <div className="header-actions">
                    <Button onClick={() => setShowAddModal(true)}>
                        + Add Resource
                    </Button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="admin-stats">
                <Card className="stat-card">
                    <div className="stat-icon-container">📊</div>
                    <div className="stat-info">
                        <h4>Total Resources</h4>
                        <p className="stat-number">{stats.total}</p>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon-container available">✓</div>
                    <div className="stat-info">
                        <h4>Available</h4>
                        <p className="stat-number">{stats.available}</p>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon-container occupied">●</div>
                    <div className="stat-info">
                        <h4>Occupied</h4>
                        <p className="stat-number">{stats.occupied}</p>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon-container maintenance">⚠</div>
                    <div className="stat-info">
                        <h4>Maintenance</h4>
                        <p className="stat-number">{stats.maintenance}</p>
                    </div>
                </Card>
            </div>

            {/* Resources Table */}
            <Card className="resources-table-card">
                <h2 className="table-title">Resources</h2>
                <div className="table-container">
                    <table className="resources-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map(resource => (
                                <tr key={resource._id}>
                                    <td className="resource-name">{resource.name}</td>
                                    <td className="resource-type">{resource.type}</td>
                                    <td className="resource-capacity">{resource.capacity}</td>
                                    <td>
                                        <Badge variant={getStatusVariant(resource.status)}>
                                            {resource.status || 'unknown'}
                                        </Badge>
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            className="action-btn edit"
                                            onClick={() => openEditModal(resource)}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDeleteResource(resource._id)}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add Resource Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add New Resource"
            >
                <div className="modal-form">
                    <div className="form-group">
                        <label>Resource Name</label>
                        <Input
                            value={newResource.name}
                            onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                            placeholder="e.g., Conference Room C"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Type</label>
                            <select
                                className="select-input"
                                value={newResource.type}
                                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                            >
                                <option value="room">Room</option>
                                <option value="desk">Desk</option>
                                <option value="office">Office</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Capacity</label>
                            <Input
                                type="number"
                                value={newResource.capacity}
                                onChange={(e) => setNewResource({ ...newResource, capacity: e.target.value })}
                                placeholder="e.g., 12"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            className="select-input"
                            value={newResource.status}
                            onChange={(e) => setNewResource({ ...newResource, status: e.target.value })}
                        >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddResource}>
                            Add Resource
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Resource Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Resource"
            >
                {selectedResource && (
                    <div className="modal-form">
                        <div className="form-group">
                            <label>Resource Name</label>
                            <Input
                                value={selectedResource.name}
                                onChange={(e) => setSelectedResource({ ...selectedResource, name: e.target.value })}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    className="select-input"
                                    value={selectedResource.type}
                                    onChange={(e) => setSelectedResource({ ...selectedResource, type: e.target.value })}
                                >
                                    <option value="room">Room</option>
                                    <option value="desk">Desk</option>
                                    <option value="office">Office</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Capacity</label>
                                <Input
                                    type="number"
                                    value={selectedResource.capacity}
                                    onChange={(e) => setSelectedResource({ ...selectedResource, capacity: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                className="select-input"
                                value={selectedResource.status || 'available'}
                                onChange={(e) => setSelectedResource({ ...selectedResource, status: e.target.value })}
                            >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <Button variant="ghost" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditResource}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
