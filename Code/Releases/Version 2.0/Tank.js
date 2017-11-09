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
var Tank = (function (_super) {
    __extends(Tank, _super);
    function Tank(game, x, y, sName, id) {
        var _this = _super.call(this, game, x, y, sName) || this;
        _this.game = game;
        _this.sName = sName;
        _this.velocity = 250;
        _this.id = id;
        _this.FIREBASE = new util_Firebase();
        _this.bulletsShot = 0;
        _this.anchor.setTo(0.5, 0.5);
        _this.game.physics.arcade.enable(_this);
        // this.scale.setTo(0.8, 0.8);
        //  Creates 30 bullets, using the 'bullet' graphic
        _this.weapon = game.add.weapon(30, 'bullet');
        //  The bullets will be automatically killed when they are 2000ms old
        _this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        _this.weapon.bulletLifespan = 6000;
        //  The speed at which the bullet is fired
        _this.weapon.bulletSpeed = 300;
        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        _this.weapon.fireRate = 100;
        //  Tell the Weapon to track the 'player' Sprite
        //  With no offsets from the position
        //  But the 'true' argument tells the weapon to track sprite rotation
        _this.weapon.trackSprite(_this, 0, 0, true);
        _this.weapon.onFire.add(_this.bulletFire, _this);
        _this.weapon.onKill.add(_this.bulletDead, _this);
        _this.upKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        _this.downKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        _this.lefKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        _this.rightKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        _this.shootKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        return _this;
    }
    Tank.prototype.bulletFire = function (bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        this.bulletsShot += 1;
        console.log(this.bulletsShot);
    };
    Tank.prototype.bulletDead = function (sprite) {
        this.bulletsShot -= 1;
        console.log(this.bulletsShot);
    };
    Tank.prototype.update = function () {
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
        this.FIREBASE.updatePlayerInfo(this.id, this.x, this.y, this.rotation, this.bulletsShot);
        this.weapon.debug();
        if (this.shootKey.isDown) {
            this.weapon.fire();
        }
    };
    return Tank;
}(Phaser.Sprite));
//# sourceMappingURL=Tank.js.map