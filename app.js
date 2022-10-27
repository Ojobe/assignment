require("dotenv").config()
const express=require("express")
const db=require("./config/db");
const PORT= process.env.PORT || 5000;


const app=express()
app.use(express.json())
connectDB();

app.get("/", (req,res)=>res.send("this is the home route"))

app.use("/api/users", require("./routes/api/users"));

app.use("/api/auth", require("./routes/api/auth"));


app.listen(PORT, ()=> console.log(`server is up and running on ${PORT}`))