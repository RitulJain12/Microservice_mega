const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true, // One cart per user
  },
  items: [
    {
      productId: {
        type: String, // Changed to String for easier comparison
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      images: {
        type: Array, // Changed to Array to store multiple image objects
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

// Index for faster lookups
cartSchema.index({ user: 1 });

const CartModel = mongoose.model('cart', cartSchema);

module.exports = CartModel;