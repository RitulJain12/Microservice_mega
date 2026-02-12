import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../config/api';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import './ProductsPage.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = products.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery, products]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/product/api/product');
            console.log('Full product data:', response.data.data);
            console.log('First product:', response.data.data[0]);
            console.log('First product images:', response.data.data[0]?.images);
            setProducts(response.data.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--sky-blue-400)', fontSize: '1.25rem' }}>Loading products...</div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="container" style={{ maxWidth: '80rem' }}>
                {/* Header */}
                <div className="products-header">
                    <h1 className="products-title">All Products</h1>
                    <p className="products-subtitle">Discover amazing products at great prices</p>
                </div>

                {/* Search and Filters */}
                <div className="products-search-bar">
                    <div className="products-search-wrapper">
                        <Search className="products-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field products-search-input"
                        />
                    </div>

                    <Button variant="secondary" className="products-filter-btn">
                        <Filter size={20} />
                        <span>Filters</span>
                    </Button>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="products-empty">
                        <p className="products-empty-text">No products found</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
