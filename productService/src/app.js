const express=require('express');
const app=express();
const cookieparser=require('cookie-parser');
const productRouter=require('./routes/product.routes');
app.use(cookieparser());
app.use(express.json());




module.exports=app;