import TilemapLayer = Phaser.TilemapLayer;

class otherTank extends Phaser.Sprite {

    game: Phaser.Game;
    weapon: Phaser.Weapon;
    id: any;
    FIREBASE: util_Firebase;
    layer: TilemapLayer;
    tank: Tank;
    otherTanks: Phaser.Group;
    bulletInfo = []
    maxBullets: number = 6;

    constructor(game: Phaser.Game, x: number, y: number, id: any, layer: TilemapLayer, tank: Tank) {
        super(game, x, y, "otherTank");
        this.game = game;
        this.id = id;
        this.FIREBASE = new util_Firebase();
        this.layer = layer;
        this.tank = tank;

        for (let i = 0; i < this.maxBullets; i++) {
            this.bulletInfo.push(0);
        }

        this.otherTanks = tank.getOtherPlayers();

        this.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this);

        this.weapon = game.add.weapon(6, 'bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 6000;
        this.weapon.bulletSpeed = 300;
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this, 34, 0, true);
        this.weapon.onFire.add(this.bulletFire, this);
        this.weapon.onKill.add(this.bulletDead, this);

        this.body.immovable = true;


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

        this.FIREBASE.getDatabase().ref("Players/" + this.id + "/bullets").on("value", snap => {
            if (snap.exists()) {
                let bulletsInCloud = snap.val();
                console.log("Local: " + this.bulletInfo);
                console.log("Cloud: " + bulletsInCloud);
                this.bulletInfo = bulletsInCloud;
                let x = 0;
                this.weapon.bullets.forEach(function (bull) {
                    if (bulletsInCloud[x] == 0) {
                        this.bulletInfo[x] = 0;
                    } else {
                        this.bulletInfo[x] = 1;
                    }
                    x++;
                }, this);
                console.log("Updated: " + this.bulletInfo);
            }
        });
    }

    bulletFire(bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        this.game.world.bringToTop(this);
    }

    bulletDead(sprite) {
        // this.bulletsShot -= 1;
    }

    update() {
        this.game.physics.arcade.collide(this.weapon.bullets, this.layer);
        this.game.physics.arcade.collide(this.tank, this.weapon.bullets, this.bulletHit);
        // collide with other tank's bullets
        this.otherTanks.forEach(function (otherTank) {
            this.game.physics.arcade.collide(otherTank, this.weapon.bullets, this.bulletHit);
        }, this);

        let x = 0;
        this.weapon.bullets.forEach(function (bull) {
            if (this.bulletInfo[x] == 1) {
                if (!bull.alive) {
                    this.weapon.fire();
                    console.log("Other Player shot bullet.");
                }
            } else {
                if (bull.alive) {
                    bull.kill();
                    console.log("The bullet died.");
                }
            }
            x++;
        }, this);
    }

    bulletHit(tank, bullet) {
        console.log("Other tank shot me.");
        bullet.kill();
    }

    setOtherTanks(otherTanks: Phaser.Group) {
        this.otherTanks = otherTanks;
    }

}