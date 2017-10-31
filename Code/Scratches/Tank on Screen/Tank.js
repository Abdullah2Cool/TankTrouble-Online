"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Tank = (function (_super) {
    __extends(Tank, _super);
    function Tank(game, vPos) {
        return _super.call(this, game, vPos.x, vPos.y, "") || this;
    }
    return Tank;
}(Phaser.Sprite));
exports.Tank = Tank;
//# sourceMappingURL=Tank.js.map