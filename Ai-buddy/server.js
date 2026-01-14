const app=require('./src/app');
require('dotenv').config();

const http=require('http');
const httpserver=http.createServer(app);
const InitSocketServer=require('./src/sockets/socket.server');
InitSocketServer(httpserver);



httpserver.listen(process.env.PORT, () => {
    console.log(`Ai-Service is running on port ${process.env.PORT}`);
});  
 