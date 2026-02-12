const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true, 
  },
  items: [
    {
      productId: {
        type: String, 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      images: {
        type: Array, 
        default: []
      },
      title: {
        type: String,
        required: true
      },
      price: {
        amount: {
          type: Number,
          min: 1,
        },
        currency: {
          type: String,
          enum: ["INR", "USD"]
        }

      }

    },
  ]


}, {
  timestamps: true,
});

cartSchema.index({ user: 1 });

const CartModel = mongoose.model('cart', cartSchema);

module.exports = CartModel;