const { default: mongoose } = require("mongoose");
const momgoose=require("mongoose");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true,
        default:true
    },
    gender:{
        type:String,
        enum:["male","female"]
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    password:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        enum:["admin","user"],
        default:"user"
        
        
    }
})

module.exports=User=mongoose.model("User", userSchema);