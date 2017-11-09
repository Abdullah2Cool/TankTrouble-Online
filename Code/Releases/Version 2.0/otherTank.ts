import TilemapLayer = Phaser.TilemapLayer;

class otherTank extends Phaser.Sprite {

    game: Phaser.Game;
    weapon: Phaser.Weapon;
    id: any;
    FIREBASE: util_Firebase;
    bulletsShot: number;
    layer: TilemapLayer;

    constructor(game: Phaser.Game, x: number, y: number, id: any, layer: TilemapLayer) {
        super(game, x, y, "otherTank");
        this.game = game;
        this.id = id;
        this.FIREBASE = new util_Firebase();
        this.bulletsShot = 0;
        this.layer = layer;

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
            if (!snap.exists()) {
                console.log("Player doesn't exist anymore.")
                this.destroy();
            } else {
                this.x = snap.val().x;
                this.y = snap.val().y;
                this.rotation = snap.val().r
            }
        });
        this.FIREBASE.getDatabase().ref("Players/" + this.id).on("value", snap => {
            if (snap.exists()) {
                if (snap.val().bullet != this.bulletsShot) {
                    console.log("Other Player shot bullet.")
                    while (snap.val().bullet > this.bulletsShot) {
                        this.weapon.fire();
                        this.bulletsShot += 1;
                    }
                }
            }
        });
    }

    bulletFire(bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
    }

    update() {
        this.game.physics.arcade.collide(this.weapon.bullets, this.layer);
    }

}