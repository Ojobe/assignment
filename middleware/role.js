const config=require("config");
const User=require("../models/User");

module.exports=(...permission)=>{
    return (req, res, next)=>{
        if(permission.includes(req.user.userType !=="admin" && req.user.isAtive !== true)){ 
            return res.status(400).json({msg:"you can not perform this function"})
        }
        next()
    }
}