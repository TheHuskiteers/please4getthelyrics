var path = require('path')
var express = require('express')
var app = express()
var SpotifyWebApi = require('spotify-web-api-node')
var cookieParser = require('cookie-parser')
var server = require('http').createServer(app)
var io = require('socket.io')(server)

app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/public')))

const port = 3000

//// Logic for Spotify Web API (authenticate user, play/pause)
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
})

const scopes = ['streaming', 'user-modify-playback-state']

app.get('/', (req, res) => {
  res.redirect('/game.html')
})

app.get('/togglePlay', (req, res) => {
    // Toggle state of current song
    // Get room # from request
    var roomId = req.room   
})

app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes))
})

app.get('/callback', (req, res) => {
  const { code } = req.query
  spotifyApi.authorizationCodeGrant(code).then((data) => {
    spotifyApi.setAccessToken(data.body.access_token)
    spotifyApi.setRefreshToken(data.body.refresh_token)
    res.cookie('token', data.body.access_token)
    res.redirect('/game.html')
  }).catch((err) => console.log('Yikes! ' + err.message))
})

//// Logic for socket namespace/host/client management

// room id creator
var ID = function () {
  return Math.random().toString(36).substr(2, 4)
}

// room ids
const rooms = {}
function Room (host, clients, difficulty) {
  this.host = host
  this.clients = clients || []
  // keep track of game status
  this.difficulty = difficulty || 'easy'
  this.songs = [] // lst:str, will be chosen once clients are set in stone, there should be c * (# players) songs
  this.cur // current song
}

app.get('/join/:id', (req, res) => {
  // Socket logic to join room goes here
  
})

// start server
app.listen(port, () => console.log('please4getthelyrics listening on port ' + port))