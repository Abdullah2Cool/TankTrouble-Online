var HealthBar;
class Tank extends Phaser.Sprite {
    constructor(game, x, y, sName, id, socket) {
        super(game, x, y, "tank");
        this.bulletInfo = {};
        this.game = game;
        this.name = sName;
        this.velocity = 200;
        this.id = id;
        this.socket = socket;
        this.randomGenerator = new Phaser.RandomDataGenerator();
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.maxBullets = 10;
        console.log(sName);
        for (let i = 0; i < this.maxBullets; i++) {
            this.bulletInfo[i] = 0;
        }
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this);
        this.weapon = game.add.weapon(this.maxBullets, 'red_bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 5000;
        this.weapon.bulletSpeed = 300;
        this.weapon.fireRate = 100;
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
        this.displayName = this.game.add.text(0, 0, this.name, style);
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
        this.healthBar = new HealthBar(this.game, {
            width: 100,
            height: 10,
            x: 0,
            y: 0,
            bg: {
                color: '#ff000a'
            },
            bar: {
                color: '#47ff00'
            },
            animationDuration: 10,
            flipped: false
        });
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
        }
        else if (this.downKey.isDown) {
            this.game.physics.arcade.velocityFromAngle(this.angle, -this.velocity, this.body.velocity);
        }
        if (this.shootKey.isDown) {
            this.weapon.fire();
        }
        this.displayName.x = Math.floor(this.x);
        this.displayName.y = Math.floor(this.y - this.height / 2 - 15);
        // this.displayName.angle = Math.
        if (this.stick.isDown) {
            this.game.physics.arcade.velocityFromRotation(this.stick.rotation, this.stick.force * this.velocity, this.body.velocity);
            this.rotation = this.stick.rotation;
        }
        this.healthBar.setPosition(this.x, this.y - 70);
        this.healthBar.setPercent((this.health / this.maxHealth) * 100);
        if (this.health <= 0) {
            let p = this.randomGenerator.integerInRange(100, this.game.world.width - 100);
            this.reset(p, p, this.maxHealth);
        }
        let x = 0;
        this.weapon.bullets.forEach(function (bull) {
            if (bull.alive) {
                this.bulletInfo[x] = 1;
            }
            else {
                this.bulletInfo[x] = 0;
            }
            x++;
        }, this);
        // this.game.debug.body(this);
        // this.weapon.debug(16, 16, true);
    }
    bulletFire(bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        // this.game.world.bringToTop(this);
        this.socket.emit('shoot');
    }
    bulletDead(sprite) {
        // console.table(this.weapon.bullets.children, ['visible', 'alive', 'fancy']);
    }
}
