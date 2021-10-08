const io = require("socket.io")(8000, {
  cors: {
    origin: "http://localhost:3000",
  },
});


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
    console.log(msgData)
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
