"use strict";
var socket;
socket = io.connect("http://localhost:3000");
console.log("TypeScript Started.");
var data = {
    x: Math.floor(Math.random() * 6) + 1,
    y: Math.floor(Math.random() * 6) + 1
};
console.log("Sending Data");
socket.emit("mouse", data);
socket.on("mouse", receivedMessage);
function receivedMessage(data) {
    console.log("Received Data: ");
    console.log(data);
}
