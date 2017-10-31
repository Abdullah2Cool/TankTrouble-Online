var express = require("express");
var app = express();
var server = app.listen(3000);

app.use(express.static('public'));
var socket = require("socket.io");
var io = socket(server);
var firebase = require("firebase");


var config = {
    apiKey: "AIzaSyBiRVH6DENRjU92fUdVpSRFbqg6BkzP1dY",
    authDomain: "tank-trouble-online.firebaseapp.com",
    databaseURL: "https://tank-trouble-online.firebaseio.com",
    projectId: "tank-trouble-online",
    storageBucket: "tank-trouble-online.appspot.com",
    messagingSenderId: "446961097968"
}

firebase.initializeApp(config);

var database  = firebase.database();
var ref = database.ref("/users");
console.log("Firebase Stuff");
// console.log(firebase);

ref.set({
    Connection: "Successful"
});

io.sockets.on("connection", newConnection);

function newConnection(socket) {
    console.log("New connections: " + socket.id);

    socket.on('mouse', mouseMsg);

    function mouseMsg (data) {
        ref.set(data);
        socket.broadcast.emit("mouse", data);
        console.log(data);
    }
}
