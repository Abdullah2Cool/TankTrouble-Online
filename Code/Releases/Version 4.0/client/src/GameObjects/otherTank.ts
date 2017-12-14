import TilemapLayer = Phaser.TilemapLayer;

class otherTank extends Phaser.Sprite {

    game: Phaser.Game;
    weapon: Phaser.Weapon;
    id: any;
    // FIREBASE: util_Firebase;
    layer: TilemapLayer;
    tank: Tank;
    bulletInfo = {};
    shotOnce = [];
    maxBullets: number = 10;
    sName: string;
    displayName: Phaser.Text;
    healthBar;

    constructor(game: Phaser.Game, x: number, y: number, id: any, layer: TilemapLayer, tank: Tank, sName: string) {
        super(game, x, y, "otherTank");
        this.game = game;
        this.id = id;

        this.layer = layer;
        this.tank = tank;
        this.sName = sName;

        this.maxHealth = 20;
        this.health = this.maxHealth;

        for (let i = 0; i < this.maxBullets; i++) {
            this.bulletInfo[i] = -1;
        }

        // this.otherTanks = tank.getOtherPlayers();

        this.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this);


        this.weapon = game.add.weapon(this.maxBullets, 'blue_bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 5000;
        this.weapon.bulletSpeed = 300;
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this, 38, 0, true);
        this.weapon.onFire.add(this.bulletFire, this);
        this.weapon.onKill.add(this.bulletDead, this);

        this.body.setCircle(33);
        this.body.immovable = true;

        let style = {
            font: "32px Arial",
            fill: "#0009ff"
        };

        this.displayName = this.game.add.text(0, 0, sName, style);
        this.displayName.anchor.set(0.5, 0.5);

        this.healthBar = new HealthBar(this.game, {
                width: 100,
                height: 10,
                x: 0,
                y: 0,
                bg: {
                    color: '#ff000a'
                },
                bar: {
                    color: '#47ff00'
                },
                animationDuration: 10,
                flipped: false
            }
        );
    }

    bulletFire(bullet, weapon) {
        bullet.body.bounce.setTo(1, 1);
        this.game.world.bringToTop(this);
        console.log("Other Tank Shot Bullet");
    }

    bulletDead(sprite) {
        console.log("Bullet Died.");
    }

    update() {
        // collide my bullets with the walls
        this.game.physics.arcade.collide(this.weapon.bullets, this.layer);
        // collide my bullets with myself
        this.game.physics.arcade.collide(this, this.weapon.bullets, this.bulletHit, null, this);

        this.displayName.x = Math.floor(this.x);
        this.displayName.y = Math.floor(this.y - this.height / 2 - 15);

        this.healthBar.setPosition(this.x, this.y - 70);
        this.healthBar.setPercent((this.health / this.maxHealth) * 100);

    }

    bulletHit(tank, bullet) {
        bullet.kill();
    }

    updateInfo(x, y, r, health) {
        this.game.add.tween(this).to({x: x, y: y, rotation: r}, 1000 / 60, "Sine.easeInOut", true);
        this.health = health;

        // console.log("Recieved Info form otherTank:", bulletInfo);

        // let t = 0;
        // this.weapon.bullets.forEach(function (bull) {
        //     if (bulletInfo[t] == 0) {
        //         bull.kill();
        //     } else {
        //         if (!bull.alive) {
        //             this.weapon.fire();
        //         }
        //     }
        //     t++;
        // }, this);

        // let t = 0;
        // this.weapon.bullets.forEach(function (bull) {
        //     // console.log(bull);
        //     if (bulletInfo[t] == -1) {
        //         if (bull.alive) {
        //             bull.kill();
        //         }
        //     } else {
        //         if (bull.alive) {
        //             bull.x = bulletInfo[t].x;
        //             bull.y = bulletInfo[t].y;
        //         } else {
        //             this.weapon.fire();
        //         }
        //     }
        //     t += 1;
        // }, this);
    }

}
