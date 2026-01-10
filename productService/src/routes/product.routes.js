const express=require('express');
const multer=require('multer');
const Router=express.Router();
const upload=multer({storage:multer.memoryStorage()});
const createAuthMiddleware=require('../middlewares/auth.middleware');
const ProductController = require('../controllers/product.controller');
const productmiddleware = require('../middlewares/product.middleware');



//api/product/
Router.post('/',createAuthMiddleware(['admin','seller']),upload.array('images',5),productmiddleware,ProductController.createProduct);



module.exports=Router;