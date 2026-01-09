const app=require('./src/app');
const ConnectDb=require('./src/db/db');

ConnectDb();

app.listen(3000,async ()=>{
    console.log("Server Is Running on Port 3000");
})