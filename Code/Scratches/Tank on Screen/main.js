/// <reference path="./tsDefinitions/phaser.d.ts" />
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image("tank", "Red Tank.png");
    };
    SimpleGame.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = "#333333";
        this.tank = new Tank(this.game, 100, 100, "tank");
        this.game.add.existing(this.tank);
    };
    SimpleGame.prototype.update = function () {
        this.tank.update();
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map