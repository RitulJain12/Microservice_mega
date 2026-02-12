const  mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    type: {
        type: String,
        enum: ['ORDER', 'PREMIUM'],
        default: 'ORDER'
    },
    days: {
        type: Number
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true,
            enum: ['INR', 'USD'],
            default: 'INR'
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',

    },
    paymentId: {
        type: String,
        required: true
    },
    signature: {
        type: String
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });


const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;