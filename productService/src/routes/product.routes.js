const express=require('express');
const multer=require('multer');
const Router=express.Router();
const upload=multer({storage:multer.memoryStorage()});
const createAuthMiddleware=require('../middlewares/auth.middleware');
const ProductController = require('../controllers/product.controller');
const productmiddleware = require('../middlewares/product.middleware');



//api/product/
Router.post('/',createAuthMiddleware(['admin','seller']),upload.array('images',5),productmiddleware,ProductController.createProduct);

//api/products/
Router.get('/',ProductController.getAllProducts);

//api/products/seller
Router.get('/products/seller',createAuthMiddleware(['admin','seller']),ProductController.getProductsBySeller);

//api/products/:id
Router.patch('/:id',createAuthMiddleware(['admin','seller']),upload.array('images',5),ProductController.updateProduct);

//api/products/:id
Router.delete('/:id',createAuthMiddleware(['admin','seller']),ProductController.deleteProduct);

//api/products/:id
Router.get('/:id',ProductController.getProductById);


module.exports=Router;