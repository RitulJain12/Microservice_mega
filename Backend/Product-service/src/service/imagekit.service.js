require('dotenv').config();
const Imagekit=require('imagekit');
const crypto = require('crypto');
const imagekit=new Imagekit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT
}); 

async function uploadImage(fileBuffer){
   const res=await imagekit.upload({
        file:fileBuffer,
        fileName:crypto.randomUUID(),
   });
   return {url:res.url, fileId:res.fileId,thumbnailUrl:res.thumbnailUrl};
}


module.exports={
    uploadImage,
};