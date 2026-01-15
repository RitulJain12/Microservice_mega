const {Server}=require('socket.io');
const cookie=require('cookie');
const jwt=require('jsonwebtoken');
const agent=require('../ai-agents/agent');
const {HumanMessage,SystemMessage}=require('@langchain/core/messages')
// const systemInstruction = new SystemMessage(`
//   You are a shopping assistant.
  
//   RULES (STRICT):
//   1. When adding a product to cart:
//      - First call searchProduct with the user query.
//      - searchProduct returns an object with:
//        {
//          products: [
//            { productId, name, price }
//          ]
//        }
//      - Take 69633bc28cfc1804514e65e2 EXACTLY.
//      - Pass that value to addProductToCart.
//   2. NEVER invent or hardcode productId.
//   3. NEVER pass placeholder text as productId.
//   `);
  
  
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
                    //systemInstruction,
                    new HumanMessage(data)
                  ]
                },
                {
                  metadata: {
                    token: socket.token
                  }
                }
              );
              
                console.log(`resultt:${result}`);
         });
       
    });

}

module.exports=InitSocketServer;