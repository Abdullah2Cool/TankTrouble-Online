class GameState extends Phaser.State {

    map: Phaser.Tilemap;
    layer: Phaser.TilemapLayer;
    tank: Tank;
    FIREBASE: util_Firebase;
    id: any;
    name: string;

    constructor() {
        super();
        this.FIREBASE = new util_Firebase();
    }

    init(name: string) {
        this.name = name;
    }

    preload () {
        this.game.load.script('joystick', 'phaser-virtual-joystick.js');
    }

    create() {

        this.game.stage.backgroundColor = '#dfdfdf';
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles');
        this.layer = this.map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        this.map.setCollision([33]);

        this.id = this.FIREBASE.generateKey();
        // this.tank = new Tank(this.game, this.game.rnd.integerInRange(100, this.game.width - 100),
        //     this.game.rnd.integerInRange(100, this.game.height), "tank", this.id);
        this.tank = new Tank(this.game, 400, 400, this.name, this.id, this.layer);
        this.game.add.existing(this.tank);
        this.game.camera.follow(this.tank);

        this.FIREBASE.pushNewestPlayer(this.tank.id, this.name);
        this.FIREBASE.checkForPreviousPlayers(this.tank.id, this.game, this.layer, this.tank);
        this.FIREBASE.checkForNewPlayers(this.tank.id, this.game, this.layer, this.tank);
        this.FIREBASE.onClose(this.tank.id);
    }

    update() {

    }

}