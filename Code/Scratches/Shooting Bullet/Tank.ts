class Tank extends Phaser.Sprite {

    sName: string;
    game: Phaser.Game;
    upKey: Phaser.Key;
    downKey: Phaser.Key;
    lefKey: Phaser.Key;
    rightKey: Phaser.Key;
    shootKey: Phaser.Key;
    velocity: number;
    weapon: Phaser.Weapon;

    constructor(game: Phaser.Game, x: number, y: number, sName: string) {
        super(game, x, y, sName);
        this.game = game;
        this.sName = sName;
        this.velocity = 250;

        this.anchor.setTo(0.5, 0.5);

        this.game.physics.arcade.enable(this);

        // this.scale.setTo(0.8, 0.8);
        //  Creates 30 bullets, using the 'bullet' graphic
        this.weapon = game.add.weapon(30, 'bullet');

        //  The bullets will be automatically killed when they are 2000ms old
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 6000;

        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = 500;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 100;

        //  Tell the Weapon to track the 'player' Sprite
        //  With no offsets from the position
        //  But the 'true' argument tells the weapon to track sprite rotation
        this.weapon.trackSprite(this, 0, 0, true);


        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.lefKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.shootKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    update() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.body.angularVelocity = 0;

        if (this.lefKey.isDown) {
            this.body.angularVelocity = -200;
        }
        else if (this.rightKey.isDown) {
            this.body.angularVelocity = 200;
        }

        if (this.upKey.isDown) {
            this.game.physics.arcade.velocityFromAngle(this.angle, this.velocity, this.body.velocity);
        } else if (this.downKey.isDown) {
            this.game.physics.arcade.velocityFromAngle(this.angle, -this.velocity, this.body.velocity);
        }

        if (this.shootKey.isDown) {
            this.weapon.fire();
        }
        this.weapon.debug();
    }
}