class SimpleGame {
    game: Phaser.Game;
    map: Phaser.Tilemap;
    layer: Phaser.TilemapLayer;
    tank: Tank;
    FIREBASE: util_Firebase;
    id: any;

    constructor(divID: string) {
        this.game = new Phaser.Game(900, 800, Phaser.AUTO, divID, {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    preload() {
        this.game.load.tilemap('map', 'gameMap.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'Tileset.png');
        this.game.load.image("tank", "Red Tank.png");
        this.game.load.image("otherTank", "Blue Tank.png");
        this.game.load.image("bullet", "bullet.png");

        this.FIREBASE = new util_Firebase();
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#dfdfdf';

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles');
        this.layer = this.map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        this.map.setCollision([33]);

        this.id = this.FIREBASE.generateKey();
        // this.tank = new Tank(this.game, this.game.rnd.integerInRange(100, this.game.width - 100),
        //     this.game.rnd.integerInRange(100, this.game.height), "tank", this.id);
        this.tank = new Tank(this.game, 300, 200, "tank", this.id, this.layer);
        this.game.add.existing(this.tank);
        this.game.camera.follow(this.tank);

        this.FIREBASE.pushNewestPlayer(this.tank.id);
        this.FIREBASE.checkForPreviousPlayers(this.tank.id, this.game, this.layer, this.tank);
        this.FIREBASE.checkForNewPlayers(this.tank.id, this.game, this.layer, this.tank);
        this.FIREBASE.onClose(this.tank.id);
    }


    update() {
        // this.tank.update();
    }
}

window.onload = () => {
    var game1 = new SimpleGame("content");
    // var game2 = new SimpleGame("second");
};