const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');
const Validation=require('../middlewares/shippingaddress.validation');

// /api/order/ - Create a new order
router.post('/',authMiddleware(['user']),Validation.shippingAddressValidationRules,orderController.createOrder);

// /api/order/me Get orders for the authenticated user
router.get('/me',authMiddleware(['user','seller']),orderController.getUserOrders);

// /api/order/:id - Get order by ID (for admin)
router.get('/:id',authMiddleware(['admin','user']),orderController.getOrderById);

// /api/order/:id/cancel - Cancel order by ID (for user)
router.patch('/:id/cancel',authMiddleware(['user']),orderController.cancelOrder);

// /api/order/:id/address - Update shipping address for an order (for user)
router.patch('/:id/address',authMiddleware(['user']),Validation.shippingAddressValidationRules,orderController.updateShippingAddress);





module.exports = router;