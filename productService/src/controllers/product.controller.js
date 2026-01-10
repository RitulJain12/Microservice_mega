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




module.exports={
    createProduct,

};