const express=require('express');
const app=express();
const cookieparser=require('cookie-parser');
const productRouter=require('./routes/product.routes');
app.use(cookieparser());
app.use(express.json());

app.use('/api/product/',productRouter);



module.exports=app;