var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var HealthBar;
var Tank = (function (_super) {
    __extends(Tank, _super);
    function Tank(game, x, y, sName, id, layer, socket) {
        var _this = _super.call(this, game, x, y, "tank") || this;
        _this.maxBullets = 10;
        _this.bulletInfo = {};
        _this.game = game;
        _this.sName = sName;
        _this.velocity = 250;
        _this.id = id;
        _this.layer = layer;
        _this.socket = socket;
        _this.randomGenerator = new Phaser.RandomDataGenerator();
        _this.maxHealth = 20;
        _this.health = _this.maxHealth;
        // this.FIREBASE = new util_Firebase();
        _this.otherTanks = game.add.group();
        console.log(sName);
        for (var i = 0; i < _this.maxBullets; i++) {
            _this.bulletInfo[i] = 0;
        }
        _this.anchor.setTo(0.5, 0.5);
        _this.game.physics.arcade.enable(_this);
        _this.weapon = game.add.weapon(_this.maxBullets, 'red_bullet');
        //  The bullets will be automatically killed when they are 2000ms old
        _this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        _this.weapon.bulletLifespan = 5000;
        //  The speed at which the bullet is fired
        _this.weapon.bulletSpeed = 300;
        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        _this.weapon.fireRate = 100;
        //  Tell the Weapon to track the 'player' Sprite
        //  With no offsets from the position
        //  But the 'true' argument tells the weapon to track sprite rotation
        _this.weapon.trackSprite(_this, 38, 0, true);
        // this.weapon.bulletInheritSpriteSpeed = true;
        _this.weapon.onFire.add(_this.bulletFire, _this);
        _this.weapon.onKill.add(_this.bulletDead, _this);
        _this.upKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        _this.downKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        _this.lefKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        _this.rightKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        _this.shootKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        _this.body.immovable = true;
        _this.body.setCircle(33);
        var style = {
            font: "32px Arial",
            fill: "#ff0044"
        };
        _this.displayName = _this.game.add.text(0, 0, _this.sName, style);
        _this.displayName.anchor.set(0.5, 0.5);
        _this.JoyStickPlugin = _this.game.plugins.add(Phaser.VirtualJoystick);
        _this.stick = _this.JoyStickPlugin.addStick(0, 0, 100, 'arcade');
        _this.stick.scale = 0.5;
        _this.stick.alignBottomLeft(0);
        // this.stick.showOnTouch = true;
        _this.shootButton = _this.JoyStickPlugin.addButton(0, 0, 'arcade', 'button3-up', 'button3-down');
        _this.shootButton.onDown.add(function () {
            this.weapon.fire();
        }, _this);
        _this.shootButton.alignBottomRight(0);
        _this.shootButton.scale = 0.9;
        // this.healthbar = this.game.add.graphics(0, 0);
        _this.healthBar = new HealthBar(_this.game, {
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
        return _this;
    }
    Tank.prototype.bulletFire = function (bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        // console.log(this.bulletInfo);
        this.socket.emit('shoot');
    };
    Tank.prototype.bulletDead = function (sprite) {
        // console.table(this.weapon.bullets.children, ['visible', 'alive', 'fancy']);
    };
    Tank.prototype.update = function () {
        // collide with the map
        this.game.physics.arcade.collide(this, this.layer);
        // collide the bullets with the map
        this.game.physics.arcade.collide(this.weapon.bullets, this.layer);
        // collide with the the bullets
        this.game.physics.arcade.collide(this, this.weapon.bullets, this.bulletHitMe, null, this);
        // collide my bullets with the other tanks
        this.otherTanks.forEach(function (otherTank) {
            this.game.physics.arcade.collide(otherTank, this.weapon.bullets, this.bulletHitOther, null, this);
        }, this);
        // collide otherTank's bullets with me
        this.otherTanks.forEach(function (otherTank) {
            this.game.physics.arcade.collide(this, otherTank.weapon.bullets, this.bulletHitMeFromOther, null, this);
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
        }
        else if (this.downKey.isDown) {
            this.game.physics.arcade.velocityFromAngle(this.angle, -this.velocity, this.body.velocity);
        }
        if (this.shootKey.isDown) {
            this.weapon.fire();
        }
        this.game.debug.body(this);
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
            var p = this.randomGenerator.integerInRange(100, this.game.world.width - 100);
            this.reset(p, p, this.maxHealth);
        }
        this.weapon.debug(16, 16, true);
        var x = 0;
        this.weapon.bullets.forEach(function (bull) {
            if (bull.alive) {
                this.bulletInfo[x] = 1;
            }
            else {
                this.bulletInfo[x] = 0;
            }
            x++;
        }, this);
    };
    Tank.prototype.bulletHitMeFromOther = function (tank, bullet) {
        bullet.kill();
        tank.health -= 1;
        console.log("Someone else's bullet hit me.");
    };
    Tank.prototype.bulletHitOther = function (tank, bullet) {
        bullet.kill();
        console.log("My bullet hit someone else.");
    };
    Tank.prototype.bulletHitMe = function (tank, bullet) {
        bullet.kill();
        tank.health -= 1;
        console.log("My bullet hit me.");
    };
    Tank.prototype.addNewPlayer = function (player) {
        this.otherTanks.add(player);
    };
    Tank.prototype.getOtherPlayers = function () {
        return this.otherTanks;
    };
    return Tank;
}(Phaser.Sprite));
