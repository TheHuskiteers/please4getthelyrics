var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

//room id creator
var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

//Start server
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'html')));
/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/host');
})
*/

// room ids
let rooms = [];
function room(roomId, host, clients) {
  this.id = roomId || "";
  this.host = host || "";
  this.clients = clients || [];
}

io.on('connection', (socket) => {
  console.log("Client "+socket.id+" has joined!");

  //handle host joining
  socket.on('host join', () => {
    socket.host = true;
    let roomId = ID();

    rooms.push(new room(roomID, socket.id));
  });

  //handle client joining
  socket.on('client join', () => {
    socket.host = false;
  });

  socket.on('disconnect', (reason) => {
    console.log("Client "+socket.id+" has left, because of '" + reason +"'.");
  });
});
