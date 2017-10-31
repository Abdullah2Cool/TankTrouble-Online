var firebase;
var database = firebase.database();
var ref = database.ref("/users");
console.log(firebase);
ref.set({
    Connection: "TypeScript connected."
});
