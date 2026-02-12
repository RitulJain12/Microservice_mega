const express = require('express');
const Router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const cartController = require('../controllers/cart.controller');
const { validateAddItem, validateUpdateQuantity } = require('../middlewares/items.middleware');

//  /api/cart/items - Add item to cart
Router.post("/items", authMiddleware(["user"]), validateAddItem, cartController.addItemToCart);

// /api/cart/items/:productId - Update item quantity
Router.put("/items/:productId", authMiddleware(["user"]), validateUpdateQuantity, cartController.updateItemQuantityInCart);

//  api/cart/ - Get cart
Router.get("/", authMiddleware(["user"]), cartController.getCart);

///api/cart/items/:productId - Remove item from cart
Router.delete("/items/:productId", authMiddleware(["user"]), cartController.removeItemFromCart);

// api/cart/clear - Clear cart
Router.delete("/clear", authMiddleware(["user"]), cartController.clearCart);




module.exports = Router;
