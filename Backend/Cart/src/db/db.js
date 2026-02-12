const mongoose=require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
    }
    catch(err){     
        console.log("Error in DB connection",err);  
    }
}

module.exports=connectDB;