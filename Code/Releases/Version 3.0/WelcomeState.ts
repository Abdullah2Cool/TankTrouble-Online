class WelcomeState extends Phaser.State {

    instructions: Phaser.Text;
    playButton: Phaser.Button;
    name: string = "Enter name here";
    InputPlugin;
    testInput;

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
        this.InputPlugin = this.game.plugins.add(PhaserInput.Plugin);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.instructions = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 200, "Pick a Name:",
            {font: "65px Arial", fill: "#ff0044", align: "center"});
        this.instructions.anchor.set(0.5, 0.5);

        this.playButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 50, "play_Button", this.startNext, this);
        this.playButton.anchor.set(0.5, 0.5);

        // this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        //
        // this.game.input.keyboard.addCallbacks(this, null, null, this.typed);

        this.testInput = this.game.add.inputField(this.game.world.centerX - 250, this.game.height / 2 - 120, {
            font: '50px Arial',
            fill: '#0005ff',
            fontWeight: 'bold',
            width: 500,
            max: 15,
            padding: 8,
            borderWidth: 1,
            borderColor: '#71ff00',
            borderRadius: 6,
            placeHolder: this.name,
            textAlign: 'center',
            type: PhaserInput.InputType.text
        });
    }

    update() {
    }


    startNext() {
        if (this.testInput.value != "") {
            this.game.state.start("GameState", true, false, this.testInput.value);
        } else {
            this.game.state.start("GameState", true, false, "NOOB");
        }
    }
}