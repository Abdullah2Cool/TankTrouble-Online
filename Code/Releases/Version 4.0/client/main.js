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
var TankTrouble = /** @class */ (function (_super) {
    __extends(TankTrouble, _super);
    function TankTrouble(divID) {
        var _this = _super.call(this, "100%", "100%", Phaser.AUTO, divID) || this;
        _this.state.add("WelcomeState", new WelcomeState());
        _this.state.add("GameState", new GameState());
        _this.state.start("WelcomeState", true, false);
        console.log("New Game object created.");
        return _this;
    }
    return TankTrouble;
}(Phaser.Game));
window.onload = function () {
    var game = new TankTrouble("content");
};
