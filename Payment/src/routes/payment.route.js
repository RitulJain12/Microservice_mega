const express=require('express');
const router=express.Router();
const authMiddleware=require('../middlewares/auth.middleware');
const paymentController=require('../controllers/payment.controller');

// /api/payment/create/:id
router.post('/create/:id',authMiddleware(['user']),paymentController.createPayment);

// /api/payment/verify
router.post('/verify',authMiddleware(['user']),paymentController.verifyPayment);








module.exports=router;