var firebase: any;

class util_Firebase {

    database;
    game: Phaser.Game;
    simpleGame: SimpleGame;
    myID: any;

    constructor(simpleGame: SimpleGame) {
        this.database = firebase.database();
        this.simpleGame = simpleGame;
        this.game = this.simpleGame.game;
    }

    generateKey(): number {
        this.myID = this.database.ref().push().key;
        // this.myID = Math.floor(Math.random() * 5000);
        return this.myID;
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
            let id = snap.val().id;
            if (id != this.simpleGame.tank.id) {
                console.log("Newest Player: " + id);
                let otherPlayer = new otherTank(this.game, 0, 0, id, this.simpleGame.FIREBASE);
                this.game.add.existing(otherPlayer);
                // console.log(otherPlayer);
            }
        });
    }

    checkForPreviousPlayers(passedID: any, refFire: util_Firebase, game) {
        let ref = this.database.ref("Players");

        ref.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    let otherID = childSnapshot.key;
                    if (otherID != passedID) {
                        console.log("Previous Player's Id: " + otherID);
                        console.log("My myID: " + passedID);
                        let otherPlayer = new otherTank(game, 0, 0, otherID, refFire);
                        console.log(otherPlayer);
                        game.add.existing(otherPlayer);
                    }
                })
            });
    }

    getDatabase(): any {
        return this.database;
    }
}