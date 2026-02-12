const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');

// /api/payment/create/:id
router.post('/create/:id', authMiddleware(['user']), paymentController.createPayment);

// /api/payment/verify
router.post('/verify', authMiddleware(['user']), paymentController.verifyPayment);

// /api/payment/get-razorpay-key
router.get('/get-razorpay-key', authMiddleware(['user']), paymentController.getRazorpayKey);

// /api/payment/premium/checkout
router.post('/premium/checkout', authMiddleware(['user']), paymentController.createPremiumPayment);

// /api/payment/premium/verify
router.post('/premium/verify', authMiddleware(['user']), paymentController.verifyPremiumPayment);








module.exports = router;