const {StateGraph,MessagesAnnotation}=require('@langchain/langgraph');
const {ChatGoogleGenerativeAI}=require('@langchain/google-genai');
const model= new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-lite",
    temperature:0.5,
   // apiKey:process.env.GOOGLE_API_KEY
  // apiKey:"AIzaSyCX-8kfjQ10WVm1-VYmKzQ0AUYUI_w5G-Y"
}) 
//console.log(process.env.GOOGLE_API_KEY)
const  tools=require('./tools');
const {ToolMessage,AIMessage,HumanMessage}=require('@langchain/core/messages')
const graph= new StateGraph(MessagesAnnotation)
.addNode("tools",async(state,config)=>{
  //  console.log("chala-tool-1")
     const lastMessage=state.messages[state.messages.length-1];
     const toolsCall =lastMessage.tool_calls;
     const toolcallResults =await Promise.all(toolsCall.map(async(call)=>{
         const tool=tools[call.name];
         if(!tool){
            throw new Error(`Tool ${call.name} does not exist`);
         }
          const toolInput=call.args;
          const toolResult =await tool.invoke({...toolInput,token:config.metadata.token})
          return new ToolMessage({content:toolResult,toolName:call.name})
     }))
     state.messages.push(...toolcallResults);
     console.log("chala-tool-1")
     return state;
})
.addNode("chat", async (state, config) => {
     console.log("In the chat");
    const response = await model.invoke(
      state.messages,
      {
        tools: [tools.addProductToCart, tools.searchProduct],
      }
    );
  
    console.log("LLM RESPONSE:", response);
  
    state.messages.push(
      new AIMessage({
        content: response.content,
        tool_calls: response.tool_calls ?? []
      })
    );
  
    console.log("chala-chat-1");
    return state;
  })
  
.addEdge("__start__","chat")
.addConditionalEdges('chat',async(state)=>{
    console.log("chala-tool-1")
    const lastMessage=state.messages[state.messages.length-1];
    console.log("chala-chat-1")
    if(lastMessage.tool_calls && lastMessage.tool_calls.length>0) return "tools";
    console.log("chala-end-1")
    return "__end__";
})
.addEdge("tools","chat");


const agent=graph.compile();


async function name() {
  const agentResp= await agent.invoke({
    messages:[
        {
            role:"user",
            content:data
        }
    ]
  },{
    metadata:{
         token:"njanjnaj"
    }
  });
 return agentResp;
}
console .log(name());