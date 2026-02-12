import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, Crown } from 'lucide-react';
import api from '../config/api';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import './PremiumPage.css';

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

const PremiumPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadScript('https://checkout.razorpay.com/v1/checkout.js');
    }, []);

    const fetchRazorpayKey = async () => {
        const { data } = await api.get('/payment/api/payment/get-razorpay-key');
        return data.key;
    };

    const handleBuyPremium = async (plan) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Order
            const orderResponse = await api.post('/payment/api/payment/premium/checkout', {
                amount: plan.price,
                day: plan.days,
                currency: 'INR'
            });

            const { order, payment } = orderResponse.data;

            // 2. Open Razorpay
            const options = {
                key: await fetchRazorpayKey(),
                amount: order.amount,
                currency: order.currency,
                name: "Onkart Premium",
                description: `${plan.name} Membership`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyResponse = await api.post('/payment/api/payment/premium/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyResponse.status === 200) {
                            alert(`Welcome to Premium! Your ${plan.name} is now active.`);
                            navigate('/profile'); // Or reload to update state
                            window.location.reload();
                        }
                    } catch (error) {
                        console.error("Verification Error:", error);
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: user.fullName?.firstName + ' ' + user.fullName?.lastName,
                    email: user.email,
                },
                theme: {
                    color: "#FFD700"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert(response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error("Premium Checkout Error:", error);
            alert('Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            id: 1,
            name: 'Starter Premium',
            days: 30,
            price: 199,
            features: ['Get the LowestDeal Section','30 Days Access', '10% Extra Discount', 'Priority Support']
        },
        {
            id: 2,
            name: 'Standard Premium',
            days: 60,
            price: 299,
            popular: true,
            features: ['Get the LowestDeal Section','60 Days Access', 'Free Delivery', 'Exclusive Deals', 'Early Access to Sales']
        },
        {
            id: 3,
            name: 'Ultimate Premium',
            days: 365,
            price: 599,
            features: ['Get the LowestDeal Section', 'LowestDeal Notification when product at its lowest price','365 Days Access', 'All Benefits Included', 'Personal AI Assistant','Top 10 Deals','Early Access to Sales',]
        }
    ];

    return (
        <div className="premium-page">
            <div className="premium-header">
                <Crown size={64} className="premium-icon" />
                <h1 className="premium-title">Join Premium</h1>
                <p className="premium-subtitle">Unlock exclusive access to AI-curated deals, lowest prices, and special discounts.</p>
            </div>

            <div className="premium-plans-container">
                {plans.map((plan) => (
                    <div key={plan.id} className={`premium-card ${plan.popular ? 'popular' : ''}`}>
                        {plan.popular && <div className="popular-badge">Most Popular</div>}
                        <h3 className="plan-name">{plan.name}</h3>
                        <div className="plan-price">
                            <span className="currency">₹</span>
                            <span className="amount">{plan.price}</span>
                            <span className="duration">/{plan.days} days</span>
                        </div>
                        <ul className="plan-features">
                            {plan.features.map((feature, index) => (
                                <li key={index}>
                                    <Check size={16} className="feature-icon" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Button
                            variant={plan.popular ? 'primary' : 'secondary'}
                            className="plan-button"
                            onClick={() => handleBuyPremium(plan)}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Choose Plan'}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PremiumPage;
