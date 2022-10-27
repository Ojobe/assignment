module.exports=(permission)=>{
    return (req, res, next)=>{
        if(!permission.includes(req.user.userType)){ 
            return res.status(403).json({msg:"you can not perform this function"})
        }
        next()
    }
}