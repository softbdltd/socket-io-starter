const http = require('http');
const express = require('express');
const router = require('./router');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//Db config
const db = require('./config/keys').mongoURI;
//connect to mongodb
mongoose.connect(db).then(()=>{
    console.log("Mongo db connected")
}).catch(err=> console.log("error",err));
const app = express();

app.use(bodyParser.json());

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        allowedHeaders: '*',
        credentials: true,
    },
});

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');

app.use(router);

io.on('connection',(socket)=>{

    socket.on('disconnect',()=>{
        console.log("socket index", clients.indexOf(socket));
        clients.splice(clients.indexOf(socket), 1);
        emitVisitors();
        console.log("User have just left");
    });
})
server.listen(5000,()=>{
    console.log(`server d is listening on 5000`);
})



