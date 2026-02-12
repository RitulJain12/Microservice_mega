import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import api from '../config/api';
import Button from '../components/Button';
import './CartPage.css';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart/api/cart');
            // Handle new response structure with cart and totals
            setCart(response.data.cart || response.data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            const res = await api.put(`/cart/api/cart/items/${itemId}`, { quantity: newQuantity });
            console.log(res);
            fetchCart();
        } catch (error) {
            alert('Failed to update quantity');
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/api/cart/items/${itemId}`);
            fetchCart();
        } catch (error) {
            alert('Failed to remove item');
        }
    };

    const calculateTotal = () => {
        if (!cart?.items) return 0;
        // Handle new price structure with price.amount
        return cart.items.reduce((total, item) => {
            const price = item.price?.amount || item.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    // Helper function to get currency symbol
    const getCurrencySymbol = (currency) => {
        switch (currency) {
            case 'INR': return '₹';
            case 'USD': return '$';
            default: return '$';
        }
    };

    // Helper function to format price
    const formatPrice = (priceObj) => {
        if (typeof priceObj === 'number') return priceObj;
        if (priceObj?.amount) return priceObj.amount;
        return 0;
    };

    // Helper function to get image URL
    const getImageUrl = (images) => {
        if (!images || images.length === 0) return 'https://via.placeholder.com/150';
        // Handle new format: array of objects with url property
        if (typeof images[0] === 'object' && images[0]?.url) {
            return images[0].url;
        }
        // Handle old format: direct string
        return images[0];
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--sky-blue-400)', fontSize: '1.25rem' }}>Loading cart...</div>
            </div>
        );
    }

    if (!cart?.items || cart.items.length === 0) {
        return (
            <div className="cart-empty">
                <div className="cart-empty-content">
                    <ShoppingBag className="cart-empty-icon" size={64} />
                    <h2 className="cart-empty-title">Your cart is empty</h2>
                    <p className="cart-empty-text">Add some products to get started!</p>
                    <Button onClick={() => navigate('/products')}>Browse Products</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container" style={{ maxWidth: '72rem' }}>
                <h1 className="cart-title">Shopping Cart</h1>

                <div className="cart-grid">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cart.items.map((item) => {
                            const currency = item.price?.currency || 'USD';
                            const currencySymbol = getCurrencySymbol(currency);
                            const price = formatPrice(item.price);
                            const imageUrl = getImageUrl(item.images);

                            return (
                                <div key={item.productId} className="cart-item">
                                    <div className="cart-item-image-wrapper">
                                        <img
                                            src={imageUrl}
                                            alt={item?.title || 'Product'}
                                            className="cart-item-image"
                                        />
                                    </div>

                                    <div className="cart-item-content">
                                        <h3 className="cart-item-title">
                                            {item?.title || 'Product'}
                                        </h3>
                                        <p className="cart-item-price">
                                            {currencySymbol}{price.toFixed(2)}
                                        </p>

                                        <div className="cart-item-controls">
                                            <div className="cart-item-quantity">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="cart-item-quantity-btn"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="cart-item-quantity-value">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="cart-item-quantity-btn"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="cart-item-remove-btn"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="cart-summary">
                        <div className="cart-summary-card">
                            <h2 className="cart-summary-title">Order Summary</h2>

                            <div className="cart-summary-details">
                                <div className="cart-summary-row">
                                    <span>Subtotal</span>
                                    <span>
                                        {getCurrencySymbol(cart.items[0]?.price?.currency || 'USD')}
                                        {calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                                <div className="cart-summary-row">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="cart-summary-total">
                                    <span>Total</span>
                                    <span className="cart-summary-total-amount">
                                        {getCurrencySymbol(cart.items[0]?.price?.currency || 'USD')}
                                        {calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                className="cart-summary-checkout-btn"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
