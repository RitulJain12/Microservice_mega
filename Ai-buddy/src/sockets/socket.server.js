const {Server}=require('socket.io');
const cookie=require('cookie');
const jwt=require('jsonwebtoken');
const agent=require('../ai-agents/agent');
const {HumanMessage}=require('@langchain/core/messages')
async function InitSocketServer(httpserver){
    const io=new Server(httpserver,
    {
   //cors
    });

    
   //middleware
    io.use((socket,next)=>{
        const {token}= cookie.parse(socket.handshake.headers?.cookie|| '');
        if(!token) return next(new Error("Authentication Error"));
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            socket.user=decoded;
            socket.token=token;
            next();
        }
        catch(err){
            next(new Error("Authentication Error"));
        }
    });
    // 
    io.on('connection',(socket)=>{
         console.log("a user Connected");
         socket.on('message',async(data)=>{
               console.log(data);
               const result = await agent.invoke(
                {
                  messages: [
                    new HumanMessage(data)
                  ]
                },
                {
                  metadata: {
                    token: socket.token
                  }
                }
              );
              
                console.log(result);
         });
       
    });

}

module.exports=InitSocketServer;