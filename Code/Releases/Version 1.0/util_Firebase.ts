var firebase: any;

class util_Firebase {

    database;
    game: Phaser.Game;
    simpleGame: SimpleGame;

    constructor(simpleGame: SimpleGame) {
        this.database = firebase.database();
        this.simpleGame = simpleGame;
        this.game = this.simpleGame.game;
    }

    generateKey(): number {
        return this.database.ref().push().key;
    }

    updatePlayerInfo(playerID: number, x: number, y: number, r: number) {
        var ref = this.database.ref("Players/" + playerID);
        ref.set({
            x: x,
            y: y,
            r: r
        });
    }

    pushNewestPlayer(playerID: number) {
        this.database.ref("New").set({
            id: playerID
        });
    }


    checkForNewPlayers() {
        let ref = this.database.ref("New");

        ref.on("value", snap => {
            if (snap.val().id != this.simpleGame.tank.id) {
                let id = snap.val().id;
                console.log("Newest Player: " + id);
                let otherPlayer = new otherTank(this.game, 0, 0, id, this.simpleGame.FIREBASE);
                this.game.add.existing(otherPlayer);
                console.log(otherPlayer);
            }
        });
    }

    getDatabase(): any {
        return this.database;
    }
}