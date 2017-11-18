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
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        var _this = _super.call(this) || this;
        _this.FIREBASE = new util_Firebase();
        return _this;
    }
    GameState.prototype.init = function (name) {
        this.name = name;
    };
    GameState.prototype.preload = function () {
        this.game.load.script('joystick', 'phaser-virtual-joystick.js');
    };
    GameState.prototype.create = function () {
        this.game.stage.backgroundColor = '#dfdfdf';
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles');
        this.layer = this.map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        this.map.setCollision([33]);
        this.id = this.FIREBASE.generateKey();
        // this.tank = new Tank(this.game, this.game.rnd.integerInRange(100, this.game.width - 100),
        //     this.game.rnd.integerInRange(100, this.game.height), "tank", this.id);
        this.tank = new Tank(this.game, 400, 400, this.name, this.id, this.layer);
        this.game.add.existing(this.tank);
        this.game.camera.follow(this.tank);
        this.FIREBASE.pushNewestPlayer(this.tank.id, this.name);
        this.FIREBASE.checkForPreviousPlayers(this.tank.id, this.game, this.layer, this.tank);
        this.FIREBASE.checkForNewPlayers(this.tank.id, this.game, this.layer, this.tank);
        this.FIREBASE.onClose(this.tank.id);
    };
    GameState.prototype.update = function () {
    };
    return GameState;
}(Phaser.State));
//# sourceMappingURL=GameState.js.map