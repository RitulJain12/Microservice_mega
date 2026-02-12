import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import Input from '../components/Input';
import AddressCard from '../components/AddressCard';
import AddressForm from '../components/AddressForm';
import './OtherPages.css';

// Helper to load Razorpay SDK
const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { fetchCartCount } = useCart();
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [phone, setPhone] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [newAddressData, setNewAddressData] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    });

    useEffect(() => {
        loadScript('https://checkout.razorpay.com/v1/checkout.js');
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/user/auth/users/me/addresses');
            const userAddresses = response.data.addresses || [];
            setAddresses(userAddresses);

            // Auto-select first address if available
            if (userAddresses.length > 0 && !useNewAddress) {
                setSelectedAddressId(userAddresses[0]._id);
            } else if (userAddresses.length === 0) {
                setUseNewAddress(true);
            }
        } catch (err) {
            console.error('Failed to fetch addresses:', err);
            setUseNewAddress(true);
        }
    };

    const fetchRazorpayKey = async () => {
        const { data } = await api.get('/payment/api/payment/get-razorpay-key');
        return data.key;
    };

    const handleNewAddressChange = (e) => {
        setNewAddressData({
            ...newAddressData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let shippingAddress;

            if (useNewAddress) {
                // Use new address from form
                shippingAddress = { ...newAddressData, phone };
            } else {
                // Use selected saved address
                const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
                if (!selectedAddress) {
                    alert('Please select an address');
                    setLoading(false);
                    return;
                }
                shippingAddress = {
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    zip: selectedAddress.zip,
                    country: selectedAddress.country,
                    phone
                };
            }

            const orderResponse = await api.post('/order/api/order', {
                shippingAddress,
            });

            // Updated API call to match backend route and include currency
            const paymentResponse = await api.post(`/payment/api/payment/create/${orderResponse.data.order._id}`, {
                currency: currency,
            });

            console.log("Payment Created:", paymentResponse.data);

            const options = {
                key: await fetchRazorpayKey(), // Fetch key from backend
                amount: paymentResponse.data.payment.price.amount * 100, // Amount in paise
                currency: paymentResponse.data.payment.price.currency,
                name: "Mega Project",
                description: "Test Transaction",
                order_id: paymentResponse.data.payment.paymentId, // Razorpay Order ID from backend
                handler: async function (response) {
                    try {
                        const verifyResponse = await api.post('/payment/api/payment/verify', {
                            razorpayorderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        });

                        if (verifyResponse.status === 200) {
                            alert('Payment Successful! Order placed.');
                            // Refresh cart count to 0 (or whatever backend says)
                            await fetchCartCount();
                            navigate('/orders');
                        }
                    } catch (error) {
                        alert('Payment Verification Failed');
                        console.error("Verification Error:", error);
                    }
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                    contact: phone
                },
                theme: {
                    color: "#66c297ff"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert(response.error.description);
            });
            rzp1.open();

        } catch (error) {
            alert(error.response?.data?.message || 'Failed to place order');
            console.error("Checkout Error:", error);
            navigate('/checkout');

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container" style={{ maxWidth: '48rem' }}>
                <h1 className="page-title">Checkout</h1>

                <div className="checkout-form-card">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div>
                            <h2 className="checkout-section-title">Shipping Address</h2>

                            {addresses.length > 0 && (
                                <>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
                                        Select a saved address or add a new one
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                        {addresses.map((address) => (
                                            <AddressCard
                                                key={address._id}
                                                address={address}
                                                selectable={!useNewAddress}
                                                selected={selectedAddressId === address._id && !useNewAddress}
                                                onSelect={setSelectedAddressId}
                                            />
                                        ))}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '1rem',
                                        background: 'rgba(135, 206, 250, 0.05)',
                                        borderRadius: '0.75rem',
                                        border: useNewAddress ? '2px solid #87ceeb' : '1px solid rgba(135, 206, 250, 0.2)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                        onClick={() => setUseNewAddress(!useNewAddress)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={useNewAddress}
                                            onChange={(e) => setUseNewAddress(e.target.checked)}
                                            style={{
                                                width: '1.25rem',
                                                height: '1.25rem',
                                                cursor: 'pointer',
                                                accentColor: '#87ceeb'
                                            }}
                                        />
                                        <label style={{
                                            color: useNewAddress ? '#87ceeb' : 'rgba(255, 255, 255, 0.8)',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            userSelect: 'none'
                                        }}>
                                            Use a new address
                                        </label>
                                    </div>
                                </>
                            )}

                            {useNewAddress && (
                                <div style={{ marginTop: addresses.length > 0 ? '2rem' : '0' }}>
                                    <h3 style={{
                                        color: '#87ceeb',
                                        marginBottom: '1.5rem',
                                        fontSize: '1.25rem'
                                    }}>
                                        Enter New Address
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <Input
                                            label="Address"
                                            name="street"
                                            placeholder="123 Main St"
                                            value={newAddressData.street}
                                            onChange={handleNewAddressChange}
                                            required={useNewAddress}
                                        />

                                        <div className="checkout-form-row">
                                            <Input
                                                label="City"
                                                name="city"
                                                placeholder="New York"
                                                value={newAddressData.city}
                                                onChange={handleNewAddressChange}
                                                required={useNewAddress}
                                            />

                                            <Input
                                                label="State"
                                                name="state"
                                                placeholder="NY"
                                                value={newAddressData.state}
                                                onChange={handleNewAddressChange}
                                            />
                                        </div>

                                        <div className="checkout-form-row">
                                            <Input
                                                label="ZIP Code"
                                                name="zip"
                                                placeholder="10001"
                                                value={newAddressData.zip}
                                                onChange={handleNewAddressChange}
                                            />

                                            <Input
                                                label="Country"
                                                name="country"
                                                placeholder="Country"
                                                value={newAddressData.country}
                                                onChange={handleNewAddressChange}
                                                required={useNewAddress}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Phone field - always shown */}
                            <div style={{ marginTop: '1.5rem' }}>
                                <Input
                                    label="Phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="checkout-divider">
                            <h2 className="checkout-section-title">Payment Method</h2>
                            <p className="checkout-payment-info">Payment will be processed securely</p>

                            {/* Currency Selection */}
                            <div className="checkout-form-row" style={{ marginTop: '1rem' }}>
                                <label htmlFor="currency" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Select Currency
                                </label>
                                <select
                                    name="currency"
                                    id="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e5e7eb',
                                        backgroundColor: '#f9fafb',
                                        fontSize: '1rem',
                                    }}
                                >
                                    <option value="INR">INR (Indian Rupee)</option>
                                    <option value="USD">USD (US Dollar)</option>
                                    <option value="EUR">EUR (Euro)</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="checkout-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
