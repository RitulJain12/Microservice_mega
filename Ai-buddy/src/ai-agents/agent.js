const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const { ChatGroq } = require("@langchain/groq");
const { ToolMessage, AIMessage ,HumanMessage} = require("@langchain/core/messages");

const tools = require('./tools');

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0.5,
  apiKey:"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"
});

const graph = new StateGraph(MessagesAnnotation)

.addNode("chat", async (state, config) => {
  console.log("In chat node");
 console.log(config.metadata);
  // const response = await model.invoke(state.messages, {
  //   tools: [tools.addProductToCart, tools.searchProduct],
  // });

  // state.messages.push(
  //   new AIMessage({
  //     content: response.content,
  //     tool_calls: response.tool_calls ?? [],
  //   })
  // );

  return state;
})

.addNode("tools", async (state, config) => {
  console.log("In tools node");
  console.log(config.metadata);
  const lastMessage = state.messages[state.messages.length - 1];

  const results = await Promise.all(
    lastMessage.tool_calls.map(async (call) => {
      const tool = tools[call.name];
      if (!tool) throw new Error(`Tool ${call.name} not found`);

      const output = await tool.invoke({
        ...call.args,
        token: config.metadata.token,
      });

      return new ToolMessage({
        content: output,
        toolName: call.name,
      });
    })
  );

  state.messages.push(...results);
  return state;
})

.addEdge("__start__", "chat")

.addConditionalEdges("chat", (state) => {
  const last = state.messages[state.messages.length - 1];
  return last.tool_calls && last.tool_calls.length > 0
    ? "tools"
    : "__end__";
})

.addEdge("tools", "chat");

const agent = graph.compile();

module.exports=agent;