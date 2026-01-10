const { default: mongoose } = require('mongoose');
const productModel=require('../models/product.model');
const { uploadImage } = require('../service/imagekit.service');

async function createProduct(req,res){
try{
        const {title,description,priceAmount,priceCurrency='INR'}=req.body;
        if(!title || !description || (priceAmount===undefined)){
            return res.status(400).json({message:"Missing required fields"});
        }

        const amount = Number(priceAmount);
        if(Number.isNaN(amount) || amount <= 0){
            return res.status(400).json({message:"Invalid price amount"});
        }

        const seller = req.user?.id || req.user?._id;
        if(!seller){
            return res.status(401).json({message:"Unauthorized: seller not found"});
        }

        const price={
            amount: amount,
            currency:priceCurrency
        }

        const images=[];
        if(Array.isArray(req.files) && req.files.length){
            const uploads = await Promise.all(req.files.map(async (file)=>{
                const {url, fileId, thumbnailUrl} = await uploadImage(file.buffer);
                return { url, thumbnail: thumbnailUrl || '', id: fileId || '' };
            }));
            uploads.forEach(u=>images.push(u));
        }

        const product = await productModel.create({
            title,
            description,
            price,
            seller,
            images
        });

        return res.status(201).json({message:'Product created',product});
}
   catch(err){  
      console.error('createProduct error',err);
      return res.status(500).json({message:'Internal Server Error'});
   }
}


async function getAllProducts(req,res){
    const {q,minprice,maxprice,skip=0,limit=20}=req.query;
     const filter={};
    if(q){
        filter.$text={$search:q};
    }
    if(minprice ){
        filter['price.amount']={$gte:Number(minprice)};
    }
    if(maxprice){
        filter['price.amount']=filter['price.amount'] || {};
        filter['price.amount'].$lte=Number(maxprice);
    }

    const products=await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit),20));
    return res.status(200).json({message:'Products fetched successfully',data:products});
}


async function getProductById(req,res){
    const {id}=req.params;    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:'Invalid product id'});
    }      
    try{        
        const product=await productModel.findById(id);
        if(!product){
            return res.status(404).json({message:'Product not found'});
        }
        return res.status(200).json({message:'Product fetched successfully',product});
    }
    catch(err){
        console.error('getProductById error',err);
        return res.status(500).json({message:'Internal Server Error'});
    }

}


async function updateProduct(req,res){
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:'Invalid product id'});
    }
    try{
        const product=await productModel.findOne({_id:id,seller:req.user?.id });
        if(!product){
            return res.status(404).json({message:'Product not found'});
        }    
        const {title,description,priceAmount}=req.body;
        if(title){
            product.title=title;
        }    
        if(description){
            product.description=description;
        }   
        if(priceAmount){
            const amount=Number(priceAmount); 
            if(Number.isNaN(amount) || amount <= 0){
                return res.status(400).json({message:"Invalid price amount"});
            }   }

            await product.save();
         return res.status(200).json({message:'Product updated successfully',product});  
      
    }

    catch(err){
        console.error('updateProduct error',err);
        return res.status(500).json({message:'Internal Server Error'});
    }

}


async function deleteProduct(req,res){
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:'Invalid product id'});
    }
    try{  
        
        const product=await productModel.findOneAndDelete({_id:id,seller:req.user?.id });
        if(!product){
            return res.status(404).json({message:'Product not found'});
        }     
        
        return res.status(200).json({message:'Product deleted successfully'});


    }

    catch(err){
        console.error('deleteProduct error',err);
        return res.status(500).json({message:'Internal Server Error'});
    }

}

async function getProductsBySeller(req,res){
    try{
        const sellerId=req.user?.id;    
        const {skip=0,limit=20}=req.query;
        const products=await productModel.find({seller:sellerId}).skip(Number(skip)).limit(Math.min(Number(limit),20)); 
        return res.status(200).json({message:'Products fetched successfully',products});
    }   
    catch(err){
        console.error('getProductsBySeller error',err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}

module.exports={
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsBySeller

};