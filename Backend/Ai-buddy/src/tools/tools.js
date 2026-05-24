const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");


const searchProduct = tool(
  async ({ query }, config) => {
    const token = config.metadata.token;

    const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
    const response = await axios.get(
      `${productServiceUrl}/api/product?q=${query}`,
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
  async ({ productId, quantity,stock }, config) => {
    const token = config.metadata.token;
    if(quantity>stock) throw Error('The Quantity Of Product Exceeds the Stock')
    const cartServiceUrl = process.env.CART_SERVICE_URL || 'http://localhost:3002';
    await axios.post(
      `${cartServiceUrl}/api/cart/items`,
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
      stock:z.number().describe("How many products are remaining"),
    }),
  } 
); 

const searchDiscountedProducts=tool(async({query},config)=>{


  const token = config.metadata.token;

  const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
  const response = await axios.get(
    `${productServiceUrl}/api/product/discounted/?q=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return JSON.stringify(response.data.products);

},{
   name:"searchDiscountedProducts",
   description:"Find all the products that are for premium user and give the products at very low price call only if user premium",
   schema:z.object({
    query: z.string().describe("Search keyword"),
   })
})

 
module.exports = { 
  searchProduct,
  addProductToCart,
  searchDiscountedProducts,

};
