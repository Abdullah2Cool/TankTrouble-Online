var firebase;
var util_Firebase = (function () {
    function util_Firebase(simpleGame) {
        this.database = firebase.database();
        this.simpleGame = simpleGame;
        this.game = this.simpleGame.game;
    }
    util_Firebase.prototype.generateKey = function () {
        return this.database.ref().push().key;
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
            if (snap.val().id != _this.simpleGame.tank.id) {
                var id = snap.val().id;
                console.log("Newest Player: " + id);
                var otherPlayer = new otherTank(_this.game, 0, 0, id, _this.simpleGame.FIREBASE);
                _this.game.add.existing(otherPlayer);
                console.log(otherPlayer);
            }
        });
    };
    util_Firebase.prototype.getDatabase = function () {
        return this.database;
    };
    return util_Firebase;
}());
//# sourceMappingURL=util_Firebase.js.map