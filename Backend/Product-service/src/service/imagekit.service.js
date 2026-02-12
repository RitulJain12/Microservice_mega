require('dotenv').config();
const Imagekit=require('imagekit');
const {v4:uuidv4}=require('uuid');
const imagekit=new Imagekit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT
}); 

async function uploadImage(fileBuffer){
   const res=await imagekit.upload({
        file:fileBuffer,
        fileName:uuidv4(),
   });
   return {url:res.url, fileId:res.fileId,thumbnailUrl:res.thumbnailUrl};
}


module.exports={
    uploadImage,
};