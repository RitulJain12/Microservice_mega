const cartModel = require('../models/Cart.model');
const axios = require('axios');

async function addItemToCart(req, res) {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    console.log('=== Add Item to Cart Request ===');
    console.log('User ID:', userId);
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);

    try {
        // Fetch product details from product service
        let { product } = (await axios.get(`http://localhost:3001/api/product/${productId}`)).data;
        console.log('Product fetched:', product.title);

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            console.log('Creating new cart for user');
            cart = new cartModel({
                user: userId,
                items: [{
                    productId: productId.toString(),
                    quantity,
                    title: product.title,
                    images: product.images,
                    price: product.price,
                    stock: product.stock
                }],
            });
        }
        else {
            console.log('Cart exists with', cart.items.length, 'items');

            // Compare productId as strings
            const itemIndex = cart.items.findIndex(item => {
                const match = item.productId.toString() === productId.toString();
                console.log(`Comparing ${item.productId} === ${productId}: ${match}`);
                return match;
            });

            if (itemIndex > -1) {
                console.log('Item already exists, updating quantity');
                console.log('Old quantity:', cart.items[itemIndex].quantity);
                cart.items[itemIndex].quantity += quantity;
                // Update product details in case they changed
                cart.items[itemIndex].title = product.title;
                cart.items[itemIndex].images = product.images;
                cart.items[itemIndex].price = product.price;
                cart.items[itemIndex].stock = product.stock;
                console.log('New quantity:', cart.items[itemIndex].quantity);
            }
            else {
                console.log('Adding new item to cart');
                cart.items.push({
                    productId: productId.toString(),
                    quantity,
                    title: product.title,
                    images: product.images,
                    price: product.price,
                    stock: product.stock
                });
            }
        }

        await cart.save();
        console.log('Cart saved successfully. Total items:', cart.items.length);

        return res.status(200).json({
            message: 'Item added to cart successfully',
            cart,
            totals: {
                itemCount: cart.items.length,
                totalQuantity: cart.items.reduce((acc, item) => acc + item.quantity, 0)
            }
        });
    }
    catch (error) {
        console.error('Error adding item to cart:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}


async function updateItemQuantityInCart(req, res) {
    const { quantity } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;

    console.log('=== Update Item Quantity Request ===');
    console.log('User ID:', userId);
    console.log('Product ID:', productId);
    console.log('New Quantity:', quantity);
    console.log('Quantity Type:', typeof quantity);

    try {
        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            console.log('Cart not found for user:', userId);
            return res.status(404).json({ message: 'Cart not found' });
        }

        console.log('Cart found with', cart.items.length, 'items');

        const itemIndex = cart.items.findIndex(item => {
            const match = item.productId.toString() === productId;
            console.log(`Comparing ${item.productId.toString()} === ${productId}: ${match}`);
            return match;
        });

        if (itemIndex === -1) {
            console.log('Item not found in cart. Available product IDs:',
                cart.items.map(item => item.productId.toString()));
            return res.status(404).json({
                message: 'Item not found in cart',
                availableItems: cart.items.map(item => item.productId.toString())
            });
        }

        console.log('Updating item at index:', itemIndex);
        console.log('Old quantity:', cart.items[itemIndex].quantity);

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        console.log('Item quantity updated successfully');
        console.log('New quantity:', cart.items[itemIndex].quantity);

        return res.status(200).json({
            message: 'Item quantity updated successfully',
            cart,
            totals: {
                itemCount: cart.items.length,
                totalQuantity: cart.items.reduce((acc, item) => acc + item.quantity, 0)
            }
        });
    }
    catch (error) {
        console.error('Error updating item quantity in cart:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}



async function getCart(req, res) {
    const userId = req.user.id;
    try {
        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = new cartModel({
                user: userId,
                items: [],
            });
            await cart.save();
        }
        // console.log('Cart retrieved:',cart);
        return res.status(200).json({ cart, totals: { itemCount: cart.items.length, totalQuantity: cart.items.reduce((acc, item) => acc + item.quantity, 0) } });
    }

    catch (error) {
        console.error('Error retrieving cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function removeItemFromCart(req, res) {
    const { productId } = req.params;
    const userId = req.user.id;
    try {
        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();
        return res.status(200).json({ message: 'Item removed from cart successfully', cart });
    }
    catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function clearCart(req, res) {
    const userId = req.user.id;
    try {
        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        return res.status(200).json({ message: 'Cart cleared successfully', cart });
    }
    catch (error) {
        console.error('Error clearing cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {

    addItemToCart,
    updateItemQuantityInCart,
    getCart,
    removeItemFromCart,
    clearCart

};