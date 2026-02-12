const {body, validationResult}=require('express-validator');
const mongoose=require('mongoose');

// Middleware to validate item data in the request body 
function validateItem(req,res,next){
    const errors=validationResult(req); 

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }   
   next();
}

const validateItemData=[
    body('quantity').isInt({min:1}).withMessage('Quantity must be an integer greater than 0'),
    body('productId').isString().withMessage('Product ID must be a string').custom((value)=> mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid Product ID format'),
    validateItem,
];

module.exports=validateItemData;