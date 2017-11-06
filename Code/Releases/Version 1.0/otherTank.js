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
    function otherTank(game, x, y, id, FIREBASE) {
        var _this = _super.call(this, game, x, y, "tank") || this;
        _this.game = game;
        _this.id = id;
        _this.FIREBASE = FIREBASE;
        _this.anchor.setTo(0.5, 0.5);
        _this.game.physics.arcade.enable(_this);
        // // this.scale.setTo(0.8, 0.8);
        // //  Creates 30 bullets, using the 'bullet' graphic
        // this.weapon = game.add.weapon(30, 'bullet');
        // //  The bullets will be automatically killed when they are 2000ms old
        // this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        // this.weapon.bulletLifespan = 6000;
        // //  The speed at which the bullet is fired
        // this.weapon.bulletSpeed = 300;
        // //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        // this.weapon.fireRate = 100;
        // //  Tell the Weapon to track the 'player' Sprite
        // //  With no offsets from the position
        // //  But the 'true' argument tells the weapon to track sprite rotation
        // this.weapon.trackSprite(this, 0, 0, true);
        // this.weapon.onFire.add(this.bulletFire);
        //
        // this.shootKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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