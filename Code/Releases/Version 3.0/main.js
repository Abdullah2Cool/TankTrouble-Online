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
var TankTrouble = (function (_super) {
    __extends(TankTrouble, _super);
    function TankTrouble(divID) {
        return _super.call(this, "100%", "100%", Phaser.AUTO, divID, new WelcomeState()) || this;
    }
    return TankTrouble;
}(Phaser.Game));
window.onload = function () {
    var game = new TankTrouble("content");
    // var game2 = new TankTrouble("second");
};
//# sourceMappingURL=main.js.map