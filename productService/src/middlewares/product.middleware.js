const {body,validationResult}=require('express-validator');


const respondWithValidation=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
    }
    
    const validations = [
        body('title')
          .isString().withMessage('title must be a string')
          .notEmpty().withMessage('title is required'),
      
        body('description')
          .isString().withMessage('Description must be a string')
          .notEmpty().withMessage('Description is required'),
      
        body('priceAmount')
          .toFloat()  
          .isFloat({ gt: 0 })
          .withMessage('Price must be a number greater than 0'),
      
       body('priceCurrency')
          .optional()
          .isIn(['INR', 'USD'])
          .withMessage('Currency must be either INR or USD'),   
        respondWithValidation
      ];
      

   module.exports=validations;