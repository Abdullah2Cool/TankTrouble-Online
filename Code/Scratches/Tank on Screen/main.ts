/// <reference path="./tsDefinitions/phaser.d.ts" />
/// <reference path="./tsDefinitions/pixi.d.ts" />

class SimpleGame {
    game: Phaser.Game;
    sprTank: Phaser.Sprite;

    upKey: Phaser.Key;
    downKey: Phaser.Key;
    lefKey: Phaser.Key;
    rightKey: Phaser.Key;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    preload() {
        this.game.load.image("logo", "Red Tank.png");
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = "#333333";
        this.sprTank = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "logo");
        this.sprTank.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(this.sprTank, Phaser.Physics.ARCADE);

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.lefKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

    update() {
        this.sprTank.body.velocity.x = 0;
        this.sprTank.body.velocity.y = 0;
        this.sprTank.body.angularVelocity = 0;

        if (this.lefKey.isDown) {
            this.sprTank.body.angularVelocity = -200;
        }
        else if (this.rightKey.isDown) {
            this.sprTank.body.angularVelocity = 200;
        }

        if (this.upKey.isDown) {
            this.game.physics.arcade.velocityFromAngle(this.sprTank.angle, 300, this.sprTank.body.velocity);
        } else if (this.downKey.isDown) {
            this.game.physics.arcade.velocityFromAngle(this.sprTank.angle, -300, this.sprTank.body.velocity);
        }
    }

}

window.onload = () => {
    var game = new SimpleGame();
};