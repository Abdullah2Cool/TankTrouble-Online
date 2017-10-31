var socket;

function setup() {
  createCanvas(800, 800);
  background(51);

  socket = io.connect("http://localhost:3000");
  socket.on("mouse", newDrawing);

  setupGrid();

}

function setupGrid() {
  strokeWeight(10);
  stroke(255);

  line(width / 3, 0, width / 3, height);
  line((width / 3) * 2, 0, (width / 3) * 2, height);
  line(0, height / 3, width, height / 3);
  line(0, (height / 3) * 2, width, (height / 3) * 2);
}

function newDrawing(data) {
  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 36, 36);
}

function mouseDragged() {
  console.log("Sending:");
  console.log(mouseX + ", " + mouseY);

  var data = {
    x: mouseX,
    y: mouseY
  }

  socket.emit("mouse", data);

  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 36, 36);
}

function draw() {

}