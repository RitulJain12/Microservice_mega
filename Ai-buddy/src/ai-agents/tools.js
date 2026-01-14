const {tool}=require('@langchain/core/tools');
const {z}=require('zod');
const axios=require('axios');
const  searchProduct=tool(
async({query,token})=>{
    console.log("chala-1") 
    console.log
    const response=await axios.get(`http://localhost:3001/api/product?q=${query}`,{
        headers:{
            Authorization: `Bearer ${token}`
          }
          
    })
    console.log(response)
    return JSON.stringify(response.data);
}
,{
    name:"searchProduct",
    description:"Search For Product Based on a query",
    schema:z.object({
        query:z.string().describe("The Search Query For Products")
    })
}
);

const addProductToCart=tool(
    async ({productId,quantity=1,token})=>{
        console.log("chala-1")
        console.log(`CArt00toke,:${token}`)
   const resp= await axios.post(`http://localhost:3002/api/cart/items`,{
    productId,
    quantity

   },{
    headers:{
        Authorization:`Bearer ${token}`
    }
   })

    return `added product with id ${productId} (quantity:${quantity}) to cart`;
    }
,
{
        name:"addProductToCart",
        description:"Add a product to the shopping cart",
        schema: z.object({
        productId:z.string().describe("The id of the product to add to the cart"),
         quantity:z.number().describe("the quantity of the product to add to the cart").default(1)
        })
}

);


module.exports={
    addProductToCart,
    searchProduct
}