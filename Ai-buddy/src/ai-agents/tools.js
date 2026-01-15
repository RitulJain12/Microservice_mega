const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");


const searchProduct = tool(
  async ({ query }, config) => {
    const token = config.metadata.token;

    const response = await axios.get(
      `http://localhost:3001/api/product?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return JSON.stringify(response.data);
  },
  {
    name: "searchProduct",
    description: "Search products using a query string",
    schema: z.object({
      query: z.string().describe("Search keyword"),
    }),
  }
);


const addProductToCart = tool(
  async ({ productId, quantity }, config) => {
    const token = config.metadata.token;

    await axios.post(
      "http://localhost:3002/api/cart/items",
      {
        productId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return `✅ Product ${productId} added to cart (qty: ${quantity})`;
  },
  {
    name: "addProductToCart",
    description: "Add a product to shopping cart",
    schema: z.object({
      productId: z.string(),
      quantity: z.number().default(1),
    }),
  }
);

module.exports = {
  searchProduct,
  addProductToCart,
};
