const app=require('./src/app');
require('dotenv').config();
const connectDB=require('./src/db/db');

// Connect to the database
connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});