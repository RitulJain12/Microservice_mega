import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Fetch cart count
    const fetchCartCount = async () => {
        if (!user) {
            console.log('No user logged in, skipping cart fetch');
            setCartCount(0);
            return;
        }

        try {
            console.log('Fetching cart count...');
            const response = await api.get('/cart/api/cart');
            console.log('Cart response:', response.data);

            // Use new API response structure with totals
            if (response.data.totals?.totalQuantity !== undefined) {
                // New format: { cart, totals: { itemCount, totalQuantity } }
                const totalCount = response.data.totals.totalQuantity;
                console.log('Cart count updated to (from API totals):', totalCount);
                setCartCount(totalCount);
            } else {
                // Fallback: calculate manually for backward compatibility
                const items = response.data.cart?.items || response.data?.items || [];
                const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
                console.log('Cart count updated to (calculated):', totalCount);
                setCartCount(totalCount);
            }
        } catch (error) {
            console.error('Failed to fetch cart count:', error);
            setCartCount(0);
        }
    };

    // Add item to cart
    const addToCart = async (productId, quantity = 1) => {
        setLoading(true);
        try {
            console.log('Adding to cart:', productId, 'quantity:', quantity);
            const response = await api.post('/cart/api/cart/items', {
                productId,
                quantity,
            });
            console.log('Item added successfully:', response.data);

            // Update cart count from response if available
            if (response.data.totals?.totalQuantity !== undefined) {
                setCartCount(response.data.totals.totalQuantity);
            } else {
                // Fallback: refresh cart count
                await fetchCartCount();
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to add to cart:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to add to cart'
            };
        } finally {
            setLoading(false);
        }
    };

    // Fetch cart count on mount and when user changes
    useEffect(() => {
        console.log('User changed, fetching cart count. User:', user?.email);
        fetchCartCount();
    }, [user]);

    const value = {
        cartCount,
        addToCart,
        fetchCartCount,
        loading,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
