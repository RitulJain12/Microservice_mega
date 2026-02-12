const app=require('./src/app');
require('dotenv').config();
const PORT=process.env.PORT;;
const connectDB=require('./src/db/db');
const {connect,subscribeToQueue}=require('./src/broker/msgqueue');
const listen=require('./src/broker/lis')
  connect().then(async()=>{
    await  listen();
  });
connectDB();


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});