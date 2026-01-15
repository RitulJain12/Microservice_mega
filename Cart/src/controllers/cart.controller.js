const cartModel=require('../models/Cart.model');


async function addItemToCart(req,res){
    const {productId,quantity}=req.body;
    const userId=req.user.id;
    try{
        let cart=await cartModel.findOne({user:userId});
        if(!cart){
            cart=new cartModel({
                user:userId,
                items:[{productId,quantity}],
            });
        }
        else{
            const itemIndex=cart.items.findIndex(item=>item.productId.toString()===productId);
            if(itemIndex>-1){
                cart.items[itemIndex].quantity+=quantity;
            }   
            else{
                cart.items.push({productId,quantity});
            }
        }
        
              await cart.save();
              console.log("itesmmms addesg");
              return res.status(200).json({message:'Item added to cart successfully',cart});
    }    
    catch(error){
        console.error('Error adding item to cart:',error);
        return res.status(500).json({message:'Internal server error'});
    }
}   


async function updateItemQuantityInCart(req,res){
    const {quantity}=req.body;
    const {productId}=req.params;
    const userId=req.user.id;
    try{
        const cart=await cartModel.findOne({user:userId});
        if(!cart){
            return res.status(404).json({message:'Cart not found'});
        }
        const itemIndex=cart.items.findIndex(item=>item.productId.toString()===productId);
        if(itemIndex===-1){
            return res.status(404).json({message:'Item not found in cart'});
        }
        cart.items[itemIndex].quantity=quantity;
        await cart.save();
        return res.status(200).json({message:'Item quantity updated successfully',cart});
    }
  catch(error){
    console.error('Error updating item quantity in cart:',error);
    return res.status(500).json({message:'Internal server error'});
  }

}


async function getCart(req,res){
    const userId=req.user.id;
    try{
        const cart=await cartModel.findOne({user:userId});  
        
        if(!cart){
             cart=new cartModel({
                user:userId,
                items:[],
            });
            await cart.save();  
        }   
       // console.log('Cart retrieved:',cart);
        return res.status(200).json({cart,totals:{itemCount:cart.items.length, totalQuantity:cart.items.reduce((acc,item)=>acc+item.quantity,0)}});
    }

    catch(error){
        console.error('Error retrieving cart:',error);
        return res.status(500).json({message:'Internal server error'});
    }
}

async function removeItemFromCart(req,res){
    const {productId}=req.params;
    const userId=req.user.id;
    try{
        const cart=await cartModel.findOne({user:userId});
        if(!cart){
            return res.status(404).json({message:'Cart not found'});
        }       
        const itemIndex=cart.items.findIndex(item=>item.productId.toString()===productId);
        if(itemIndex===-1){
            return res.status(404).json({message:'Item not found in cart'});
        }   
        cart.items.splice(itemIndex,1);
        await cart.save();
        return res.status(200).json({message:'Item removed from cart successfully',cart});
    }
    catch(error){
        console.error('Error removing item from cart:',error);
        return res.status(500).json({message:'Internal server error'});
    }
}

async function clearCart(req,res){
    const userId=req.user.id;   
    try{
        const cart=await cartModel.findOne({user:userId});
        if(!cart){
            return res.status(404).json({message:'Cart not found'});
        }

        cart.items=[];
        await cart.save();
        return res.status(200).json({message:'Cart cleared successfully',cart});
    }
    catch(error){
        console.error('Error clearing cart:',error);
        return res.status(500).json({message:'Internal server error'});
    }
}

module.exports={
    
    addItemToCart,
    updateItemQuantityInCart,
    getCart,
    removeItemFromCart,
    clearCart

};