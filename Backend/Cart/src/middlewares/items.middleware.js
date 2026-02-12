const { body, validationResult } = require('express-validator');

// Middleware to validate item data in the request body 
function validateItem(req, res, next) {
    const errors = validationResult(req);
    console.log('Validation check - Request body:', req.body);
    console.log('Validation check - Request params:', req.params);

    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
}

// Validation for adding items (POST /api/cart/items)
const validateAddItem = [
    body('productId')
        .exists().withMessage('Product ID is required')
        .notEmpty().withMessage('Product ID cannot be empty'),
    body('quantity')
        .exists().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0')
        .toInt(), // Convert string to integer
    validateItem,
];

// Validation for updating quantity (PUT /api/cart/items/:productId)
const validateUpdateQuantity = [
    body('quantity')
        .exists().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0')
        .toInt(), // Convert string to integer
    validateItem,
];

module.exports = {
    validateAddItem,
    validateUpdateQuantity
};