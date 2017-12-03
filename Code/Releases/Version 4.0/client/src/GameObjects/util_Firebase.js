var firebase;
var util_Firebase = /** @class */ (function () {
    function util_Firebase() {
        this.database = firebase.database();
    }
    util_Firebase.prototype.generateKey = function () {
        return this.database.ref().push().key;
    };
    util_Firebase.prototype.pushNewestPlayer = function (playerID, name) {
        this.database.ref("New").set({
            id: playerID,
            name: name
        });
    };
    util_Firebase.prototype.checkForNewPlayers = function (myID, game, layer, tank) {
        var ref = this.database.ref("New");
        ref.on("value", function (snap) {
            var id = snap.val().id;
            if (id != myID) {
                console.log("Newest Player: " + id);
                console.log("Newest Player's Name: " + snap.val().name);
                var otherPlayer = new otherTank(game, 0, 0, id, layer, tank, snap.val().name);
                tank.addNewPlayer(otherPlayer);
            }
        });
    };
    util_Firebase.prototype.checkForPreviousPlayers = function (myID, game, layer, tank) {
        var ref = this.database.ref("Players");
        ref.once("value")
            .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var otherID = childSnapshot.key;
                if (otherID != myID) {
                    console.log("Previous Player's Id: " + otherID);
                    var otherPlayer = new otherTank(game, 0, 0, otherID, layer, tank, childSnapshot.val().name);
                    tank.addNewPlayer(otherPlayer);
                }
            });
        });
    };
    util_Firebase.prototype.updatePlayerInfo = function (playerID, x, y, r, bullets, name, health, message) {
        var ref = this.database.ref("Players/" + playerID);
        ref.update({
            x: x,
            y: y,
            r: r,
            bullets: bullets,
            name: name,
            health: health
        });
        if (message != null) {
            console.log(message);
        }
    };
    // updateHealth(playerID: any, health) {
    //     var ref = this.database.ref("Players/" + playerID);
    //     ref.set({
    //        health: health
    //     });
    //     console.log(playerID);
    //     console.log(health);
    // }
    util_Firebase.prototype.onClose = function (myID) {
        var ref = this.database.ref("Players/" + myID + "/");
        ref.onDisconnect().remove();
    };
    util_Firebase.prototype.getDatabase = function () {
        return this.database;
    };
    return util_Firebase;
}());
