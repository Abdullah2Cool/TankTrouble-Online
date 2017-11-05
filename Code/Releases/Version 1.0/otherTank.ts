class otherTank extends Phaser.Sprite {

    game: Phaser.Game;
    weapon: Phaser.Weapon;
    id: any;
    shootKey: Phaser.Key;
    FIREBASE: util_Firebase;

    constructor(game: Phaser.Game, x: number, y: number, id: any, FIREBASE: util_Firebase) {
        super(game, x, y, "tank");
        this.game = game;
        this.id = id;
        this.FIREBASE = FIREBASE;

        this.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this);
        // // this.scale.setTo(0.8, 0.8);
        // //  Creates 30 bullets, using the 'bullet' graphic
        // this.weapon = game.add.weapon(30, 'bullet');
        // //  The bullets will be automatically killed when they are 2000ms old
        // this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        // this.weapon.bulletLifespan = 6000;
        // //  The speed at which the bullet is fired
        // this.weapon.bulletSpeed = 300;
        // //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        // this.weapon.fireRate = 100;
        // //  Tell the Weapon to track the 'player' Sprite
        // //  With no offsets from the position
        // //  But the 'true' argument tells the weapon to track sprite rotation
        // this.weapon.trackSprite(this, 0, 0, true);
        // this.weapon.onFire.add(this.bulletFire);
        //
        // this.shootKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.FIREBASE.getDatabase().ref("Players/" + this.id).on("value", snap => {
            this.x = snap.val().x;
            this.y = snap.val().y;
            this.rotation = snap.val().rotation;
        });
    }

    bulletFire(bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        // console.log(bullet);
    }

}