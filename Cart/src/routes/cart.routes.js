const express=require('express');
const Router=express.Router();
const authMiddleware=require('../middlewares/auth.middleware');
const cartController=require('../controllers/cart.controller');
const itemValidation=require('../middlewares/items.middleware');

//  /api/cart/items
Router.post("/items",authMiddleware(["user"]),itemValidation,cartController.addItemToCart);

// /api/cart/items/:productId
Router.patch("/items/:productId",authMiddleware(["user"]),itemValidation,cartController.updateItemQuantityInCart);

//  api/cart/
Router.get("/",authMiddleware(["user"]),cartController.getCart);

///api/cart/items/:productId
Router.delete("/items/:productId",authMiddleware(["user"]),cartController.removeItemFromCart);

// api/cart/clear
Router.delete("/clear",authMiddleware(["user"]),cartController.clearCart);





module.exports=Router;
