import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import api from '../config/api';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import './ProductsPage.css';

const getCategory = (product) => {
    const title = product.title.toLowerCase();
    const desc = product.description.toLowerCase();
    
    if (title.includes('sofa') || title.includes('table') || title.includes('bottle') || title.includes('mug') || title.includes('candle') || title.includes('lamp') || title.includes('glass')) {
        return 'Home & Living';
    }
    if (title.includes('honey') || title.includes('coffee') || title.includes('tea') || title.includes('chocolate') || title.includes('butter') || title.includes('oil')) {
        return 'Groceries & Food';
    }
    if (title.includes('shampoo') || title.includes('toothbrush') || title.includes('shoes') || title.includes('backpack') || title.includes('towel') || title.includes('bag')) {
        return 'Fashion & Wellness';
    }
    if (title.includes('headphone') || title.includes('macbook') || title.includes('mouse') || title.includes('sleeve') || title.includes('watch')) {
        return 'Electronics & Office';
    }
    return 'Other';
};

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    // Filtering states
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOption, setSortOption] = useState('default');
    const [priceRange, setPriceRange] = useState(30000);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

        // Search filter
        if (searchQuery.trim()) {
            result = result.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'All') {
            result = result.filter(product => getCategory(product) === selectedCategory);
        }

        // Price filter
        result = result.filter(product => product.price.amount <= priceRange);

        // Sorting
        if (sortOption === 'price_asc') {
            result = [...result].sort((a, b) => a.price.amount - b.price.amount);
        } else if (sortOption === 'price_desc') {
            result = [...result].sort((a, b) => b.price.amount - a.price.amount);
        } else if (sortOption === 'name_asc') {
            result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        }

        setFilteredProducts(result);
    }, [searchQuery, products, selectedCategory, sortOption, priceRange]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/product/api/product');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Home & Living', 'Groceries & Food', 'Fashion & Wellness', 'Electronics & Office'];

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

                    <Button 
                        variant="secondary" 
                        className={`products-filter-btn ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={20} />
                        <span>Filters</span>
                    </Button>
                </div>

                {/* Category Tabs */}
                <div className="category-tabs">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Filters Drawer/Panel */}
                {showFilters && (
                    <div className="filters-panel">
                        <div className="filter-group">
                            <label className="filter-label">
                                Max Price: <span className="price-value">₹{priceRange.toLocaleString()}</span>
                            </label>
                            <input
                                type="range"
                                min="100"
                                max="30000"
                                step="100"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="price-slider"
                            />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Sort By</label>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="sort-select"
                            >
                                <option value="default">Featured</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="name_asc">Name: A-Z</option>
                            </select>
                        </div>
                        <div className="filter-group reset-group">
                            <Button 
                                variant="secondary" 
                                onClick={() => {
                                    setPriceRange(30000);
                                    setSortOption('default');
                                    setSelectedCategory('All');
                                    setSearchQuery('');
                                }}
                                className="reset-filters-btn"
                            >
                                <RotateCcw size={16} />
                                <span>Reset Filters</span>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="products-empty">
                        <p className="products-empty-text">No products found matching your criteria</p>
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
