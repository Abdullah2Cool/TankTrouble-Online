class WelcomeState extends Phaser.State {

    graphics: Phaser.Graphics;
    instructions: Phaser.Text;
    playButton: Phaser.Button;
    name: string = "Enter name here";
    nameField: Phaser.Text;
    backspace: Phaser.Key;

    constructor() {
        super();
    }

    preload() {
        this.game.load.tilemap('map', 'gameMap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.atlas('arcade', 'arcade-joystick.png', 'arcade-joystick.json');
        this.game.load.image('tiles', 'Tileset.png');
        this.game.load.image("tank", "Red Tank.png");
        this.game.load.image("otherTank", "Blue Tank.png");
        this.game.load.image("red_bullet", "Red Bullet.png");
        this.game.load.image("blue_bullet", "Blue Bullet.png");
        this.game.load.image("play_Button", "Play Button.png");
    }

    create() {
        this.game.state.add("GameState", new GameState());

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.graphics = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY - 100);
        this.graphics.beginFill(0xc1bcba);
        this.graphics.drawRect(-250, -25, 500, 50);
        this.graphics.lineStyle(4, 0xffffff, 1);
        this.graphics.drawRect(-250, -25, 500, 50);

        this.instructions = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 200, "Pick a Name:",
            {font: "65px Arial", fill: "#ff0044", align: "center"});

        this.instructions.anchor.set(0.5, 0.5);

        this.nameField = this.game.add.text(this.game.world.centerX - 240, this.game.world.centerY - 114, this.name,
            {font: "30px Arial", fill: "#2800ff", align: "center"});

        this.playButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 50, "play_Button", this.startNext, this);

        this.playButton.anchor.set(0.5, 0.5);

        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);

        this.game.input.keyboard.addCallbacks(this, null, null, this.typed);
    }

    update() {
        if (this.nameField.text != this.name) {
            if (this.backspace.justUp) {
                console.log("Backspace");
                this.nameField.text = this.nameField.text.slice(0, this.nameField.text.length - 1);
            }
        }

        if (this.nameField.text.length == 0) {
            this.nameField.text = this.name;
        }
    }

    typed(char) {
        if (this.nameField.text == this.name) {
            this.nameField.text = char;
        } else {
            if (char == " ") {
                this.nameField.text += "_";
            } else {
                this.nameField.text += char;
            }
        }
    }

    startNext() {
        if (this.nameField.text == this.name) {
            this.nameField.text = "NOOB";
        }
        this.game.state.start("GameState", true, false, this.nameField.text);
    }
}