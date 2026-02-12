import React, { useState, useEffect } from 'react';
import { Package, MapPin, ChevronRight, Truck, Calendar, DollarSign, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { formatPrice, formatDate } from '../utils/formatters';
import Button from '../components/Button';
import Input from '../components/Input';
import './OtherPages.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productsMap, setProductsMap] = useState({});
    const [editingOrder, setEditingOrder] = useState(null);
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        zip: ''
    });
    const [updatingAddress, setUpdatingAddress] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/order/api/order/me');
            console.log("Orders API Response:", response);
            const ordersData = response.data.orders || response.data || [];
            setOrders(ordersData);

            // Extract all product IDs
            const productIds = new Set();
            ordersData.forEach(order => {
                if (order.items) {
                    order.items.forEach(item => {
                        if (item.productId) {
                            productIds.add(typeof item.productId === 'object' ? item.productId._id : item.productId);
                        }
                    });
                }
            });

            if (productIds.size > 0) {
                fetchProducts(Array.from(productIds));
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (ids) => {
        try {
            const response = await api.post('/product/api/product/bulk', { ids });
            const products = response.data.products || [];
            const map = {};
            products.forEach(p => {
                map[p._id] = p;
            });
            setProductsMap(map);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    };

    const handleEditAddress = (order) => {
        setEditingOrder(order);
        setAddressForm({
            street: order.shippingAddress?.street || '',
            city: order.shippingAddress?.city || '',
            state: order.shippingAddress?.state || '',
            country: order.shippingAddress?.country || '',
            zip: order.shippingAddress?.zip || ''
        });
    };

    const handleAddressChange = (e) => {
        setAddressForm({
            ...addressForm,
            [e.target.name]: e.target.value
        });
    };

    const saveAddress = async () => {
        if (!editingOrder) return;
        setUpdatingAddress(true);
        try {
            await api.patch(`/order/api/order/${editingOrder._id}/address`, {
                shippingAddress: addressForm
            });

            // Update local state
            setOrders(orders.map(o => {
                if (o._id === editingOrder._id) {
                    return { ...o, shippingAddress: addressForm };
                }
                return o;
            }));

            setEditingOrder(null);
        } catch (error) {
            console.error("Failed to update address", error);
            alert("Failed to update address. Please try again.");
        } finally {
            setUpdatingAddress(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            await api.patch(`/order/api/order/${orderId}/cancel`);
            // Update local state
            setOrders(orders.map(o => {
                if (o._id === orderId) {
                    return { ...o, status: 'cancelled' };
                }
                return o;
            }));
        } catch (error) {
            console.error("Failed to cancel order", error);
            alert("Failed to cancel order. Please try again.");
        }
    };

    const getProductDetails = (item) => {
        const id = typeof item.productId === 'object' ? item.productId._id : item.productId;
        // Check if we have details in the map, OR if the item itself has populated details (fallback)
        if (productsMap[id]) return productsMap[id];
        if (typeof item.productId === 'object' && item.productId.name) return item.productId;
        return null;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-content">
                    <Package className="empty-state-icon" size={64} />
                    <h2 className="empty-state-title">No orders yet</h2>
                    <p className="empty-state-text">Your order history will appear here</p>
                    <Button onClick={() => navigate('/products')} variant="primary" style={{ marginTop: '1.5rem' }}>
                        Start Shopping
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container" style={{ maxWidth: '72rem' }}>
                <h1 className="page-title">My Orders</h1>

                <div className="orders-list">
                    {orders.map((order) => {
                        if (!order) return null;
                        return (
                            <div key={order._id || Math.random()} className="order-card">
                                <div className="order-header">
                                    <div className="order-header-left">
                                        <div className="order-id-badge">
                                            <Package size={16} />
                                            <span>#{order._id?.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div className="order-meta">
                                            <span className="order-date">
                                                <Calendar size={14} style={{ marginRight: '4px' }} />
                                                {formatDate(order.orderDate)}
                                            </span>
                                            <span className="order-amount">
                                                {formatPrice(order.totalAmount, order.items[0]?.currency || 'INR')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="order-header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span className={`order-status ${order.status || 'pending'}`}>
                                            {(order.status || 'pending').toUpperCase()}
                                        </span>
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                className="cancel-order-btn"
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="order-content">
                                    <div className="order-items-section">
                                        <h3 className="section-title">Items</h3>
                                        <div className="order-items">
                                            {order.items?.map((item, index) => {
                                                const product = getProductDetails(item);
                                                const productId = typeof item.productId === 'object' ? item.productId._id : item.productId;

                                                return (
                                                    <div
                                                        key={index}
                                                        className="order-item"
                                                        onClick={() => navigate(`/product/${productId}`)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="order-item-image">
                                                            <img
                                                                src={product?.images?.[0]?.url || product?.images?.[0] || 'https://via.placeholder.com/100'}
                                                                alt={product?.title || 'Product'}
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image' }}
                                                            />
                                                        </div>
                                                        <div className="order-item-info">
                                                            <p className="order-item-name">{product?.title || 'Loading Product...'}</p>
                                                            <p className="order-item-quantity">Qty: {item?.quantity || 0}</p>
                                                        </div>
                                                        <div className="order-item-price-container">
                                                            <p className="order-item-price">
                                                                {formatPrice(item?.price?.amount, item?.price?.currency)}
                                                            </p>
                                                            <ChevronRight size={16} className="item-arrow" />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="order-shipping-section">
                                        <div className="section-header">
                                            <h3 className="section-title">
                                                <Truck size={16} style={{ marginRight: '8px' }} />
                                                Shipping Detail
                                            </h3>
                                            {order.status === 'pending' && (
                                                <button
                                                    className="edit-address-btn"
                                                    onClick={() => handleEditAddress(order)}
                                                >
                                                    <Edit2 size={14} />
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                        <div className="shipping-address">
                                            <p className="address-line">{order.shippingAddress?.street}</p>
                                            <p className="address-line">
                                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                                            </p>
                                            <p className="address-line">{order.shippingAddress?.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Edit Address Modal */}
            {editingOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Update Shipping Address</h3>
                            <button className="close-btn" onClick={() => setEditingOrder(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <Input
                                label="Street Address"
                                name="street"
                                value={addressForm.street}
                                onChange={handleAddressChange}
                                placeholder="123 Main St"
                            />
                            <div className="form-row">
                                <Input
                                    label="City"
                                    name="city"
                                    value={addressForm.city}
                                    onChange={handleAddressChange}
                                />
                                <Input
                                    label="State"
                                    name="state"
                                    value={addressForm.state}
                                    onChange={handleAddressChange}
                                />
                            </div>
                            <div className="form-row">
                                <Input
                                    label="Zip Code"
                                    name="zip"
                                    value={addressForm.zip}
                                    onChange={handleAddressChange}
                                />
                                <Input
                                    label="Country"
                                    name="country"
                                    value={addressForm.country}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={() => setEditingOrder(null)}>Cancel</Button>
                            <Button variant="primary" onClick={saveAddress} disabled={updatingAddress}>
                                {updatingAddress ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
