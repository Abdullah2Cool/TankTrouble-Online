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
var TilemapLayer = Phaser.TilemapLayer;
var otherTank = (function (_super) {
    __extends(otherTank, _super);
    // testBar;
    function otherTank(game, x, y, id, layer, tank, sName) {
        var _this = _super.call(this, game, x, y, "otherTank") || this;
        _this.bulletInfo = [];
        _this.maxBullets = 10;
        _this.game = game;
        _this.id = id;
        _this.FIREBASE = new util_Firebase();
        _this.layer = layer;
        _this.tank = tank;
        _this.sName = sName;
        for (var i = 0; i < _this.maxBullets; i++) {
            _this.bulletInfo.push(0);
        }
        _this.otherTanks = tank.getOtherPlayers();
        _this.anchor.setTo(0.5, 0.5);
        _this.game.physics.arcade.enable(_this);
        _this.weapon = game.add.weapon(6, 'blue_bullet');
        _this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        _this.weapon.bulletLifespan = 6000;
        _this.weapon.bulletSpeed = 300;
        _this.weapon.fireRate = 100;
        _this.weapon.trackSprite(_this, 38, 0, true);
        _this.weapon.onFire.add(_this.bulletFire, _this);
        _this.weapon.onKill.add(_this.bulletDead, _this);
        _this.body.setCircle(33);
        _this.body.immovable = true;
        _this.FIREBASE.getDatabase().ref("Players/" + _this.id).on("value", function (snap) {
            if (!snap.exists()) {
                console.log("Player doesn't exist anymore.");
                _this.destroy();
                _this.displayName.destroy();
                _this.weapon.bullets.destroy();
            }
            else {
                _this.x = snap.val().x;
                _this.y = snap.val().y;
                _this.rotation = snap.val().r;
                _this.sName = snap.val().name;
                _this.health = snap.val().health;
            }
        });
        _this.FIREBASE.getDatabase().ref("Players/" + _this.id + "/bullets").on("value", function (snap) {
            if (snap.exists()) {
                var bulletsInCloud_1 = snap.val();
                console.log("Local: " + _this.bulletInfo);
                console.log("Cloud: " + bulletsInCloud_1);
                _this.bulletInfo = bulletsInCloud_1;
                var x_1 = 0;
                _this.weapon.bullets.forEach(function (bull) {
                    if (bulletsInCloud_1[x_1] == 0) {
                        this.bulletInfo[x_1] = 0;
                    }
                    else {
                        this.bulletInfo[x_1] = 1;
                    }
                    x_1++;
                }, _this);
                console.log("Updated: " + _this.bulletInfo);
            }
        });
        var style = {
            font: "32px Arial",
            fill: "#0009ff"
        };
        _this.displayName = _this.game.add.text(0, 0, _this.sName, style);
        _this.displayName.anchor.set(0.5, 0.5);
        return _this;
    }
    otherTank.prototype.bulletFire = function (bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        this.game.world.bringToTop(this);
    };
    otherTank.prototype.bulletDead = function (sprite) {
        // this.bulletsShot -= 1;
    };
    otherTank.prototype.update = function () {
        this.game.physics.arcade.collide(this.weapon.bullets, this.layer);
        // collide with the main player's bullets of this instance of the game
        this.game.physics.arcade.collide(this.tank, this.weapon.bullets, this.bulletHit);
        // collide with otherPlayers' bullets
        this.otherTanks.forEach(function (otherTank) {
            this.game.physics.arcade.collide(otherTank, this.weapon.bullets, this.bulletHit);
        }, this);
        var x = 0;
        this.weapon.bullets.forEach(function (bull) {
            if (this.bulletInfo[x] == 1) {
                if (!bull.alive) {
                    this.weapon.fire();
                    console.log("Other Player shot bullet.");
                }
            }
            else {
                if (bull.alive) {
                    bull.kill();
                    console.log("The bullet died.");
                }
            }
            x++;
        }, this);
        this.displayName.x = Math.floor(this.x);
        this.displayName.y = Math.floor(this.y - this.height / 2 - 15);
        // this.testBar.setPosition(this.x, this.y - 70);
        // this.testBar.setPercent((this.health / this.maxHealth) * 100);
    };
    otherTank.prototype.bulletHit = function (tank, bullet) {
        console.log("Other tank shot me.");
        tank.health -= 1;
        bullet.kill();
    };
    otherTank.prototype.setOtherTanks = function (otherTanks) {
        this.otherTanks = otherTanks;
    };
    return otherTank;
}(Phaser.Sprite));
//# sourceMappingURL=otherTank.js.map