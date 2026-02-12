import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <div className="navbar-logo-text">Onkart</div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="navbar-nav">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `navbar-nav-link ${isActive ? 'active' : ''}`}
                            end
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/products"
                            className={({ isActive }) => `navbar-nav-link ${isActive ? 'active' : ''}`}
                        >
                            Products
                        </NavLink>
                        {user?.ispremium ? (
                            <NavLink
                                to="/loot-deals"
                                className={({ isActive }) => `navbar-nav-link ${isActive ? 'active' : ''}`}
                                style={{
                                    color: '#ffd700',
                                    fontWeight: 'bold',
                                    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                                }}
                            >
                                Loot Deals
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/premium"
                                className={({ isActive }) => `navbar-nav-link ${isActive ? 'active' : ''}`}
                                style={{ color: '#ffd700', fontWeight: 'bold' }}
                            >
                                Join Premium
                            </NavLink>
                        )}
                        {user && (
                            <NavLink
                                to="/orders"
                                className={({ isActive }) => `navbar-nav-link ${isActive ? 'active' : ''}`}
                            >
                                Orders
                            </NavLink>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="navbar-actions">
                        {user ? (
                            <>
                                <Link to="/cart" className="navbar-cart-btn">
                                    <ShoppingCart size={24} />
                                    <span className="navbar-cart-badge">{cartCount}</span>
                                </Link>

                                <div className="navbar-user-menu">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="navbar-user-btn"
                                    >
                                        <User size={24} />
                                    </button>

                                    {userMenuOpen && (
                                        <div className="navbar-user-dropdown">
                                            <div className="navbar-user-info">
                                                <p className="navbar-user-info-label">Signed in as</p>
                                                <p className="navbar-user-info-email">{user.email}</p>
                                            </div>
                                            <Link to="/profile" className="navbar-user-dropdown-link">
                                                Profile
                                            </Link>
                                            <button onClick={handleLogout} className="navbar-user-dropdown-btn">
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => navigate('/login')}>
                                    Login
                                </Button>
                                <Button variant="primary" onClick={() => navigate('/register')}>
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="navbar-mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="navbar-mobile-menu">
                    <div className="navbar-mobile-menu-content">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `navbar-mobile-menu-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                            end
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/products"
                            className={({ isActive }) => `navbar-mobile-menu-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Products
                        </NavLink>
                        {user && (
                            <>
                                <NavLink
                                    to="/cart"
                                    className={({ isActive }) => `navbar-mobile-menu-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Cart
                                </NavLink>
                                <NavLink
                                    to="/orders"
                                    className={({ isActive }) => `navbar-mobile-menu-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Orders
                                </NavLink>
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) => `navbar-mobile-menu-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </NavLink>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="navbar-mobile-menu-btn"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        {!user && (
                            <div className="navbar-mobile-menu-actions">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        navigate('/login');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        navigate('/register');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
