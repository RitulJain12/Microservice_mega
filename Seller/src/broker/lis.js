const Rabbit=require('./msgqueue');
const userModel=require('../models/user.model')

module.exports=async function () {
   Rabbit.subscribeToQueue('AUTH_SELLER_DASHBOARD.USER_CREATED',async (user)=>{
        console.log(user);
       await userModel.create(user);
    })
}