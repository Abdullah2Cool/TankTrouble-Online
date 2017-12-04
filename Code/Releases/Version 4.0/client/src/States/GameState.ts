class GameState extends Phaser.State {

    socket;
    map: Phaser.Tilemap;
    layer: Phaser.TilemapLayer;
    tank: Tank;
    // FIREBASE: util_Firebase;
    id: any;
    name: string;
    otherPlayers = {};

    constructor() {
        super();
        // this.FIREBASE = new util_Firebase();

    }

    init(name: string) {
        this.name = name;
    }

    preload() {

    }

    create() {

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

        this.socket = io();

        this.socket.on("serverState", this.onServerState.bind(this));

        this.socket.on("newPlayer", this.onNewPlayer.bind(this));

        this.socket.on("removed", this.onRemoved.bind(this));

        this.socket.on("timer", this.onTimer.bind(this));
    }

    update() {
        this.socket.emit('position', {
            x: this.tank.x,
            y: this.tank.y,
            r: this.tank.rotation,
            id: this.id
        });
    }

    createPlayer(game, id) {
        let p = new Tank(game, 0, 0, "other", id, this.layer);
        game.add.existing(p);
        return p;
    }

    onServerState(data) {
        this.id = data.id;
        this.otherPlayers = data.otherPlayers;

        console.log("My id from server:", this.id);
        console.log("Other Players:", this.otherPlayers);

        for (var x in this.otherPlayers) {
            var p = this.otherPlayers[x];
            var t = new otherTank(this.game, p.x, p.y, p.id, this.layer, this.tank, "other")
            this.otherPlayers[x] = t;
            this.game.add.existing(t);
        }
    }

    onNewPlayer(data) {
        this.otherPlayers[data.id] = 0;
        this.otherPlayers[data.id] = data.newPlayer;
        console.log("Detected new player:", data.newPlayer);

        console.log(data);
        console.log(data.newPlayer.x, data.newPlayer.y, data.id, this.game);

        var t = new otherTank(this.game, data.newPlayer.x, data.newPlayer.y, data.id, this.layer, this.tank, "NOOB");
        this.otherPlayers[data.id] = t;
        this.game.add.existing(t);

    }

    onRemoved(data) {
        this.otherPlayers[data.id].destroy();
        delete this.otherPlayers[data.id];
        console.log("Player Removed:", data.id);
        console.log("Other's list:", this.otherPlayers);
    }

    onTimer(data) {
        // console.log("Everyone else's info:");
        for (var i in data) {
            var x, y, r, id;
            if (i != this.id) {
                x = data[i].x;
                y = data[i].y;
                r = data[i].r;
                id = data[i].id;
                // console.log("id", i, "x:", x, "y:", y, "r:", r);

                // this.otherPlayers[i].x = x;
                // this.otherPlayers[i].y = y;
                // this.otherPlayers[i].rotation = r;

                this.otherPlayers[i].updateInfo(x, y, r);

                // console.log(this.otherPlayers[i]);
            }
        }
    }

}