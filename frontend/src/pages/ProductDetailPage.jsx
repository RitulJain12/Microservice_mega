import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import api from '../config/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import './ProductDetailPage.css';

import ProductCard from '../components/ProductCard';

// ... existing imports

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        fetchProduct();
        fetchSimilarProducts();
    }, [id]);

    const hasFetchedSimilar = React.useRef(false);
    const currencyLogo={
        "inr":"₹",
        "usd":"$",
        "eur":"€",
        "gbp":"£",
        "jpy":"¥",
        "cny":"¥",
        "krw":"₩",
        "cad":"$",
        "aud":"$",
        "nzd":"$",
        "chf":"Fr",
        "hkd":"$",
        "sgd":"$",
        "mxn":"$",
        "brl":"R$",
        "rub":"₽",
        "try":"₺",
        "sek":"kr",
        "nkr":"kr",
        "dkk":"kr",
        "nok":"kr",
        "pln":"zł",
        "czk":"Kč",
        "huf":"Ft",
        "thb":"฿",
        "myr":"RM",
        "php":"₱",
        "idr":"Rp",
        "twd":"$",
        "inr":"₹",
        "usd":"$",
        "eur":"€",
        "gbp":"£",
        "jpy":"¥",
        "cny":"¥",
        "krw":"₩",
        "cad":"$",
        "aud":"$",
        "nzd":"$",
        "chf":"Fr",
        "hkd":"$",
        "sgd":"$",
        "mxn":"$",
        "brl":"R$",
        "rub":"₽",
        "try":"₺",
        "sek":"kr",
        "nkr":"kr",
        "dkk":"kr",
        "nok":"kr",
        "pln":"zł",
        "czk":"Kč",
        "huf":"Ft",
        "thb":"฿",
        "myr":"RM",
        "php":"₱",
        "idr":"Rp",
        "twd":"$",
    }
    useEffect(() => {
        if (!user || !id) return;

        // Track entry
        const startTime = Date.now();
        console.log(`Tracking entry for product ${id} at ${startTime}`);

        api.post('/recommendations/entry', {
            productId: id,
            userId: user.id
        }).catch(err => console.error('Failed to track entry:', err));

        // Track exit on unmount or id change
        return () => {
            const exitTime = Date.now();
            const duration = exitTime - startTime;
            console.log(`Tracking exit for product ${id} at ${exitTime}, duration: ${duration}ms`);

            // Ignore visits shorter than 1 second (e.g. strict mode double render or accidental clicks)
            if (duration > 1000) {
                api.post('/recommendations/exit', {
                    productId: id,
                    userId: user.id
                }).catch(err => console.error('Failed to track exit:', err));
            } else {
                console.log('Duration too short, skipping exit tracking');
            }
        };
    }, [id, user]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/product/api/product/${id}`);
            console.log("Product API Response:", response.data);
            setProduct(response.data.product);
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarProducts = async () => {
        try {
            console.log('Fetching similar products for:', id);
            const response = await api.get(`/product/api/product/similar/${id}`);

            let similarData = response.data.products;

            // Handle case where data might be a string (as reported by user)
            if (typeof similarData === 'string') {
                try {
                    similarData = JSON.parse(similarData);
                } catch (e) {
                    console.error('Failed to parse similar products string:', e);
                    similarData = [];
                }
            }

            setSimilarProducts(similarData || []);
        } catch (error) {
            console.error('Failed to fetch similar products:', error);
        }
    };

    const getProductImages = () => {
        if (!product || !product.images) return [];

        // If images is an array
        if (Array.isArray(product.images)) {
            if (product.images.length === 0) return ['https://placehold.co/600?text=No+Image'];

            return product.images.map(img => {
                if (typeof img === 'string') return img;
                if (typeof img === 'object') return img.url || img.path || img.src || 'https://placehold.co/600?text=Product+Image';
                return 'https://placehold.co/600?text=Product+Image';
            });
        }

        // If single image property exists
        if (product.image) {
            if (typeof product.image === 'string') return [product.image];
            if (typeof product.image === 'object') return [product.image.url || product.image.path || product.image.src];
        }

        return ['https://placehold.co/600?text=No+Image'];
    };

    const handleAddToCart = async () => {
        if (!product || addingToCart || product.stock === 0) return;
        setAddingToCart(true);

        try {
            const result = await addToCart(product._id, quantity);
            if (result.success) {
                alert('Product added to cart!');
            } else {
                alert(result.error || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            alert('An unexpected error occurred');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="loader">Loading...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Product not found</h2>
                <Button variant="primary" onClick={() => navigate('/products')}>Browse Products</Button>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="container" style={{ maxWidth: '80rem' }}>
                {/* Product Detail Grid */}
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/products')}
                    style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', background: 'none' }}
                >
                    <ArrowLeft size={20} />
                    <span>Back to Products</span>
                </Button>

                {/* Product Detail Grid */}
                <div className="product-detail-grid">
                    {/* ... existing logic ... */}
                    <div className="product-detail-gallery">
                        {/* ... */}
                        <div className="product-detail-gallery-container">
                            {/* Vertical Thumbnail Sidebar */}
                            {getProductImages().length > 1 && (
                                <div className="product-detail-thumbnails-sidebar">
                                    {getProductImages().map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`product-detail-thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.title} ${index + 1}`}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/150';
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image with Zoom */}
                            <div className="product-detail-main-image">
                                <div className="product-detail-main-image-wrapper">
                                    <img
                                        src={getProductImages()[selectedImage]}
                                        alt={product.title}
                                        className="product-detail-main-img"
                                        onError={(e) => {
                                            console.log('Image failed to load:', e.target.src);
                                            e.target.src = 'https://via.placeholder.com/600';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-detail-info">
                        <h1 className="product-detail-title">{product.title}</h1>

                        <div className="product-detail-price-stock">
                            <span className="product-detail-price">{currencyLogo[product.price?.currency.toLowerCase()]}{product.price?.amount || product.price}</span>
                            {product.stock > 0 ? (
                                <span className="product-detail-stock in-stock">In Stock ({product.stock} available)</span>
                            ) : (
                                <span className="product-detail-stock out-of-stock">Out of Stock</span>
                            )}
                        </div>

                        <div className="product-detail-description-card">
                            <h2 className="product-detail-description-title">Description</h2>
                            <p className="product-detail-description-text">{product.description}</p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="product-detail-quantity">
                            <label className="product-detail-quantity-label">Quantity</label>
                            <div className="product-detail-quantity-controls">
                                <button
                                    className="product-detail-quantity-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="product-detail-quantity-value">{quantity}</span>
                                <button
                                    className="product-detail-quantity-btn"
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            variant="primary"
                            className="product-detail-add-to-cart"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || addingToCart}
                        >
                            <ShoppingCart size={24} />
                            <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                        </Button>
                    </div>
                </div>

                {/* Similar Products Section */}
                {/* {similarProducts.length > 0 && (
                    <div className="similar-products-section" style={{ marginTop: '4rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Similar Products</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '2rem'
                        }}>
                            {similarProducts.map(prod => (
                                <ProductCard key={prod._id} product={prod} />
                            ))}
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default ProductDetailPage;
