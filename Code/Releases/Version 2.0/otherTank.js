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
var otherTank = (function (_super) {
    __extends(otherTank, _super);
    function otherTank(game, x, y, id) {
        var _this = _super.call(this, game, x, y, "tank") || this;
        _this.game = game;
        _this.id = id;
        _this.FIREBASE = new util_Firebase();
        _this.anchor.setTo(0.5, 0.5);
        _this.game.physics.arcade.enable(_this);
        _this.weapon = game.add.weapon(30, 'bullet');
        _this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        _this.weapon.bulletLifespan = 6000;
        _this.weapon.bulletSpeed = 300;
        _this.weapon.fireRate = 100;
        _this.weapon.trackSprite(_this, 0, 0, true);
        _this.weapon.onFire.add(_this.bulletFire);
        _this.FIREBASE.getDatabase().ref("Players/" + _this.id).on("value", function (snap) {
            _this.x = snap.val().x;
            _this.y = snap.val().y;
            _this.rotation = snap.val().r;
        });
        return _this;
    }
    otherTank.prototype.bulletFire = function (bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        // console.log(bullet);
    };
    return otherTank;
}(Phaser.Sprite));
//# sourceMappingURL=otherTank.js.map