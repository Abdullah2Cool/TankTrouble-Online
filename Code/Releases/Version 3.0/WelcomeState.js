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
var WelcomeState = (function (_super) {
    __extends(WelcomeState, _super);
    function WelcomeState() {
        var _this = _super.call(this) || this;
        _this.name = "Enter name here";
        return _this;
    }
    WelcomeState.prototype.preload = function () {
        this.game.load.tilemap('map', 'gameMap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.atlas('arcade', 'arcade-joystick.png', 'arcade-joystick.json');
        this.game.load.image('tiles', 'Tileset.png');
        this.game.load.image("tank", "Red Tank.png");
        this.game.load.image("otherTank", "Blue Tank.png");
        this.game.load.image("red_bullet", "Red Bullet.png");
        this.game.load.image("blue_bullet", "Blue Bullet.png");
        this.game.load.image("play_Button", "Play Button.png");
    };
    WelcomeState.prototype.create = function () {
        this.game.state.add("GameState", new GameState());
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.graphics = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY - 100);
        this.graphics.beginFill(0xc1bcba);
        this.graphics.drawRect(-250, -25, 500, 50);
        this.graphics.lineStyle(4, 0xffffff, 1);
        this.graphics.drawRect(-250, -25, 500, 50);
        this.instructions = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 200, "Pick a Name:", { font: "65px Arial", fill: "#ff0044", align: "center" });
        this.instructions.anchor.set(0.5, 0.5);
        this.nameField = this.game.add.text(this.game.world.centerX - 240, this.game.world.centerY - 114, this.name, { font: "30px Arial", fill: "#2800ff", align: "center" });
        this.playButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 50, "play_Button", this.startNext, this);
        this.playButton.anchor.set(0.5, 0.5);
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        this.game.input.keyboard.addCallbacks(this, null, null, this.typed);
    };
    WelcomeState.prototype.update = function () {
        if (this.nameField.text != this.name) {
            if (this.backspace.justUp) {
                console.log("Backspace");
                this.nameField.text = this.nameField.text.slice(0, this.nameField.text.length - 1);
            }
        }
        if (this.nameField.text.length == 0) {
            this.nameField.text = this.name;
        }
    };
    WelcomeState.prototype.typed = function (char) {
        if (this.nameField.text == this.name) {
            this.nameField.text = char;
        }
        else {
            if (char == " ") {
                this.nameField.text += "_";
            }
            else {
                this.nameField.text += char;
            }
        }
    };
    WelcomeState.prototype.startNext = function () {
        if (this.nameField.text == this.name) {
            this.nameField.text = "NOOB";
        }
        this.game.state.start("GameState", true, false, this.nameField.text);
    };
    return WelcomeState;
}(Phaser.State));
//# sourceMappingURL=WelcomeState.js.map