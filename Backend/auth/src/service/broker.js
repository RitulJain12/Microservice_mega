const amqplib=require('amqplib');
let channel,connection;
async function connect() {
  
    if(connection) return connection;
    const maxRetries = 10;
    const delay = 3000;
    
    for (let i = 1; i <= maxRetries; i++) {
        try {
            connection = await amqplib.connect(process.env.RABBIT_URL);
            console.log(`Connected to rabit mQ (attempt ${i})`); 
            channel = await connection.createChannel();
            return connection;
        } catch (err) {
            console.log(`Error in connection of RabitMq (attempt ${i}/${maxRetries}):`, err.message);
            if (i === maxRetries) {
                throw err;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function publishToQueue(queuename,data={}) {
    if(!channel || !connection) await connect();
    await channel.assertQueue(queuename,{
        durable:true
    })
    channel.sendToQueue(queuename,Buffer.from(JSON.stringify(data)));
    console.log("Message send to queue:",queuename,data);
}



async function subscribeToQueue(queuename,callback) {
    if(!channel || !connection) await connect();
    await channel.assertQueue(queuename,{
        durable:true
    })

    channel.consume(queuename, async(msg)=>{
        if(msg!==null){
            const data=JSON.parse(msg.content.toString());
            await callback(data);
            channel.ack(msg);
        }
    })
    
}

module.exports={
    connect,
    channel,
    connection,
    subscribeToQueue,
    publishToQueue,
    
}