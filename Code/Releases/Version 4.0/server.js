"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player_1 = require("./server/Player");
var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/*', function (req, res) {
    var file = req.params[0];
    // console.log('\t :: Express :: file requested : ' + file);
    res.sendFile(__dirname + "/client/" + file);
});
server.listen(process.env.PORT || 3000);
console.log("Server started on localhost:3000");
var io = require('socket.io')(server, {});
var ALL_SOCKETS = {};
var ALL_PLAYERS = {};
io.on('connect', function (socket) {
    console.log("Socket connected:", socket.id);
    // tell the client their own id and the rest of the player
    socket.emit("serverState", {
        id: socket.id,
        otherPlayers: ALL_PLAYERS
    });
    var player = new Player_1.Player(socket.id);
    ALL_SOCKETS[socket.id] = socket;
    ALL_PLAYERS[socket.id] = player;
    // tell everyone else that their is a new player
    socket.broadcast.emit("newPlayer", {
        id: socket.id,
        newPlayer: player
    });
    socket.on("position", function (data) {
        // console.log(data);
        ALL_PLAYERS[socket.id].x = data.x;
        ALL_PLAYERS[socket.id].y = data.y;
        ALL_PLAYERS[socket.id].r = data.r;
    });
    socket.on("disconnect", function () {
        delete ALL_SOCKETS[socket.id];
        delete ALL_PLAYERS[socket.id];
        socket.broadcast.emit("removed", {
            id: socket.id
        });
        console.log("Socket disconnected:", socket.id);
    });
});
setInterval(function () {
    var pack = {};
    for (var i in ALL_PLAYERS) {
        var player;
        player = ALL_PLAYERS[i];
        pack[i] = {
            x: player.x,
            y: player.y,
            r: player.r
        };
    }
    for (var i in ALL_SOCKETS) {
        var socket = ALL_SOCKETS[i];
        socket.emit("timer", pack);
    }
}, 1000 / 30);
