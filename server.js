
const express =require('express');
const path =require('path');
const http = require('http');
const socketio =require('socket.io');
const { Socket } = require('dgram');
const { disconnect } = require('process');
const fomatMessage= require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}= require('./utils/users');

const app =express();
const server=http.createServer(app);
const io = socketio(server);


// setting static folder to access the front end of the chatbot
app.use(express.static(path.join(__dirname,'public')))


//run when client connects 
const botName='chatcord-bot';

io.on('connection',socket=>{
    let sid;
    socket.on('joinroom',({username,room})=>{
        sid=socket.id;
        const user =userJoin(sid,username,room);
        
        socket.join(user.room);
        
        console.log('new connection here !')
            //emiting a messege 
        
        socket.emit('message',fomatMessage(botName,`Hey, ${user.username} welcome to the  room !!!`))
            
            //Broadcasting the entrance (all except the user so use broadcast)
        socket.broadcast.to(user.room).emit('message',fomatMessage(botName,`Hey,${user.username} just joined the chat `));
         
        //send user n rooom info 

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUsers(user.room)
        })



    });


   
    


    //listen for chat 

    socket.on('chatMessage',msg=>{
        const user= getCurrentUser(socket.id);

        

        console.log(user);

        io.to(user.room).emit('message',fomatMessage(user.username,msg))
    })



    socket.on('disconnect',()=>{
        const user=userLeave(sid);

        if(user){
            io.to(user.room).emit('message',fomatMessage(botName,`${user.username}has left the chat !`))

        }

        // //send user n rooom info 
        // io.to(user.room).emit('roomUsers',{
        //     room: user.room,
        //     users: getRoomUsers(user.room)
        // });

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUsers(user.room)
        })


        

    })


})




const PORT =3000 || process.env.PORT;

server.listen(PORT,()=>{

    console.log(`server is running on port : ${PORT}`)
})

