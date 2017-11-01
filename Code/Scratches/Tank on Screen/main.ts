/// <reference path="./tsDefinitions/phaser.d.ts" />

class SimpleGame {
    game: Phaser.Game;
    tank: Tank;


    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    preload() {
        this.game.load.image("tank", "Red Tank.png");
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = "#333333"

        this.tank = new Tank(this.game, 100, 100, "tank");
        this.game.add.existing(this.tank);

    }

    update() {
        this.tank.update();
    }

}

window.onload = () => {
    var game = new SimpleGame();
};