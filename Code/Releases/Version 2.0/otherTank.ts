class otherTank extends Phaser.Sprite {

    game: Phaser.Game;
    weapon: Phaser.Weapon;
    id: any;
    FIREBASE: util_Firebase;

    constructor(game: Phaser.Game, x: number, y: number, id: any) {
        super(game, x, y, "tank");
        this.game = game;
        this.id = id;
        this.FIREBASE = new util_Firebase();

        this.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this);

        this.weapon = game.add.weapon(30, 'bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 6000;
        this.weapon.bulletSpeed = 300;
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this, 0, 0, true);
        this.weapon.onFire.add(this.bulletFire);


        this.FIREBASE.getDatabase().ref("Players/" + this.id).on("value", snap => {
            this.x = snap.val().x;
            this.y = snap.val().y;
            this.rotation = snap.val().r;
        });
    }

    bulletFire(bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        // console.log(bullet);
    }

}