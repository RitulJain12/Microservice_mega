const mongoose=require('mongoose');

async function ConnectDb() {
   try{
    await mongoose.connect(process.env.MONGOURL);
    console.log("Db of Productservice is connected");
   }
   catch(err){
    console.log(`Error in product Service:${err}`);
   }
}

module.exports=ConnectDb;