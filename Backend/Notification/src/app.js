
const express=require('express');
const app=express();
app.use(express.json());
const {connect,subscribeToQueue}=require('./broker');
const sendEmail=require('./email');
connect().then(async()=>{
   await subscribeToQueue("User_Created_Queue",async(data)=>{
        console.log(data);
   await  sendEmail(data.email,data.username);
       })
}).catch((err)=>{
    console.log(err);
});

app.get('/',(req,res)=>{
    res.send("Notification service is up and running");
})


module.exports=app; 