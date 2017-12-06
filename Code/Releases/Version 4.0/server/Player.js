"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = (function () {
    function Player(id, name) {
        this.x = 400;
        this.y = 400;
        this.r = 0;
        this.health = 20;
        this.id = id;
        this.name = name;
    }
    return Player;
}());
exports.Player = Player;
