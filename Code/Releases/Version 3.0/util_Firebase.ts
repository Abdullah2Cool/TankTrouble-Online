var firebase: any;

class util_Firebase {

    database;

    constructor() {
        this.database = firebase.database();
    }

    generateKey(): number {
        return this.database.ref().push().key;
    }

    pushNewestPlayer(playerID: number, name:string) {
        this.database.ref("New").set({
            id: playerID,
            name: name
        });
    }

    checkForNewPlayers(myID: any, game: Phaser.Game, layer: TilemapLayer, tank: Tank) {
        let ref = this.database.ref("New");

        ref.on("value", snap => {
            let id = snap.val().id;
            if (id != myID) {
                console.log("Newest Player: " + id);
                console.log("Newest Player's Name: " + snap.val().name);
                let otherPlayer = new otherTank(game, 0, 0, id, layer, tank, snap.val().name);
                tank.addNewPlayer(otherPlayer);
            }
        });
    }

    checkForPreviousPlayers(myID: any, game: Phaser.Game, layer: TilemapLayer, tank: Tank) {
        let ref = this.database.ref("Players");

        ref.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    let otherID = childSnapshot.key;
                    if (otherID != myID) {
                        console.log("Previous Player's Id: " + otherID);
                        let otherPlayer = new otherTank(game, 0, 0, otherID, layer, tank, childSnapshot.val().name);
                        tank.addNewPlayer(otherPlayer);
                    }
                })
            });
    }

    updatePlayerInfo(playerID: any, x: number, y: number, r: number, bullet, name:string, health: number) {
        var ref = this.database.ref("Players/" + playerID);
        ref.set({
            x: x,
            y: y,
            r: r,
            bullets: bullet,
            name:name,
            health: health
        });
    }

    onClose(myID: any) {
        let ref = this.database.ref("Players/" + myID + "/");
        ref.onDisconnect().remove();
        // ref = this.database.ref("Removed");
        // ref.onDisconnect().update({
        //     id: myID
        // });
    }

    getDatabase(): any {
        return this.database;
    }
}