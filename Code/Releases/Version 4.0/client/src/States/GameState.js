class GameState extends Phaser.State {
    constructor() {
        super();
        this.otherPlayers = {};
    }
    init(name) {
        this.name = name;
    }
    preload() {
    }
    create() {
        this.socket = io();
        this.otherGroup = this.game.add.group();
        this.game.stage.backgroundColor = '#dfdfdf';
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles');
        this.layer = this.map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        this.map.setCollision([33]);
        this.tank = new Tank(this.game, 400, 400, this.name, this.id, this.socket);
        this.game.add.existing(this.tank);
        this.game.camera.follow(this.tank);
        this.socket.emit("start", { name: this.name });
        this.socket.on("serverState", this.onServerState.bind(this));
        this.socket.on("newPlayer", this.onNewPlayer.bind(this));
        this.socket.on("removed", this.onRemoved.bind(this));
        this.socket.on("update", this.onUpdate.bind(this));
        this.socket.on("shoot", this.onShoot.bind(this));
    }
    update() {
        this.socket.emit('position', {
            x: this.tank.x,
            y: this.tank.y,
            r: this.tank.rotation,
            id: this.id,
            health: this.tank.health,
        });
        ////////////////////////////////////// handle all collisions ///////////////////////////////////////////
        // tank-with walls
        this.game.physics.arcade.collide(this.tank, this.layer);
        // otherTanks with walls
        this.game.physics.arcade.collide(this.otherGroup, this.layer);
        // tank bullets with walls
        this.game.physics.arcade.collide(this.tank.weapon.bullets, this.layer);
        // otherTanks bullets with walls
        this.otherGroup.forEach(function (t) {
            this.game.physics.arcade.collide(t.weapon.bullets, this.layer);
        }, this);
        // tank with it's own bullets
        this.game.physics.arcade.collide(this.tank, this.tank.weapon.bullets, function (tank, bullet) {
            bullet.kill();
            tank.health -= 1;
            console.log("I shot myself.");
        });
        // otherTanks with their own bullets
        this.otherGroup.forEach(function (t) {
            this.game.physics.arcade.collide(t, t.weapon.bullets, function (tank, bullet) {
                bullet.kill();
                console.log("Other tank shot himself.");
            });
        }, this);
        // tank bullets with otherTanks
        this.otherGroup.forEach(function (t) {
            this.game.physics.arcade.collide(t, this.tank.weapon.bullets, function (tank, bullet) {
                bullet.kill();
                console.log("I shot other Tank");
            });
        }, this);
        // otherTanks bullets with me
        this.otherGroup.forEach(function (t) {
            this.game.physics.arcade.collide(this.tank, t.weapon.bullets, function (tank, bullet) {
                bullet.kill();
                tank.health -= 1;
                console.log("Other tank shot me.");
            });
        }, this);
    }
    onShoot(data) {
        this.otherPlayers[data.id].weapon.fire();
        // console.log(data.id, "shot a bullet.");
    }
    onServerState(data) {
        this.id = data.id;
        console.log("My id from server:", this.id);
        console.log("Other Players:", this.otherPlayers);
        for (var x in data.otherPlayers) {
            var p = data.otherPlayers[x];
            var t = new otherTank(this.game, p.x, p.y, p.id, p.name);
            this.otherPlayers[x] = t;
            // this.tank.addNewPlayer(t);
            this.otherGroup.add(t);
        }
    }
    onNewPlayer(data) {
        console.log("Detected new player:", data.newPlayer);
        console.log(data);
        var t = new otherTank(this.game, data.newPlayer.x, data.newPlayer.y, data.id, data.name);
        this.otherPlayers[data.id] = t;
        // this.tank.addNewPlayer(t);
        this.otherGroup.add(t);
    }
    onRemoved(data) {
        this.otherPlayers[data.id].displayName.destroy();
        this.otherPlayers[data.id].weapon.bullets.destroy();
        this.otherPlayers[data.id].healthBar.kill();
        this.otherPlayers[data.id].destroy();
        delete this.otherPlayers[data.id];
        console.log("Player Removed:", data.id);
        console.log("Other's list:", this.otherPlayers);
    }
    onUpdate(data) {
        // console.log("Everyone else's info:");
        for (var i in data) {
            var x, y, r, id, health;
            if (i != this.id) {
                x = data[i].x;
                y = data[i].y;
                r = data[i].r;
                id = data[i].id;
                health = data[i].health;
                if (this.otherPlayers[i] == null) {
                    console.log("Player is null.");
                }
                else {
                    this.otherPlayers[i].updateInfo(x, y, r, health);
                }
            }
        }
    }
}
