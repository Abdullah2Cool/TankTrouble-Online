var firebase;
var util_Firebase = (function () {
    function util_Firebase() {
        this.database = firebase.database();
    }
    util_Firebase.prototype.generateKey = function () {
        return this.database.ref().push().key;
    };
    util_Firebase.prototype.pushNewestPlayer = function (playerID) {
        this.database.ref("New").set({
            id: playerID
        });
    };
    util_Firebase.prototype.checkForNewPlayers = function (myID, game, layer, tank) {
        var ref = this.database.ref("New");
        ref.on("value", function (snap) {
            var id = snap.val().id;
            if (id != myID) {
                console.log("Newest Player: " + id);
                var otherPlayer = new otherTank(game, 0, 0, id, layer, tank);
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
                    var otherPlayer = new otherTank(game, 0, 0, otherID, layer, tank);
                    tank.addNewPlayer(otherPlayer);
                }
            });
        });
    };
    util_Firebase.prototype.updatePlayerInfo = function (playerID, x, y, r, bullet) {
        var ref = this.database.ref("Players/" + playerID);
        ref.set({
            x: x,
            y: y,
            r: r,
            bullets: bullet
        });
    };
    util_Firebase.prototype.onClose = function (myID) {
        var ref = this.database.ref("Players/" + myID + "/");
        ref.onDisconnect().remove();
        // ref = this.database.ref("Removed");
        // ref.onDisconnect().update({
        //     id: myID
        // });
    };
    util_Firebase.prototype.getDatabase = function () {
        return this.database;
    };
    return util_Firebase;
}());
//# sourceMappingURL=util_Firebase.js.map