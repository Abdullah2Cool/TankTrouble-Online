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
    function otherTank(game, x, y, id, layer, tank) {
        var _this = _super.call(this, game, x, y, "otherTank") || this;
        _this.game = game;
        _this.id = id;
        _this.FIREBASE = new util_Firebase();
        _this.bulletsShot = 0;
        _this.layer = layer;
        _this.tank = tank;
        _this.anchor.setTo(0.5, 0.5);
        _this.game.physics.arcade.enable(_this);
        _this.weapon = game.add.weapon(30, 'bullet');
        _this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        _this.weapon.bulletLifespan = 6000;
        _this.weapon.bulletSpeed = 300;
        _this.weapon.fireRate = 100;
        _this.weapon.trackSprite(_this, 0, 0, true);
        _this.weapon.onFire.add(_this.bulletFire, _this);
        _this.weapon.onKill.add(_this.bulletDead, _this);
        _this.body.immovable = true;
        _this.FIREBASE.getDatabase().ref("Players/" + _this.id).on("value", function (snap) {
            if (!snap.exists()) {
                console.log("Player doesn't exist anymore.");
                _this.destroy();
            }
            else {
                _this.x = snap.val().x;
                _this.y = snap.val().y;
                _this.rotation = snap.val().r;
            }
        });
        _this.FIREBASE.getDatabase().ref("Players/" + _this.id).on("value", function (snap) {
            if (snap.exists()) {
                if (snap.val().bullet != _this.bulletsShot) {
                    console.log("Other Player shot bullet.");
                    _this.weapon.trackSprite(_this, 0, 0, true);
                    while (snap.val().bullet > _this.bulletsShot) {
                        console.log("Bullets remaining to shoot: " + (snap.val().bullet - _this.bulletsShot));
                        _this.weapon.fire();
                        _this.bulletsShot += 1;
                    }
                }
            }
        });
        return _this;
    }
    otherTank.prototype.bulletFire = function (bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
    };
    otherTank.prototype.bulletDead = function (sprite) {
        this.bulletsShot -= 1;
    };
    otherTank.prototype.update = function () {
        this.game.physics.arcade.collide(this.weapon.bullets, this.layer);
        this.game.physics.arcade.collide(this.tank, this.weapon.bullets, this.bulletHit);
    };
    otherTank.prototype.bulletHit = function (tank, bullet) {
        console.log("Other tank shot me.");
        bullet.kill();
    };
    return otherTank;
}(Phaser.Sprite));
//# sourceMappingURL=otherTank.js.map