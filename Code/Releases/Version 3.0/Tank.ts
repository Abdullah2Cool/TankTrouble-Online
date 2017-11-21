var HealthBar;

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
    id: any;
    FIREBASE: util_Firebase;
    layer: TilemapLayer;
    otherTanks: Phaser.Group;
    maxBullets: number = 10;
    bulletInfo = []
    displayName: Phaser.Text;
    JoyStickPlugin;
    stick;
    shootButton;
    // healthbar;
    testBar;
    randomGenerator: Phaser.RandomDataGenerator;

    constructor(game: Phaser.Game, x: number, y: number, sName: string, id: any, layer: TilemapLayer) {
        super(game, x, y, "tank");
        this.game = game;
        this.sName = sName;
        this.velocity = 250;
        this.id = id;
        this.layer = layer;

        this.randomGenerator = new Phaser.RandomDataGenerator();

        this.maxHealth = 20;
        this.health = this.maxHealth;

        this.FIREBASE = new util_Firebase();
        this.otherTanks = game.add.group();

        console.log(sName);

        for (let i = 0; i < this.maxBullets; i++) {
            this.bulletInfo.push(0);
        }

        this.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this);
        // this.scale.setTo(0.8, 0.8);
        //  Creates 30 bullets, using the 'bullet' graphic
        this.weapon = game.add.weapon(this.maxBullets, 'red_bullet');
        //  The bullets will be automatically killed when they are 2000ms old
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 6000;
        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = 300;
        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 100;
        //  Tell the Weapon to track the 'player' Sprite
        //  With no offsets from the position
        //  But the 'true' argument tells the weapon to track sprite rotation
        this.weapon.trackSprite(this, 38, 0, true);
        this.weapon.onFire.add(this.bulletFire, this);
        this.weapon.onKill.add(this.bulletDead, this);

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.lefKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.shootKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.body.immovable = true;
        this.body.setCircle(33);

        let style = {
            font: "32px Arial",
            fill: "#ff0044"
        };

        this.displayName = this.game.add.text(0, 0, this.sName, style);
        this.displayName.anchor.set(0.5, 0.5);

        this.JoyStickPlugin = this.game.plugins.add(Phaser.VirtualJoystick);
        this.stick = this.JoyStickPlugin.addStick(0, 0, 100, 'arcade');
        this.stick.scale = 0.5;
        this.stick.alignBottomLeft(0);
        // this.stick.showOnTouch = true;

        this.shootButton = this.JoyStickPlugin.addButton(0, 0, 'arcade', 'button3-up', 'button3-down');
        this.shootButton.onDown.add(function () {
            this.weapon.fire();
        }, this);
        this.shootButton.alignBottomRight(0);
        this.shootButton.scale = 0.9;

        // this.healthbar = this.game.add.graphics(0, 0);
        this.testBar = new HealthBar(this.game, {
                width: 100,
                height: 10,
                x: 0,
                y: 0,
                bg: {
                    color: '#651828'
                },
                bar: {
                    color: '#FEFF03'
                },
                animationDuration: 10,
                flipped: false
            }
        );
    }

    bulletFire(bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        this.game.world.bringToTop(this);
    }

    bulletDead(sprite) {

    }

    update() {
        // collide with the map
        this.game.physics.arcade.collide(this, this.layer);
        // collide the bullets with the map
        this.game.physics.arcade.collide(this.weapon.bullets, this.layer);
        // collide with the the bullets
        this.game.physics.arcade.collide(this, this.weapon.bullets, this.bulletHit, null, this);
        // collide with other tank's bullets
        this.otherTanks.forEach(function (otherTank) {
            this.game.physics.arcade.collide(otherTank, this.weapon.bullets, this.bulletHit, null, this);
        }, this);

        // this.game.physics.arcade.collide(this.weapon.bullets, this.weapon.bullets);

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
        let x = 0;
        this.weapon.bullets.forEach(function (bull) {
            if (bull.alive) {
                this.bulletInfo[x] = 1;
            } else {
                this.bulletInfo[x] = 0;
            }
            x++;
        }, this);

        this.game.debug.body(this);

        this.displayName.x = Math.floor(this.x);
        this.displayName.y = Math.floor(this.y - this.height / 2 - 15);
        // this.displayName.angle = Math.


        if (this.stick.isDown) {
            this.game.physics.arcade.velocityFromRotation(this.stick.rotation, this.stick.force * this.velocity, this.body.velocity);
            this.rotation = this.stick.rotation;
        }

        this.testBar.setPosition(this.x, this.y - 70);
        this.testBar.setPercent((this.health / this.maxHealth) * 100);
        if (this.health == 0) {
            let p = this.randomGenerator.integerInRange(100, this.game.world.width - 100);
            this.reset(p, p, this.maxHealth);
        }

        this.FIREBASE.updatePlayerInfo(this.id, this.x, this.y, this.rotation, this.bulletInfo, this.sName, this.health);
    }

    bulletHit(tank, bullet) {
        bullet.kill();
        tank.health -= 1;
        console.log(this.health);
    }

    addNewPlayer(player: otherTank) {
        this.otherTanks.add(player);
        this.otherTanks.forEach(function (tank: otherTank) {
            tank.setOtherTanks(this.otherTanks);
        }, this);
    }

    getOtherPlayers(): Phaser.Group {
        return this.otherTanks;
    }
}
       