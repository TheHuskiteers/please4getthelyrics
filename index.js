var path = require('path')
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var SpotifyWebApi = require('spotify-web-api-node')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')))

const port = 3000

server.listen(port, () => console.log('Server listening on port ' + port))
// Room id creator
var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 4)
}

var rooms = {}
function Room (host, clients) {
  this.host = host
  this.clients = clients || []
}

io.on('connection', (socket) => {
  console.log('something joined')

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
    } else if (socket.room) {
      // if socket is host, remove from clients array, then update host
      socket.room.clients = socket.room.clients.filter((obj) => { return obj.id !== socket.id })
      socket.room.host.emit('host room info', { roomId: socket.roomId, clientLength: socket.room.clients.length })
    }
  })
})

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
})

const scopes = ['streaming', 'user-modify-playback-state']

app.get('/', (req, res) => {
  res.redirect('/game.html')
})

app.get('/join/:id', (req, res) => {
  // Socket logic to join room goes here
})

app.get('/togglePlay', (req, res) => {
  // Toggle state of current song
  // Get room # from request
})

app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes))
})

app.get('/callback', (req, res) => {
  const { code } = req.query
  spotifyApi.authorizationCodeGrant(code).then((data) => {
    spotifyApi.setAccessToken(data.body.access_token)
    spotifyApi.setRefreshToken(data.body.refresh_token)
    res.cookie('token', data.body.access_token, { maxAge: data.body.expires_in })
    res.redirect('/host.html')
  }).catch((err) => console.log('Yikes! ' + err.message))
})

app.post('/connect-to-room', (req, res) => {
  console.log(req.body.roomNum)
  if (rooms[req.body.roomNum] !== undefined) {
    res.cookie('roomNum', req.body.roomNum)
    res.redirect('/client.html')
  }
  // not easy to return error msg to form submit
  // so just do nothing if roomId DNE
})
