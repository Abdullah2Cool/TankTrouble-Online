class TankTrouble extends Phaser.Game {
    constructor(divID: string) {
        super("100%", "100%", Phaser.AUTO, divID, new WelcomeState());

        // this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.refresh();
        //
        // canvas_width = window.innerWidth * window.devicePixelRatio;
        // canvas_height = window.innerHeight * window.devicePixelRatio;
        // aspect_ratio = canvas_width / canvas_height;
        // if (aspect_ratio > 1) scale_ratio = canvas_height / canvas_height_max;
        // else scale_ratio = canvas_width / canvas_width_max;
    }
}

window.onload = () => {
    var game = new TankTrouble("content");
    // var game2 = new TankTrouble("second");
};