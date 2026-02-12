
const express=require('express');
const app=express();
app.use(express.json());
const {connect,subscribeToQueue}=require('./broker');
const sendEmail=require('./email');
connect();
subscribeToQueue("User_Created_Queue",async(data)=>{
 console.log(data);
})
app.get('/',(req,res)=>{
    res.send("Notification service is up and running");
})


module.exports=app;