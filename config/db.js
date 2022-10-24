const mongoose=require("mongoose");
const config=require("config");
const db=config.get("mongoURI");

connectDB= async ()=>{
    try{
        await mongoose.connect(db, {useNewUrlParser: true})
        console.log("database is coonnected"); 

    }catch(error){
        console.error(error.message)
        process.exit(1)
    }
}

module.exports= connectDB;