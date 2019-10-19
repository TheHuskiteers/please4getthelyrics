var express = require('express')
var app = express()
var path = require('path')
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var port = process.env.PORT || 8080

// room id creator
var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 4)
}

// Start server
server.listen(port, () => {
  console.log('Server listening at port %d', port)
})

// Routing
app.use(express.static(path.join(__dirname, 'html')))
/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/host');
})
*/

// room ids
const rooms = {}
function Room (host, clients) {
  this.host = host
  this.clients = clients || []
}

io.on('connection', (socket) => {
  // handle host joining
  socket.on('host join', () => {
    socket.host = true

    // create room
    const roomId = ID()
    socket.roomId = roomId
    rooms[roomId] = new Room(socket)
    socket.room = rooms[roomId]
    socket.emit('host room info', { roomId: roomId, clientLength: socket.room.clients.length })
    console.log('Host ' + socket.id + ' has joined and created room ' + roomId)
  })

  // handle client joining
  socket.on('client join', (roomId) => {
    socket.host = false
    socket.roomId = roomId
    socket.room = rooms[roomId]
    rooms[roomId].clients.push(socket)
    socket.room.host.emit('host room info', { roomId: roomId, clientLength: socket.room.clients.length })
    console.log('Client ' + socket.id + ' has joined!')
  })

  socket.on('disconnect', (reason) => {
    console.log((socket.host) ? 'Host ' + socket.id + " has left, because of '" + reason + "'." : 'Client ' + socket.id + " has left, because of '" + reason + "'.")

    // delete room
    if (socket.host) {
      delete rooms[socket.roomId]
      // TODO: have clients timeout when room deleted
    }
  })
})
