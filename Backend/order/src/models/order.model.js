const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    items:[
      {  productId: { type: mongoose.Schema.Types.ObjectId,  required: true },
        quantity: { type: Number, required: true, default: 1,min:1 },
        price: { amount: { type: Number, required: true }, currency: { type: String, required: true ,enum:['INR','USD']} }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled','confirmed'], default: 'pending' },
    shippingAddress: { 
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zip: { type: String, required: true },

     },
    orderDate: { type: Date, default: Date.now() },
    deliveryDate: { type: Date,default : Date.now() + (5 * 24 * 60 * 60 * 1000)}
});

module.exports = mongoose.model('order', orderSchema);