const app=require('./src/app');
require('dotenv').config();
const ConnectDb=require('./src/db/db');

ConnectDb();


app.listen(process.env.PORT,()=>{
    console.log(`Server Started at${process.env.PORT}`)
})