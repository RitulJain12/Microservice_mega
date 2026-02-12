const app=require('./src/app');
require('dotenv').config();
const connectDB=require('./src/db/db');
const RabbitMq=require('./src/queue/broker');
// Connect to the database
connectDB();
RabbitMq.connect();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});