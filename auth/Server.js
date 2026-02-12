const app=require('./src/app');
const ConnectDb=require('./src/db/db');
const RabitMq=require('./src/service/broker');
RabitMq.connect();
ConnectDb();

app.listen(3000,async ()=>{
    console.log("Server Is Running on Port 3000");
})