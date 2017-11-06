var firebase;
var util_Firebase = (function () {
    function util_Firebase(simpleGame) {
        this.database = firebase.database();
        this.simpleGame = simpleGame;
        this.game = this.simpleGame.game;
    }
    util_Firebase.prototype.generateKey = function () {
        this.myID = this.database.ref().push().key;
        // this.myID = Math.floor(Math.random() * 5000);
        return this.myID;
    };
    util_Firebase.prototype.updatePlayerInfo = function (playerID, x, y, r) {
        var ref = this.database.ref("Players/" + playerID);
        ref.set({
            x: x,
            y: y,
            r: r
        });
    };
    util_Firebase.prototype.pushNewestPlayer = function (playerID) {
        this.database.ref("New").set({
            id: playerID
        });
    };
    util_Firebase.prototype.checkForNewPlayers = function () {
        var _this = this;
        var ref = this.database.ref("New");
        ref.on("value", function (snap) {
            var id = snap.val().id;
            if (id != _this.simpleGame.tank.id) {
                console.log("Newest Player: " + id);
                var otherPlayer = new otherTank(_this.game, 0, 0, id, _this.simpleGame.FIREBASE);
                _this.game.add.existing(otherPlayer);
                // console.log(otherPlayer);
            }
        });
    };
    util_Firebase.prototype.checkForPreviousPlayers = function (passedID, refFire, game) {
        var ref = this.database.ref("Players");
        ref.once("value")
            .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var otherID = childSnapshot.key;
                if (otherID != passedID) {
                    console.log("Previous Player's Id: " + otherID);
                    console.log("My myID: " + passedID);
                    var otherPlayer = new otherTank(game, 0, 0, otherID, refFire);
                    console.log(otherPlayer);
                    game.add.existing(otherPlayer);
                }
            });
        });
    };
    util_Firebase.prototype.getDatabase = function () {
        return this.database;
    };
    return util_Firebase;
}());
//# sourceMappingURL=util_Firebase.js.map