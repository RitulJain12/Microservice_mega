import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import AddressCard from '../components/AddressCard';
import AddressForm from '../components/AddressForm';
import Button from '../components/Button';
import './OtherPages.css';

const ProfilePage = () => {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user/auth/users/me/addresses');
            setAddresses(response.data.addresses || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch addresses:', err);
            setError('Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (addressData) => {
        try {
            const response = await api.post('/user/auth/users/me/addresses', addressData);
            setAddresses(response.data.addresses || []);
            setShowAddForm(false);
            showSuccess('Address added successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add address');
        }
    };

    const handleUpdateAddress = async (addressId, addressData) => {
        try {
            const response = await api.put(`/user/auth/users/me/addresses/${addressId}`, addressData);
            setAddresses(response.data.addresses || []);
            showSuccess('Address updated successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update address');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const response = await api.delete(`/user/auth/users/me/addresses/${addressId}`);
            setAddresses(response.data.addresses || []);
            showSuccess('Address deleted successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete address');
        }
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className="profile-page">
            <div className="container" style={{ maxWidth: '56rem' }}>
                <h1 className="page-title">My Profile</h1>

                {/* User Info Card */}
                <div className="profile-card">
                    <div className="profile-fields">
                                    <div className="profile-field">
                                        <label className="profile-field-label">Name</label>
                                        <p className="profile-field-value">{user?.username || 'N/A'}</p>
                                        
                                    </div>
                        <div className="profile-field">
                            <label className="profile-field-label">Email</label>
                            <p className="profile-field-value">{user?.email || 'N/A'}</p>
                        </div>
                        <div className="profile-field">
                            <label className="profile-field-label">Member Since</label>
                            <p className="profile-field-value">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Addresses Section */}
                <div className="address-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="section-title">My Addresses</h2>
                        <Button
                            variant="primary"
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            {showAddForm ? 'Cancel' : '+ Add New Address'}
                        </Button>
                    </div>

                    {successMessage && (
                        <div className="success-message" style={{
                            padding: '1rem',
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '0.5rem',
                            color: '#22c55e',
                            marginBottom: '1.5rem',
                            animation: 'fadeIn 0.3s ease'
                        }}>
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="error-message" style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '0.5rem',
                            color: '#ef4444',
                            marginBottom: '1.5rem'
                        }}>
                            {error}
                        </div>
                    )}

                    {showAddForm && (
                        <div className="profile-card" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: '#87ceeb' }}>Add New Address</h3>
                            <AddressForm
                                onSubmit={handleAddAddress}
                                onCancel={() => setShowAddForm(false)}
                            />
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-state" style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                            Loading addresses...
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="empty-state" style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                            <p>No addresses saved yet.</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Add your first address to make checkout faster!
                            </p>
                        </div>
                    ) : (
                        <div className="address-grid">
                            {addresses.map((address) => (
                                <AddressCard
                                    key={address._id}
                                    address={address}
                                    onUpdate={handleUpdateAddress}
                                    onDelete={handleDeleteAddress}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
