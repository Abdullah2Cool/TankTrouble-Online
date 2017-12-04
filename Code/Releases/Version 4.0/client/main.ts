class TankTrouble extends Phaser.Game {
    constructor(divID: string) {
        super("100%", "100%", Phaser.AUTO, divID, new WelcomeState());
        console.log("New Game object created.");
    }
}

window.onload = () => {
    new TankTrouble("content");
};

