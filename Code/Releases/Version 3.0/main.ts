class TankTrouble extends Phaser.Game{
    game: Phaser.Game;

    constructor(divID: string) {
        super("100%", "100%", Phaser.AUTO, divID, new WelcomeState());
    }
}

window.onload = () => {
    var game = new TankTrouble("content");
    // var game2 = new TankTrouble("second");
};