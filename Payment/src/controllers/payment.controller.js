const axios=require('axios');
require('dotenv').config();
const paymentModel = require('../models/payment.model');
const Razorpay = require('razorpay');
const { verify } = require('jsonwebtoken');
   const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
   });


  // Create a new payment

async function createPayment(req, res){
 
   const userId = req.user.id;
   try{
    const orderId=req.params.id;
    //console.log("Creating payment for Order ID:", orderId, "by User ID:", userId);
    const token=req.cookies.token|| req.headers['authorization']?.split(' ')[1];
const orderResponse=await axios.get(`http://localhost:3003/api/orders/${orderId}`,{
    headers:{   'Authorization':`Bearer ${token}` }
});
   const orderData=orderResponse.data;
 // console.log("Order Data:", orderData.order.items);
  const price=orderData.order.totalAmount;
//  const currency=orderData.order.items[0].price.currency||"INR";
  console.log("Total Price:", price);
  console.log("Currency:", currency);
   const order= await razorpayInstance.orders.create({
    amount: price*100,
    currency: currency,
    receipt: `receipt_order_${orderId}`,
    });
  const payment=new paymentModel({
    order:orderId,
    paymentId:order.id,
    user:userId,
    price:{
        amount:price,
        currency:currency,
    },
    status:'Pending',
  });
    await payment.save();
    return res.status(201).json({ message: "Payment Created Successfully", payment });      
}
   catch(err){
      console.error("Create Payment Error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
   }


}

// Verify a payment
async function verifyPayment(req,res) {
  const {razorpayorderId,paymentId,signature}=req.body;
  const secret = process.env.RAZORPAY_KEY_ID_SECRET;
  try{
    const {validatePaymentVerification}=require('../../node_modules/razorpay/dist/utils/razorpay-utils');
    const result=validatePaymentVerification({
      "order_id":razorpayorderId,
      "payment_id":paymentId,
    },signature,secret);
    if(result){
      const payment = await paymentModel.findOne({ order: razorpayorderId });
      if(!payment) return res.status(404).json({message:"Payment not found"});
      console.log(payment);
      payment.paymentId = paymentId;
      payment.signature = signature;
      payment.status = 'Completed';
      await payment.save();
      res.status(200).json({ status: 'success' });

    }
    else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error verifying payment');
  }
}






module.exports={
    createPayment,
    verifyPayment
}