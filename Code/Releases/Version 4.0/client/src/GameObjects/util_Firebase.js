// var firebase: any;
//
// class util_Firebase {
//
//     database;
//
//     constructor() {
//         this.database = firebase.database();
//     }
//
//     generateKey(): number {
//         return this.database.ref().push().key;
//     }
//
//     pushNewestPlayer(playerID: number, name: string) {
//         this.database.ref("New").set({
//             id: playerID,
//             name: name
//         });
//     }
//
//     checkForNewPlayers(myID: any, game: Phaser.Game, layer: TilemapLayer, tank: Tank) {
//         let ref = this.database.ref("New");
//
//         ref.on("value", snap => {
//             let id = snap.val().id;
//             if (id != myID) {
//                 console.log("Newest Player: " + id);
//                 console.log("Newest Player's Name: " + snap.val().name);
//                 let otherPlayer = new otherTank(game, 0, 0, id, layer, tank, snap.val().name);
//                 tank.addNewPlayer(otherPlayer);
//             }
//         });
//     }
//
//     checkForPreviousPlayers(myID: any, game: Phaser.Game, layer: TilemapLayer, tank: Tank) {
//         let ref = this.database.ref("Players");
//
//         ref.once("value")
//             .then(function (snapshot) {
//                 snapshot.forEach(function (childSnapshot) {
//                     let otherID = childSnapshot.key;
//                     if (otherID != myID) {
//                         console.log("Previous Player's Id: " + otherID);
//                         let otherPlayer = new otherTank(game, 0, 0, otherID, layer, tank, childSnapshot.val().name);
//                         tank.addNewPlayer(otherPlayer);
//                     }
//                 })
//             });
//     }
//
//     updatePlayerInfo(playerID: any, x: number, y: number, r: number, bullets, name: string, health: number, message) {
//         var ref = this.database.ref("Players/" + playerID);
//         ref.update({
//             x: x,
//             y: y,
//             r: r,
//             bullets: bullets,
//             name: name,
//             health: health
//         });
//         if (message != null) {
//             console.log(message);
//         }
//     }
//
//     // updateHealth(playerID: any, health) {
//     //     var ref = this.database.ref("Players/" + playerID);
//     //     ref.set({
//     //        health: health
//     //     });
//     //     console.log(playerID);
//     //     console.log(health);
//     // }
//
//     onClose(myID: any) {
//         let ref = this.database.ref("Players/" + myID + "/");
//         ref.onDisconnect().remove();
//     }
//
//     getDatabase(): any {
//         return this.database;
//     }
// } 
