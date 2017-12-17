class TankTrouble extends Phaser.Game {
    constructor(divID) {
        super("100%", "100%", Phaser.AUTO, divID, new WelcomeState());
        console.log("New Game object created.");
    }
}
window.onload = () => {
    new TankTrouble("game");
};
