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
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        var _this = _super.call(this) || this;
        _this.otherPlayers = {};
        return _this;
        // this.FIREBASE = new util_Firebase();
    }
    GameState.prototype.init = function (name) {
        this.name = name;
    };
    GameState.prototype.preload = function () {
    };
    GameState.prototype.create = function () {
        this.socket = io();
        this.game.stage.backgroundColor = '#dfdfdf';
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles');
        this.layer = this.map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        this.map.setCollision([33]);
        // this.tank = new Tank(this.game, this.game.rnd.integerInRange(100, this.game.width - 100),
        //     this.game.rnd.integerInRange(100, this.game.height), "tank", this.id);
        this.tank = new Tank(this.game, 400, 400, this.name, this.id, this.layer, this.socket);
        this.game.add.existing(this.tank);
        this.game.camera.follow(this.tank);
        // this.FIREBASE.pushNewestPlayer(this.tank.id, this.name);
        // this.FIREBASE.checkForPreviousPlayers(this.tank.id, this.game, this.layer, this.tank);
        // this.FIREBASE.checkForNewPlayers(this.tank.id, this.game, this.layer, this.tank);
        // this.FIREBASE.onClose(this.tank.id);
        this.socket.emit("start", { name: this.name });
        this.socket.on("serverState", this.onServerState.bind(this));
        this.socket.on("newPlayer", this.onNewPlayer.bind(this));
        this.socket.on("removed", this.onRemoved.bind(this));
        this.socket.on("timer", this.onTimer.bind(this));
        this.socket.on("selfHit", this.onSelfHit.bind(this));
        this.socket.on("shoot", this.onShoot.bind(this));
    };
    GameState.prototype.update = function () {
        this.socket.emit('position', {
            x: this.tank.x,
            y: this.tank.y,
            r: this.tank.rotation,
            id: this.id,
            health: this.tank.health,
        });
    };
    GameState.prototype.onShoot = function (data) {
        this.otherPlayers[data.id].weapon.fire();
        console.log(data.id, "shot a bullet.");
    };
    GameState.prototype.onSelfHit = function (data) {
        var b = 0;
        this.tank.weapon.forEach(function (bull) {
            if (b == data.bullet) {
                bull.kill();
                this.tank.health -= 1;
                this.tank.bulletInfo[b] = -1;
            }
            b += 1;
        }, this);
    };
    GameState.prototype.onServerState = function (data) {
        this.id = data.id;
        console.log("My id from server:", this.id);
        console.log("Other Players:", this.otherPlayers);
        for (var x in data.otherPlayers) {
            var p = data.otherPlayers[x];
            var t = new otherTank(this.game, p.x, p.y, p.id, this.layer, this.tank, p.name);
            this.otherPlayers[x] = t;
            // this.game.add.existing(t);
            this.tank.addNewPlayer(t);
        }
    };
    GameState.prototype.onNewPlayer = function (data) {
        console.log("Detected new player:", data.newPlayer);
        console.log(data);
        var t = new otherTank(this.game, data.newPlayer.x, data.newPlayer.y, data.id, this.layer, this.tank, data.name);
        this.otherPlayers[data.id] = t;
        // this.game.add.existing(t);
        this.tank.addNewPlayer(t);
    };
    GameState.prototype.onRemoved = function (data) {
        this.otherPlayers[data.id].displayName.destroy();
        this.otherPlayers[data.id].weapon.bullets.destroy();
        this.otherPlayers[data.id].healthBar.kill();
        this.otherPlayers[data.id].destroy();
        delete this.otherPlayers[data.id];
        console.log("Player Removed:", data.id);
        console.log("Other's list:", this.otherPlayers);
    };
    GameState.prototype.onTimer = function (data) {
        // console.log("Everyone else's info:");
        for (var i in data) {
            var x, y, r, id, health, bulletInfo;
            if (i != this.id) {
                x = data[i].x;
                y = data[i].y;
                r = data[i].r;
                id = data[i].id;
                health = data[i].health;
                // bulletInfo = data[i].bulletInfo;
                // console.log("id", i, "x:", x, "y:", y, "r:", r);
                // console.log("Update info:", bulletInfo);
                if (this.otherPlayers[i] == null) {
                    console.log("Player is null.");
                }
                else {
                    this.otherPlayers[i].updateInfo(x, y, r, health);
                }
            }
        }
    };
    return GameState;
}(Phaser.State));
