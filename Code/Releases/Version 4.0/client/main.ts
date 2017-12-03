class TankTrouble extends Phaser.Game {
    constructor(divID: string) {
        super("100%", "100%", Phaser.AUTO, divID);
        this.state.add("WelcomeState", new WelcomeState());
        this.state.add("GameState", new GameState());

        this.state.start("WelcomeState", true, false);
        console.log("New Game object created.");
    }
}

window.onload = function () {
    var game = new TankTrouble("content");
};

