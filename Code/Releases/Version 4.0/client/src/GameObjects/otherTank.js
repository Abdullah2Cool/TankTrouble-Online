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
var otherTank = /** @class */ (function (_super) {
    __extends(otherTank, _super);
    function otherTank(game, x, y, id, layer, tank, sName) {
        var _this = _super.call(this, game, x, y, "otherTank") || this;
        _this.bulletInfo = [];
        _this.shotOnce = [];
        _this.maxBullets = 10;
        _this.game = game;
        _this.id = id;
        _this.FIREBASE = new util_Firebase();
        _this.layer = layer;
        _this.tank = tank;
        _this.sName = sName;
        _this.maxHealth = 20;
        _this.health = _this.maxHealth;
        for (var i = 0; i < _this.maxBullets; i++) {
            _this.bulletInfo.push(0);
            _this.shotOnce.push(0);
        }
        // this.otherTanks = tank.getOtherPlayers();
        _this.anchor.setTo(0.5, 0.5);
        _this.game.physics.arcade.enable(_this);
        _this.weapon = game.add.weapon(_this.maxBullets, 'blue_bullet');
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
                _this.healthBar.kill();
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
                var bulletsInCloud = snap.val();
                // console.log("Local: " + this.bulletInfo);
                // console.log("Cloud: " + bulletsInCloud + "\n");
                for (x = 0; x < _this.maxBullets; x++) {
                    // if the bullet is dead here and in firebase, reset shotOnce
                    _this.bulletInfo[x] = bulletsInCloud[x];
                }
                // console.log("Updated: " + this.bulletInfo);
            }
        });
        var style = {
            font: "32px Arial",
            fill: "#0009ff"
        };
        _this.displayName = _this.game.add.text(0, 0, _this.sName, style);
        _this.displayName.anchor.set(0.5, 0.5);
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
    otherTank.prototype.bulletFire = function (bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        this.game.world.bringToTop(this);
    };
    otherTank.prototype.bulletDead = function (sprite) {
        // this.bulletsShot -= 1;
    };
    otherTank.prototype.update = function () {
        // collide my bullets with the walls
        this.game.physics.arcade.collide(this.weapon.bullets, this.layer);
        // collide my bullets with myself
        this.game.physics.arcade.collide(this, this.weapon.bullets, this.bulletHit, null, this);
        this.displayName.x = Math.floor(this.x);
        this.displayName.y = Math.floor(this.y - this.height / 2 - 15);
        this.healthBar.setPosition(this.x, this.y - 70);
        this.healthBar.setPercent((this.health / this.maxHealth) * 100);
        var x = 0;
        this.weapon.bullets.forEach(function (bull) {
            if (this.bulletInfo[x] == 0) {
                bull.kill();
            }
            else {
                if (!bull.alive) {
                    this.weapon.fire();
                }
            }
            x++;
        }, this);
    };
    otherTank.prototype.bulletHit = function (tank, bullet) {
        bullet.kill();
    };
    return otherTank;
}(Phaser.Sprite));
