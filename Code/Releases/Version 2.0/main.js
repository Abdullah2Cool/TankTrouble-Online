var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(1200, 700, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.tilemap('map', 'gameMap.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'Tileset.png');
        this.game.load.image("tank", "Red Tank.png");
        this.game.load.image("otherTank", "Blue Tank.png");
        this.game.load.image("bullet", "bullet.png");
        this.FIREBASE = new util_Firebase();
    };
    SimpleGame.prototype.create = function () {
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
        this.tank = new Tank(this.game, 300, 200, "tank", this.id);
        this.game.add.existing(this.tank);
        this.game.camera.follow(this.tank);
        this.FIREBASE.pushNewestPlayer(this.tank.id);
        this.FIREBASE.checkForPreviousPlayers(this.tank.id, this.game, this.layer);
        this.FIREBASE.checkForNewPlayers(this.tank.id, this.game, this.layer);
        this.FIREBASE.onClose(this.tank.id);
    };
    SimpleGame.prototype.update = function () {
        this.tank.update();
        this.game.physics.arcade.collide(this.tank, this.layer);
        this.game.physics.arcade.collide(this.tank.weapon.bullets, this.layer);
        // this.FIREBASE.updatePlayerInfo(this.tank.id, this.tank.x, this.tank.y, this.tank.rotation, this.tank.bulletsShot);
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map