const orderModel = require('../models/order.model');
const axios = require('axios');
async function createOrder(req, res) {
      const user=req.user;
      const token=req.cookies?.token|| req.headers?.authorization?.split(' ')[1];
    try {
      
      const cartResponse = await axios.get(`http://localhost:3002/api/cart`, {
        headers: {authorization: `Bearer ${token}` }
        });
          
          
           const product= await Promise.all(cartResponse.data.cart.items.map(async(item)=>{
            const productResponse= await axios.get(`http://localhost:3001/api/product/${item.productId}`,{
                headers: {authorization: `Bearer ${token}` }  
            });
            return productResponse.data.product;
           }));
           //console.log('Cart Response:', cartResponse.data.cart.items);
          console.log('Product Details:', product);
          let totalAmount=0;
            const orderItems= cartResponse.data.cart.items.map((item,index)=>{  
               const productDetails=product.find(p=>p._id===item.productId);
               //if not is stock throw error
                if(!productDetails || productDetails.stock<item.quantity){
                    throw new Error(`Product ${productDetails.title} is out of stock or insufficient quantity`);
                }
               const priceAmount= productDetails ? productDetails.price.amount : 0;
               totalAmount += priceAmount * item.quantity;
               return {
                productId: item.productId,
                quantity: item.quantity,
                price: {
                    amount: priceAmount,
                    currency: productDetails.price.currency
                }
               };
            })

           //console.log('Total Amount:',totalAmount);
              let newOrder = new orderModel({ 
                userId: user.id,
                items: orderItems,
                totalAmount,  
                shippingAddress: req.body.shippingAddress
              })
           
                newOrder= await newOrder.save();
               // console.log('New Order:', newOrder);
              

          res.status(201).json({ message: 'Order created successfully', order: newOrder });
         
          const items=newOrder.items.map(item=>{
            return {
                productId:item.productId,
                quantity:item.quantity
            }
          }
          );
            await axios.post(`http://localhost:3001/api/product/decrease-stock`,{items},{
            headers: {authorization: `Bearer ${token}` }  
        });
          

    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error',error: error.message });
    }
}

async function getUserOrders(req, res) {
    const user=req.user;
    const {skip=0,limit=10}=req.query;
     try{
      const orders= await orderModel.find({userId:user.id}).skip(parseInt(skip)).limit(Math.min(parseInt(limit),10)).sort({createdAt:-1});
      res.status(200).json({message:"Order fetched Successfully",orders} );
     }
      catch(error){  
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Internal server error' });
}
}

async function getOrderById(req, res) {
    const user=req.user;
    const orderId=req.params.id;
    try{
        const order= await orderModel.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        // If user is not admin, check if the order belongs to the user 
        if(user.role!=='admin' && order.userId.toString()!==user.id){
            return res.status(403).json({message:"Forbidden: You can only access your own orders"});
        }
        res.status(200).json({message:"Order fetched Successfully",order} );
    }
    catch(error){ 
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function cancelOrder(req, res) {
    const user=req.user;
    const orderId=req.params.id;
    const token=req.cookies?.token|| req.headers?.authorization?.split(' ')[1];
    try{
        let order= await orderModel.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        // Check if the order belongs to the user 
        if( order.userId.toString()!==user.id){
            return res.status(403).json({message:"Forbidden: You can only cancel your own orders"});
        }
        if(order.status==='Cancelled'){
            return res.status(400).json({message:"Order is already cancelled"});
        }
        order.status='Cancelled';
        order= await order.save();
        res.status(200).json({message:"Order cancelled Successfully",at: new Date()} );
        // const items=order.items.map(item=>{
        //     return {
        //         productId:item.productId,
        //         quantity:item.quantity
        //     }
        //   }
        //   );   await axios.post(`http://localhost:3001/api/product/increase-stock`,{items},{
        //     headers: {authorization: `Bearer ${token}` }  
        // });
    } 
    catch(error){

        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateShippingAddress(req, res) {
    const user=req.user;
    const orderId=req.params.id;
    try{
        let order= await orderModel.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        } 
        // Check if the order belongs to the user
        if( order.userId.toString()!==user.id){
            return res.status(403).json({message:"Forbidden: You can only update your own orders"});
        }
        order.shippingAddress=req.body.shippingAddress;
        order= await order.save();
        res.status(200).json({message:"Shipping address updated Successfully",order} );
    }
    catch(error){

        console.error('Error updating shipping address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
}







module.exports={

    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
    updateShippingAddress
}