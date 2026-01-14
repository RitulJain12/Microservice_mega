const express = require('express');
const { sign } = require('jsonwebtoken');
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    order:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    price:{
         amount:{
            type: Number,
            required: true
            },
            currency:{  
                type: String,
                required: true,
                enum: ['INR', 'USD'],
                default: 'INR'
            }
    },
    paymentId:{
        type: String,
        required: true  },
    status:{
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
        
    },
    paymentId:{
        type: String,
        required: true
    },
    signature:{
        type: String
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });


const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;