require("dotenv").config({path:"./config.env"})
const express=require("express");
const app=express();
const http=require("http")
const expressServer=http.createServer(app)
const {Server}=require("socket.io");
const io=new Server(expressServer)
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
expressServer.listen(process.env.PORT,(error)=>{
    console.log(`server si runngin and port number is ${error?error:process.env.PORT}`);
})


// socket server init


let userIdStorage = [];


function userHandeller(userId, socketId) {
  !userIdStorage.some((value) => value.userId === userId) &&
    userIdStorage.push({ userId, socketId });
}


function userRemove(socket){
  userIdStorage=userIdStorage.filter(val=> val.socketId !== socket.id)
}


io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("addUser", (userId) => {
    userHandeller(userId, socket.id);
    io.emit("activeUsers", userIdStorage);
  });
  //messageSent
  socket.on("sendMessage", (msgData) => {
    const user = userIdStorage.find(users => users.userId == msgData.receiver.id);
    socket.to(user.socketId).emit("getMessage", msgData);
  });

  socket.on("selfDisconnect",()=>{
    userRemove(socket)
    io.emit("activeUsers", userIdStorage);
    console.log("a user Disconnected");
  })

  //user Disconnections
  socket.on("disconnect", () => {
    console.log("a user Disconnected");
    userRemove(socket)
    io.emit("activeUsers", userIdStorage);
  });
});
