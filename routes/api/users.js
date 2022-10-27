const express = require("express");
const router = express.Router();
const config = require("config")
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")
const User = require("../../models/User")
const auth=require("../../middleware/auth")
const role=require("../../middleware/role")


router.post("/", [
    check("name", "name is required").not().isEmpty(),
    check("email", "email is required").isEmail(),
    check("password", "please enter a valid password").isLength({ min: 6 }),
    ],
    async (req, res) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //check if user already exits
        const { name, email, password, gender} = req.body;
        
        try {
            let user = await User.findOne({ email })
          
            
            if (user) {
                return res.status(400).json({ msg: "this user already exist" })
            }

            const salt = await bcrypt.genSalt(10);
            let hashedPsasword = await bcrypt.hash(req.body.password, salt);
            req.body.password=hashedPsasword
            const createdUser = await User.create(req.body)
            const payload = {
                user: {
                    userType:createdUser.userType,
                    id: createdUser.id
                }
            }
           
            jwt.sign(payload, process.env.JWT_SECRET,
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err
                    res.json({ token});
                });
        } catch (error) {
            console.error(error.msg)
        }
    });

   

    router.get("/",auth, role(["admin"]), async(req, res)=>{
        try {

        const queryObject={...req.query};
        const excludeObject=["page","sort", "limit", "fields"];
        excludeObject.forEach(el => delete queryObject[el]);

        const query= User.find(queryObject)

        const user=await query;  
         res.json(user); 
        } catch (error) {
           console.error(error.message) 
           return res.status(500).send("server error ")
        }
    });


    router.get("/:id", auth, async(req, res)=>{
        try {
            const {id}= req.params
           const user= await User.findById(id).select("-password")
                res.json({user}); 
        } catch (error) {
           console.error(error.message) 
           return res.status(500).send("server error")
        }
    });
 

    router.patch("/:id", auth, role(["admin","user"]), async(req, res)=>{
      try {
        let {id}= req.params
        

       let user=await User.findById(id)
       if(!user){
        return res.status(404).json({msg:"user not found"})
       }
       if(req.user.userType!=="admin"){
        delete req.body.userType
        delete req.body.isActive
       }
      
      let result = await User.findByIdAndUpdate(id,req.body,{new:true})///findOneAndUpdate({user},{$set:req.body},{new:true})
        res.json(result)
       
      } catch (error) {
        res.status(400).send("sever error occur")
      }
             
    });


    
router.delete("/:id", auth, role(["admin"]), async(req, res)=>{
    try {
        const {id}= req.params
        await User.findByIdAndDelete(id)
            res.json({msg:"user is deleted"}); 
            console.log("deletd successfully")
    } catch (error) {
       console.error(error.message) 
       return res.status(500).send("server error")
    }
});





module.exports = router;
