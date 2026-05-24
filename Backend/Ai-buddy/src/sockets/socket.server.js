const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const agent = require('../tools/agent');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const { default: axios } = require('axios');

async function InitSocketServer(httpserver) {
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
  const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3000";
  const io = new Server(httpserver,
    {
      cors: {
        origin: corsOrigin,
        methods: ["GET", "POST"],
        credentials: true
      }
    });



  io.use(async(socket, next) => {
    const { token } = cookie.parse(socket.handshake.headers?.cookie || '');
    if (!token) return next(new Error("Authentication Error"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.user = decoded;
      socket.token = token;
      if(socket.user.ispremiumEnd<Date.now()){
         socket.user.ispremium=false;
          await axios.get(`${authServiceUrl}/auth/users/me/premium`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
         })
      }
      else{
        socket.user.ispremium=true;
      }
      next();
    }
    catch (err) {
      next(new Error("Authentication Error"));
    }
  });

  io.on('connection', (socket) => {
    console.log("a user Connected");
    socket.on('message', async (data) => {
      console.log(data);
      const result = await agent.invoke(
        {
          messages: [
          //  systemInstruction,
        new SystemMessage(`Please remove all special characters from final ans and give in simple text form and the userpremium value is ${socket.user.ispremium} also make feel user premium by giving some extra information about the product if user is premium user so give actual price and discount price and if user is not premium user so give only price not discount price and also if user is premium user so give some extra information about the product like how much discount he got and how much he saved and if user is not premium user so give only price not discount price and manage short term memory by self by seeing the top 10 messages of states and give the discounted price prcentage only when premium user say to find discouted products lowest products like otherwise give plan response like in your words about product also for non premium user if want to ask about discount tell him/her to first buy the plans you have to convince him/her for it by showing lots of benefits`),
        new SystemMessage(`tell about dicount,percentage only if user asks about it do not mention it any normal `),
        new HumanMessage(data.message)
          ]
        },
        {
          metadata: {
            token: socket.token
          },
          
        }
      );
      const ans = result.messages[result.messages.length-1]
      console.log(`resultt:${ans.content}`);
      socket.emit('message-response', ans.content);
    }); 

  });

}

module.exports = InitSocketServer; 