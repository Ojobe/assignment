const jwt=require("jsonwebtoken");
const config=require("config");
const User=require("../models/User")



module.exports= async(req,res,next)=>{

 // get token from header
 const token=req.header("x-auth-token");
 // check if not token
 if(!token){
    return res.status(401).json({msg: "no token, authorization denied"});
 }
 // verify token
 try{
    const decoded=jwt.verify(token, config.get("jsSecret"));
    req.user=decoded.user;
   
    next();
 }catch(err){
   console.log('token',err)
    res.status(401).json({msg: "token is not valid",err:err.message});
 }
}
