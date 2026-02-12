import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import './HomePage.css';

const HomePage = () => {
    const { user } = useAuth();
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecommendedProducts();
    }, [user]);

    const fetchRecommendedProducts = async () => {
        try {
            setLoading(true);
            // Only fetch recommendations if user is logged in
            if (user) {
                const response = await api.get('/recommendations/', { params: { userId: user.id } });
                console.log("Recommended API Response:", response.data);

                let products = [];
                if (Array.isArray(response.data)) {
                    products = response.data;
                } else if (response.data && Array.isArray(response.data.products)) {
                    products = response.data.products;
                }

                console.log("Processed Recommended Products:", products);
                setRecommendedProducts(products);
            } else {
                // For non-logged-in users, don't call the API
                setRecommendedProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch recommended products:', error);
            setRecommendedProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Hero Section */}
            <section className="home-hero">
                <div className="home-hero-content">
                    <div className="home-logo-container">
                        <ShoppingCart className="home-logo-icon" size={32} />
                        <h1 className="home-title">Onkart</h1>
                    </div>

                    <p className="home-subtitle">
                      Our specialty is recommending products based on user dwell-time behavior. Premium users also get an AI-powered feature that filters products currently at their lowest price and can even add them to the cart automatically.It recommend products based on your interest and behavior with the help of AI agents and RAG.
                    </p>
                </div>
            </section>

            {/* Recommended Products Section */}
            <section style={{ padding: '4rem 1rem' }}>
                <div className="container" style={{ maxWidth: '80rem' }}>
                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, var(--sky-blue-400), var(--sky-blue-600))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '1rem'
                        }}>
                            {user ? 'Recommended For You' : 'Popular Products'}
                        </h2>
                    </div>

                    {loading ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem',
                            color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                            Loading recommendations...
                        </div>
                    ) : recommendedProducts.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem',
                            color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                            <p style={{ marginBottom: '1.5rem' }}>No recommendations available yet.</p>
                            <Link to="/products">
                                <Button variant="primary">Browse All Products</Button>
                            </Link>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem'
                        }}>
                            {recommendedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};


export default HomePage;
