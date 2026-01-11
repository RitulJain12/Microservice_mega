const {body, validationResult} = require('express-validator');
  function validateShippingAddress(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
const shippingAddressValidationRules = [
    body('shippingAddress').exists().withMessage('Shipping address is required').bail(),
    body('shippingAddress.street').isString().withMessage('Street must be a string').bail(),
    body('shippingAddress.city').isString().withMessage('City must be a string').bail(),
    body('shippingAddress.state').isString().withMessage('State must be a string').bail(),
    body('shippingAddress.zip').isPostalCode('any').withMessage('Invalid zip code').bail(),
    body('shippingAddress.country').isString().withMessage('Country must be a string').bail(),
    validateShippingAddress
];


module.exports={
    shippingAddressValidationRules
};