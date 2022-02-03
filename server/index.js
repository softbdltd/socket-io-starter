const http = require('http');
const express = require('express');
const router = require('./router');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//Db config
const db = require('./config/keys').mongoURI;
//connect to mongodb
mongoose.connect(db).then(() => {
    console.log("Mongo db connected")
}).catch(err => console.log("error", err));
const app = express();

app.use(bodyParser.json());

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000", allowedHeaders: '*', credentials: true, methods: ["GET", "POST"]
    },
});

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');

app.use(router);
let clients = [];
const getVisitors = () => {
    /*    let clients = io.sockets.clients().connected;
        let sockets = Object.values(clients); //object to array*/
    /*  console.log("clients",clients);*/

    return clients.map((client) => {
        console.log('client.user', client.user);
        return client.user;
    });
}

const emitVisitors = () => {
    io.emit("visitors", getVisitors());
}
io.on('connection', (socket) => {
    clients.push(socket);
    console.log("We have new connection");

    socket.on('new_visitor', (user) => {
        /*console.log("new visitor ", user);*/
        socket.user = user;
        // console.log(user);
        // console.log(socket);
        emitVisitors();
    })
    socket.on('join', ({name, room}, callback) => {
        console.log("name & room", name, room);
        const {error, user} = addUser({id: socket.id, name, room});
        if (error) {
            return callback(error)
        }
        //admin genrated msgs are 'message' event amd user genereated msgs are 'sendmessage' event

        socket.emit('message', {user: 'admin', text: `${user.name} welcome to the room`});

        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined`});
        socket.join(user.room);
        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});
        callback();
    })
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', {user: user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)}); //send a new message when user leaves

    })
    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socket), 1);
        emitVisitors();
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} had left`});
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});
        }
        console.log("User have just left");
    });
})
server.listen(5000, () => {
    console.log(`server d is listening on 5000`);
})



