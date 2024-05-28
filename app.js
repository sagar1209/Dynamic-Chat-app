require("dotenv").config();
require("./config/db");
const app = require("express")();
const User = require('./models/userModel');
const Chat = require('./models/chatModel')

const http = require("http").Server(app);

const userRouter = require("./routes/userRoute");

app.use("/", userRouter);

const io = require("socket.io")(http);

const usp = io.of("user-namespace");

usp.on("connect",async function (socket) {
 const userId = socket.handshake.auth.token;

 await User.findByIdAndUpdate({_id:userId},{$set : {is_online:'1'}})
  
 socket.broadcast.emit('getOnlineUser',{user_id:userId}); 

  socket.on("disconnect",async function () {
    await User.findByIdAndUpdate({_id:userId},{$set : {is_online:'0'}})
    socket.broadcast.emit('getOfflineUser',{user_id:userId});
  });

  socket.on('newChat',function(data){
      socket.broadcast.emit('loadNewchat',data);
  })

  socket.on('exitsChat',async function(data){
      const chats = await Chat.find({
         $or : [{
              sender_id:data.sender_id , receiver_id:data.receiver_id
         },{
              sender_id:data.receiver_id , receiver_id:data.sender_id   
         }]
      })
      socket.emit('loadChats',chats);
  })

  socket.on('chatDeleted',function(id){
      socket.broadcast.emit('chatMessagedeleted',id);
  })
});

app.use("/", (req, res) => {
  res.send("hello");
});

http.listen(3000, () => {
  console.log("server is running");
});
