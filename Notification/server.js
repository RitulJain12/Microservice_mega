require('dotenv').config();
const app=require('./src/app');



app.listen(process.env.PORT,()=>{
   console.log(`App is runnung on ${process.env.PORT}`); 
})