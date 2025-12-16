import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import './Resources.css';

const Resources = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/resources`);
                setResources(res.data);
            } catch (error) {
                console.error('Error fetching resources:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const types = [
        { value: 'all', label: 'All Types', icon: '🏢' },
        { value: 'room', label: 'Meeting Rooms', icon: '🚪' },
        { value: 'desk', label: 'Desks', icon: '💼' },
        { value: 'office', label: 'Offices', icon: '🏛️' }
    ];

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.location && resource.location.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = selectedType === 'all' || resource.type === selectedType;
        return matchesSearch && matchesType;
    });

    const getStatusVariant = (status) => {
        switch (status) {
            case 'available': return 'success';
            case 'occupied': return 'warning';
            case 'maintenance': return 'error';
            default: return 'default';
        }
    };

    const handleBookResource = (resourceId) => {
        navigate('/bookings/new', { state: { resourceId } });
    };

    return (
        <div className="resources-page">
            <header className="page-header">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </Button>
                <div className="header-title">
                    <h1>Browse Resources</h1>
                    <p className="subtitle">Find and book available resources</p>
                </div>
            </header>

            <main className="resources-content">
                {/* Filters Section */}
                <Card className="filters-card">
                    <div className="filters-row">
                        <div className="search-box">
                            <Input
                                placeholder="Search resources..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="type-filters">
                            {types.map(type => (
                                <button
                                    key={type.value}
                                    className={`type-filter ${selectedType === type.value ? 'active' : ''}`}
                                    onClick={() => setSelectedType(type.value)}
                                >
                                    <span className="filter-icon">{type.icon}</span>
                                    <span className="filter-label">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Results Count */}
                <div className="results-header">
                    <h3>{filteredResources.length} Resources Found</h3>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <p>Loading resources...</p>
                    </div>
                ) : (
                    <>
                        {/* Resources Grid */}
                        {filteredResources.length === 0 ? (
                            <Card className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3>No resources found</h3>
                                <p>Try adjusting your search or filters</p>
                            </Card>
                        ) : (
                            <div className="resources-grid">
                                {filteredResources.map(resource => (
                                    <Card key={resource._id} className="resource-card">
                                        <div className="resource-header">
                                            <div className="resource-type-badge">
                                                {types.find(t => t.value === resource.type)?.icon}
                                            </div>
                                            <Badge variant={getStatusVariant(resource.status)}>
                                                {resource.status}
                                            </Badge>
                                        </div>

                                        <h3 className="resource-name">{resource.name}</h3>
                                        {resource.location && (
                                            <p className="resource-location">📍 {resource.location}</p>
                                        )}

                                        <div className="resource-info-row">
                                            <div className="info-item">
                                                <span className="info-icon">👥</span>
                                                <span className="info-text">Capacity: {resource.capacity}</span>
                                            </div>
                                        </div>

                                        {resource.amenities && resource.amenities.length > 0 && (
                                            <div className="amenities-section">
                                                <h4>Amenities</h4>
                                                <div className="amenities-list">
                                                    {resource.amenities.map((amenity, index) => (
                                                        <span key={index} className="amenity-tag">
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="resource-actions">
                                            <Button
                                                variant="outline"
                                                size="small"
                                                onClick={() => navigate(`/resources/${resource._id}`)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={() => handleBookResource(resource._id)}
                                                disabled={resource.status !== 'available'}
                                            >
                                                {resource.status === 'available' ? 'Book Now' : 'Unavailable'}
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Resources;
