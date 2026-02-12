const jwt=require('jsonwebtoken');

function createAuthMiddleware(role=["user"]){
   return function authMiddleware(req,res,next){
      const token=req.cookies.token|| req.headers['authorization']?.split(' ')[1];
      console.log(req.headers);
      if(!token){
         return res.status(401).json({message:"Authentication token missing"});
      }
      try{
          console.log(`carte-token${token}`)
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!role.includes(decoded.role)){
           return res.status(403).json({message:"Forbidden: Insufficient permissions"});
        }
        req.user=decoded;
        next();
      }
     catch(err){
        console.error("Auth Middleware Error:",err);
        return res.status(401).json({message:"Invalid authentication token"});
      }
   }
}

module.exports=createAuthMiddleware;