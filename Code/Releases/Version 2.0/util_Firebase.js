var firebase;
var util_Firebase = (function () {
    function util_Firebase() {
        this.database = firebase.database();
        // this.simpleGame = simpleGame;
    }
    util_Firebase.prototype.generateKey = function () {
        return this.database.ref().push().key;
    };
    util_Firebase.prototype.updatePlayerInfo = function (playerID, x, y, r, bullet) {
        var ref = this.database.ref("Players/" + playerID);
        ref.set({
            x: x,
            y: y,
            r: r,
            bullet: bullet
        });
    };
    util_Firebase.prototype.pushNewestPlayer = function (playerID) {
        this.database.ref("New").set({
            id: playerID
        });
    };
    util_Firebase.prototype.checkForNewPlayers = function (myID, game) {
        var ref = this.database.ref("New");
        ref.on("value", function (snap) {
            var id = snap.val().id;
            if (id != myID) {
                console.log("Newest Player: " + id);
                var otherPlayer = new otherTank(game, 0, 0, id);
                game.add.existing(otherPlayer);
                // console.log(otherPlayer);
            }
        });
    };
    util_Firebase.prototype.checkForPreviousPlayers = function (myID, game) {
        var ref = this.database.ref("Players");
        ref.once("value")
            .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var otherID = childSnapshot.key;
                if (otherID != myID) {
                    console.log("Previous Player's Id: " + otherID);
                    console.log("My myID: " + myID);
                    var otherPlayer = new otherTank(game, 0, 0, otherID);
                    console.log(otherPlayer);
                    game.add.existing(otherPlayer);
                }
            });
        });
    };
    util_Firebase.prototype.onClose = function (myID) {
        var ref = this.database.ref("Players/" + myID + "/");
        ref.onDisconnect().remove();
    };
    util_Firebase.prototype.getDatabase = function () {
        return this.database;
    };
    return util_Firebase;
}());
//# sourceMappingURL=util_Firebase.js.map