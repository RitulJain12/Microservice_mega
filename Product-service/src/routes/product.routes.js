const express=require('express');
const multer=require('multer');
const Router=express.Router();
const upload=multer({storage:multer.memoryStorage()});
const createAuthMiddleware=require('../middlewares/auth.middleware');
const ProductController = require('../controllers/product.controller');
const productmiddleware = require('../middlewares/product.middleware');



//api/product/
Router.post('/',createAuthMiddleware(['admin','seller']),upload.array('images',5),productmiddleware,ProductController.createProduct);

//api/product/
Router.get('/',ProductController.getAllProducts);

//api/product/seller
Router.get('/seller',createAuthMiddleware(['admin','seller']),ProductController.getProductsBySeller);

//api/product/:id
Router.patch('/:id',createAuthMiddleware(['admin','seller']),upload.array('images',5),ProductController.updateProduct);

//api/product/:id
Router.delete('/:id',createAuthMiddleware(['admin','seller']),ProductController.deleteProduct);

//api/product/:id
Router.get('/:id',ProductController.getProductById);

//api/product/decrease-stock/
Router.post('/decrease-stock/',ProductController.decreaseStockForProducts);


module.exports=Router;