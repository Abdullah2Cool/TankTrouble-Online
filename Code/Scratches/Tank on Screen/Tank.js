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
    function Tank(game, x, y, sName) {
        var _this = _super.call(this, game, x, y, sName) || this;
        _this.game = game;
        _this.sName = sName;
        _this.anchor.setTo(0.5, 0.5);
        _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
        _this.game.physics.arcade.enable(_this);
        _this.upKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        _this.downKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        _this.lefKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        _this.rightKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        return _this;
    }
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
            this.game.physics.arcade.velocityFromAngle(this.angle, 300, this.body.velocity);
        }
        else if (this.downKey.isDown) {
            this.game.physics.arcade.velocityFromAngle(this.angle, -300, this.body.velocity);
        }
    };
    return Tank;
}(Phaser.Sprite));
//# sourceMappingURL=Tank.js.map