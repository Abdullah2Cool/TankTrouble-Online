var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameState = /** @class */ (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        var _this = _super.call(this) || this;
        _this.otherPlayers = {};
        _this.FIREBASE = new util_Firebase();
        return _this;
    }
    GameState.prototype.init = function (name) {
        this.name = name;
        this.socket = io();
        this.socket.on("serverState", function (data) {
            this.id = data.id;
            this.otherPlayers = data.otherPlayers;
            delete this.otherPlayers[this.id];
            console.log("My id from server:", this.id);
            console.log("Other Players:", this.otherPlayers);
        });
        this.socket.on("newPlayer", function (data) {
            this.otherPlayers[data.id] = data.newPlayer;
            console.log("Detected new player:", data.newPlayer);
        });
        this.socket.on("removed", function (data) {
            delete this.otherPlayers[data.id];
            console.log("Player Removed:", data.id);
            console.log("Other's list:", this.otherPlayers);
        });
        this.socket.on("timer", function (data) {
            console.log("Everyone else's info:");
            for (var i in data) {
                var x, y, r, id;
                if (i != this.id) {
                    x = data[i].x;
                    y = data[i].y;
                    r = data[i].r;
                    id = data[i].id;
                    console.log("id", i, "x:", x, "y:", y, "r:", r);
                }
            }
        });
    };
    GameState.prototype.preload = function () {
    };
    GameState.prototype.create = function () {
        this.game.stage.backgroundColor = '#dfdfdf';
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles');
        this.layer = this.map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        this.map.setCollision([33]);
        // this.tank = new Tank(this.game, this.game.rnd.integerInRange(100, this.game.width - 100),
        //     this.game.rnd.integerInRange(100, this.game.height), "tank", this.id);
        this.tank = new Tank(this.game, 400, 400, this.name, this.id, this.layer);
        this.game.add.existing(this.tank);
        this.game.camera.follow(this.tank);
        // this.FIREBASE.pushNewestPlayer(this.tank.id, this.name);
        // this.FIREBASE.checkForPreviousPlayers(this.tank.id, this.game, this.layer, this.tank);
        // this.FIREBASE.checkForNewPlayers(this.tank.id, this.game, this.layer, this.tank);
        // this.FIREBASE.onClose(this.tank.id);
    };
    GameState.prototype.update = function () {
        this.socket.emit('position', {
            x: this.tank.x,
            y: this.tank.y,
            r: this.tank.rotation,
            id: this.id
        });
    };
    return GameState;
}(Phaser.State));
