class WelcomeState extends Phaser.State {

    instructions: Phaser.Text;
    playButton: Phaser.Button;
    name: string = "Enter name here";
    InputPlugin;
    testInput;

    distance = 300;
    speed = 6;
    max = 1000;
    canvas;
    xx = [];
    yy = [];
    zz = [];


    constructor() {
        super();
    }

    init() {
        this.game.stage.disableVisibilityChange = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    }

    preload() {
        this.game.load.tilemap('map', 'Assets/gameMap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.atlas('arcade', 'Assets/arcade-joystick.png', 'Assets/arcade-joystick.json');
        this.game.load.image('tiles', 'Assets/Tileset.png');
        this.game.load.image("tank", "Assets/Red Tank.png");
        this.game.load.image("otherTank", "Assets/Blue Tank.png");
        this.game.load.image("red_bullet", "Assets/Red Bullet.png");
        this.game.load.image("blue_bullet", "Assets/Blue Bullet.png");
        this.game.load.image("play_Button", "Assets/Play Button.png");
    }

    create() {
        this.game.state.add("GameState", new GameState());

        this.InputPlugin = this.game.plugins.add(PhaserInput.Plugin);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';

        this.canvas = this.game.add.bitmapData(this.game.width, this.game.height);
        this.canvas.addToWorld();

        this.instructions = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 200, "Pick a Name:",
            {font: "65px Arial", fill: "#ff0044", align: "center"});
        this.instructions.anchor.set(0.5, 0.5);

        this.playButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 50, "play_Button", this.startNext, this);
        this.playButton.anchor.set(0.5, 0.5);

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

        for (var i = 0; i < this.max; i++) {
            this.xx[i] = Math.floor(Math.random() * this.game.width) - this.game.width/2;
            this.yy[i] = Math.floor(Math.random() * this.game.height) - this.game.height/2;
            this.zz[i] = Math.floor(Math.random() * 1700) - 100;
        }
    }

    update() {
        this.canvas.clear();

        for (var i = 0; i < this.max; i++) {
            var perspective = this.distance / (this.distance - this.zz[i]);
            var x = this.game.world.centerX + this.xx[i] * perspective;
            var y = this.game.world.centerY + this.yy[i] * perspective;

            this.zz[i] += this.speed;

            if (this.zz[i] > 300) {
                this.zz[i] -= 600;
            }

            //  Swap this for a standard drawImage call
            if (i % 2 == 0) {
                this.canvas.draw('red_bullet', x, y);
            } else {
                this.canvas.draw('blue_bullet', x, y);
            }
        }
    }


    startNext() {
        if (this.testInput.value != "") {
            this.game.state.start("GameState", true, false, this.testInput.value);
        } else {
            this.game.state.start("GameState", true, false, "NOOB");
        }
    }
}