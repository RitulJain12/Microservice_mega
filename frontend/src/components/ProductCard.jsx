import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from './Button';
import { formatPrice } from '../utils/formatters';
import '../pages/ProductsPage.css';

const ProductCard = ({ product }) => {
    const { addToCart, loading } = useCart();
    const [adding, setAdding] = useState(false);
    const [inCart, setInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // Handle different image field structures
    const getProductImage = () => {
        // Check if images array exists and has items
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            const firstImage = product.images[0];
            // If image is an object, try to get url/path property
            if (typeof firstImage === 'object' && firstImage !== null) {
                return firstImage.url || firstImage.path || firstImage.src || 'https://via.placeholder.com/300';
            }
            // If image is a string, return it directly
            return firstImage;
        }
        // Check if single image field exists
        if (product.image) {
            if (typeof product.image === 'object' && product.image !== null) {
                return product.image.url || product.image.path || product.image.src || 'https://via.placeholder.com/300';
            }
            return product.image;
        }
        // Fallback to placeholder
        return 'https://via.placeholder.com/300';
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (product.stock === 0 || adding) return;

        setAdding(true);
        const result = await addToCart(product._id, 1);

        if (result.success) {
            setInCart(true);
            setQuantity(1);
        } else {
            alert(result.error || 'Failed to add to cart');
        }
        setAdding(false);
    };

    const handleIncrement = async (e) => {
        e.preventDefault();
        if (quantity >= product.stock || adding) return;

        setAdding(true);
        const newQuantity = quantity + 1;
        const result = await addToCart(product._id, 1);

        if (result.success) {
            setQuantity(newQuantity);
        }
        setAdding(false);
    };

    const handleDecrement = async (e) => {
        e.preventDefault();
        if (quantity <= 1 || adding) return;

        setAdding(true);
        // For now, just update local state
        // TODO: Implement API call to decrease quantity
        setQuantity(quantity - 1);
        setAdding(false);
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card">
            {/* Product Image */}
            <div className="product-card-image-wrapper">
                <img
                    src={getProductImage()}
                    alt={product.title}
                    className="product-card-image"
                    onError={(e) => {
                        // Prevent infinite loop if fallback fails
                        if (e.target.src !== 'https://placehold.co/300?text=Product+Image') {
                            console.log('Image failed to load:', e.target.src);
                            e.target.src = 'https://placehold.co/300?text=Product+Image';
                        }
                    }}
                />
                {product.stock < 10 && product.stock > 0 && (
                    <div className="product-card-badge product-card-badge-warning">
                        Only {product.stock} left
                    </div>
                )}
                {product.stock === 0 && (
                    <div className="product-card-badge product-card-badge-danger">
                        Out of Stock
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="product-card-content">
                <h3 className="product-card-title">
                    {product.title}
                </h3>

                <p className="product-card-description">
                    {product.description}
                </p>

                <div className="product-card-footer">
                    <div className="product-price-container">
                        {product.discounted ? (
                            <>
                                <span className="product-card-price">
                                    {formatPrice(product.discountedprice, product.price?.currency)}
                                </span>
                                <span className="product-card-original-price" style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                                    {formatPrice(product.actualprice, product.price?.currency)}
                                </span>
                                <span className="product-card-discount-badge" style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold', marginLeft: '0.5rem' }}>
                                    ({product.discountpercentage}% OFF)
                                </span>
                            </>
                        ) : (
                            <span className="product-card-price">
                                {formatPrice(product.price?.amount || product.price, product.price?.currency)}
                            </span>
                        )}
                    </div>

                    {!inCart ? (
                        <Button
                            variant="primary"
                            className="product-card-add-btn"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || adding}
                        >
                            <ShoppingCart size={18} />
                            <span>{adding ? 'Adding...' : 'Add'}</span>
                        </Button>
                    ) : (
                        <div className="product-card-quantity-controls" onClick={(e) => e.preventDefault()}>
                            <button
                                className="product-card-quantity-btn"
                                onClick={handleDecrement}
                                disabled={quantity <= 1 || adding}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="product-card-quantity-value">{quantity}</span>
                            <button
                                className="product-card-quantity-btn"
                                onClick={handleIncrement}
                                disabled={quantity >= product.stock || adding}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
