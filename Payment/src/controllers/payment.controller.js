const axios = require('axios');
require('dotenv').config();
const paymentModel = require('../models/payment.model');
const Razorpay = require('razorpay');
const { verify } = require('jsonwebtoken');
const RabbitMq = require('../queue/broker');
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_ID_SECRET,
});


// Create a new payment

async function createPayment(req, res) {

  const userId = req.user.id;
  try {
    const orderId = req.params.id;
    //console.log("Creating payment for Order ID:", orderId, "by User ID:", userId);
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    const orderResponse = await axios.get(`http://localhost:3003/api/order/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const orderData = orderResponse.data;
    // console.log("Order Data:", orderData.order.items);
    const price = orderData.order.totalAmount;

    // Use currency from request body or default to INR
    const currency = req.body.currency || "INR";
    console.log("Total Price:", price);
    console.log("Currency:", currency);
    const order = await razorpayInstance.orders.create({
      amount: price * 100,
      currency: currency,
      // receipt: `receipt_order_${orderId}`,
    });
    const payment = new paymentModel({
      order: orderId,
      paymentId: order.id,
      user: userId,
      price: {
        amount: price,
        currency: currency,
      },
      status: 'Pending',
    });
    await payment.save();
    return res.status(201).json({ message: "Payment Created Successfully", payment });
  }
  catch (err) {
    console.error("Create Payment Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }


}

// Verify a payment
async function verifyPayment(req, res) {
  const { razorpayorderId, paymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_ID_SECRET;
  try {
    const { validatePaymentVerification } = require('../../node_modules/razorpay/dist/utils/razorpay-utils');
    const result = validatePaymentVerification({
      "order_id": razorpayorderId,
      "payment_id": paymentId,
    }, signature, secret);

    if (result) {
      const payment = await paymentModel.findOne({ paymentId: razorpayorderId });
      if (!payment) return res.status(404).json({ message: "Payment not found" });

      payment.paymentId = paymentId;
      payment.signature = signature;
      payment.status = 'Completed';
      await payment.save();

      RabbitMq.publishToQueue('PAYMENT_SUCCESSFULL_QUEUE', {
        paymentId,
      });

      try {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        const orderResponse = await axios.get(`http://localhost:3003/api/order/${payment.order}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const orderData = orderResponse.data.order;

        if (orderData && orderData.items) {
          const items = orderData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }));

          await axios.post(`http://localhost:3001/api/product/decrease-stock`, { items }, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      } catch (stockError) {
        console.error("Failed to update stock:", stockError.message);
      }

      res.status(200).json({ status: 'success' });
    }
    else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    RabbitMq.publishToQueue('PAYMENT_UNSUCCESSFULL_QUEUE', {
      paymentId
    });
    console.log(error);
    res.status(500).send('Error verifying payment');
  }
}

async function createPremiumPayment(req, res) {
  try {
    const { amount, currency = "INR", day } = req.body;
    const userId = req.user.id;

    if (!amount || !day) {
      return res.status(400).json({ message: "Amount and Day are required" });
    }

    const options = {
      amount: amount * 100, // amount in paisa
      currency: currency,
      receipt: `prem_${userId.slice(-6)}_${Date.now()}`,
      notes: {
        type: "PREMIUM",
        days: day,
        userId: userId
      }
    };

    const order = await razorpayInstance.orders.create(options);

    const payment = new paymentModel({
      paymentId: order.id,
      user: userId,
      price: {
        amount: amount,
        currency: currency
      },
      status: 'Pending',
      type: 'PREMIUM',
      days: day
    });

    await payment.save();

    return res.status(201).json({
      message: "Premium Payment Order Created",
      order,
      payment
    });

  } catch (error) {
    console.error("Create Premium Payment Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function verifyPremiumPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_ID_SECRET;

  try {
    const { validatePaymentVerification } = require('../../node_modules/razorpay/dist/utils/razorpay-utils');
    const isValid = validatePaymentVerification({
      "order_id": razorpay_order_id,
      "payment_id": razorpay_payment_id
    }, razorpay_signature, secret);

    if (isValid) {
      const payment = await paymentModel.findOne({ paymentId: razorpay_order_id });
      if (!payment) return res.status(404).json({ message: "Payment record not found" });

      payment.paymentId = razorpay_payment_id;
      payment.signature = razorpay_signature;
      payment.status = 'Completed';
      await payment.save();

      // Notify Auth Service to upgrade user
      try {
        // Determine Auth Service URL
        const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';

        await axios.post(`${authServiceUrl}/auth/internal/upgrade`, {
          userId: payment.user,
          day: payment.days
        });

        // Publish event to RabbitMQ if needed (optional)
        RabbitMq.publishToQueue('PREMIUM_UPGRADE_SUCCESS', {
          userId: payment.user,
          days: payment.days
        });

      } catch (authError) {
        console.error("Failed to call Auth Service for premium upgrade:", authError.message);
        // Note: Payment is successful but upgrade failed. 
        // In production, we should have a retry mechanism or alert.
        return res.status(200).json({
          message: "Payment successful, but premium activation delayed. Please contact support.",
          paymentId: razorpay_payment_id
        });
      }

      return res.status(200).json({
        message: "Premium Activated Successfully",
        paymentId: razorpay_payment_id
      });

    } else {
      return res.status(400).json({ message: "Invalid Signature" });
    }

  } catch (error) {
    console.error("Verify Premium Payment Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


async function getRazorpayKey(req, res) {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
}

module.exports = {
  createPayment,
  verifyPayment,
  getRazorpayKey,
  createPremiumPayment,
  verifyPremiumPayment
}