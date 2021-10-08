require("dotenv").config({path:"./config.env"})
const express=require("express");
const app=express();
const path=require("path")
require("./db/database")


const cookieParser = require('cookie-parser')
app.use("/public",express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser(process.env.SIGND_COOKIS))

const userRouter = require("./router/userRouter")
const conversationRouter = require("./router/conversationRouter")
const messageRouter=require("./router/messageRouter");
const adminMain=require("./router/adminMain")
app.use("/user/api",userRouter)
app.use("/conversation/api",conversationRouter)
app.use("/message",messageRouter)
app.use("/admin/api",adminMain)
app.listen(process.env.PORT,(error)=>{
    console.log(`server si runngin and port number is ${error?error:process.env.PORT}`);
})


