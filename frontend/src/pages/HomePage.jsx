import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Sparkles, Activity, Crown, Award } from 'lucide-react';
import { motion } from 'framer-motion';
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
                setRecommendedProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch recommended products:', error);
            setRecommendedProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Animation configurations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 80,
                damping: 15
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
            {/* Hero Section */}
            <section className="home-hero">
                <motion.div 
                    className="home-hero-content"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
                >
                    <div className="home-logo-container">
                        <ShoppingCart className="home-logo-icon" size={28} />
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, letterSpacing: '0.12em', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            The Digital Atelier
                        </span>
                    </div>

                    <h1 className="home-title">Onkart</h1>

                    <p className="home-subtitle">
                        An editorial catalog engineered with agentic behavior modeling. Experience personalized curation powered by real-time interest and dwell-time analytics.
                    </p>

                    <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
                        <Link to="/products">
                            <Button variant="primary">
                                Explore Catalog
                                <ArrowRight size={16} />
                            </Button>
                        </Link>
                        {!user && (
                            <Link to="/register">
                                <Button variant="secondary">Join Now</Button>
                            </Link>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* Explanation & Features Section */}
            <section className="home-intro-section">
                <div className="home-intro-grid">
                    <div className="home-intro-brand">
                        <span>Intelligent Curation</span>
                        <h2>Hyper-personalized shopping driven by your interactions.</h2>
                        <p>
                            Onkart rejects static templates. We capture behavioral interest maps like your dwell-time to dynamically calibrate suggestions using advanced AI Agents and Retrieval-Augmented Generation (RAG).
                        </p>
                    </div>

                    <div className="home-features">
                        <div className="home-feature-card">
                            <Activity className="home-feature-icon" size={28} />
                            <h3 className="home-feature-title">Dwell-Time Analytics</h3>
                            <p className="home-feature-description">
                                Our platform measures your engagement indicators in real time to recommend products tailored exactly to your active curation interests.
                            </p>
                        </div>

                        <div className="home-feature-card">
                            <Crown className="home-feature-icon" size={28} style={{ color: 'var(--accent-terracotta)' }} />
                            <h3 className="home-feature-title">AI Buddy Assistant</h3>
                            <p className="home-feature-description">
                                Premium users unlock a conversational shopping companion that tracks discount thresholds, finds the absolute lowest prices, and adds items to the cart automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommended Products Section */}
            <section style={{ padding: '6rem 2rem 0' }}>
                <div className="container" style={{ maxWidth: '1400px' }}>
                    <div className="section-title-wrapper">
                        <span className="section-tag">{user ? 'Personalized Selects' : 'Curated Masterpieces'}</span>
                        <h2 className="section-title">
                            {user ? 'Recommended For You' : 'The Seasonal Collection'}
                        </h2>
                    </div>

                    {loading ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '6rem',
                            color: 'var(--text-secondary)',
                            fontFamily: 'Space Grotesk',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            fontSize: '0.8rem'
                        }}>
                            Analyzing interactions & compiling collection...
                        </div>
                    ) : recommendedProducts.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '6rem',
                            background: 'var(--surface-lowest)',
                            border: '1px dashed var(--outline-color)',
                            borderRadius: '4px',
                            color: 'var(--text-secondary)'
                        }}>
                            <Award size={36} style={{ color: 'var(--accent-slate-green)', margin: '0 auto 1.5rem', opacity: 0.6 }} />
                            <p style={{ marginBottom: '2rem', fontFamily: 'Newsreader', fontSize: '1.25rem', fontStyle: 'italic' }}>
                                Start browsing products to populate your personalized edit.
                            </p>
                            <Link to="/products">
                                <Button variant="primary">Browse All Products</Button>
                            </Link>
                        </div>
                    ) : (
                        <motion.div 
                            className="products-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                                gap: '3rem 2.5rem'
                            }}
                        >
                            {recommendedProducts.map((product) => (
                                <motion.div key={product._id} variants={itemVariants}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
