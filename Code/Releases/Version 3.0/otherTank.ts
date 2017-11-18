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
    maxBullets: number = 10;
    sName: string;
    displayName: Phaser.Text;

    constructor(game: Phaser.Game, x: number, y: number, id: any, layer: TilemapLayer, tank: Tank, sName: string) {
        super(game, x, y, "otherTank");
        this.game = game;
        this.id = id;
        this.FIREBASE = new util_Firebase();
        this.layer = layer;
        this.tank = tank;
        this.sName = sName;

        for (let i = 0; i < this.maxBullets; i++) {
            this.bulletInfo.push(0);
        }

        this.otherTanks = tank.getOtherPlayers();

        this.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this);

        this.weapon = game.add.weapon(6, 'blue_bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 6000;
        this.weapon.bulletSpeed = 300;
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this, 38, 0, true);
        this.weapon.onFire.add(this.bulletFire, this);
        this.weapon.onKill.add(this.bulletDead, this);

        this.body.setCircle(33);
        this.body.immovable = true;

        this.FIREBASE.getDatabase().ref("Players/" + this.id).on("value", snap => {
            if (!snap.exists()) {
                console.log("Player doesn't exist anymore.");
                this.destroy();
                this.displayName.destroy();
                this.weapon.bullets.destroy();
            } else {
                this.x = snap.val().x;
                this.y = snap.val().y;
                this.rotation = snap.val().r;
                this.sName = snap.val().name;
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

        let style = {
            font: "32px Arial",
            fill: "#0009ff"
        };

        this.displayName = this.game.add.text(0, 0, this.sName, style);
        this.displayName.anchor.set(0.5, 0.5);
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
        // collide with the main player's bullets of this instance of the game
        this.game.physics.arcade.collide(this.tank, this.weapon.bullets, this.bulletHit);
        // collide with otherPlayers' bullets
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

        this.displayName.x = Math.floor(this.x);
        this.displayName.y = Math.floor(this.y - this.height / 2 - 15);
    }

    bulletHit(tank, bullet) {
        console.log("Other tank shot me.");
        bullet.kill();
    }

    setOtherTanks(otherTanks: Phaser.Group) {
        this.otherTanks = otherTanks;
    }

}
