var path = require('path')
var express = require('express')
var app = express()
var SpotifyWebApi = require('spotify-web-api-node')
var cookieParser = require('cookie-parser')

app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/public')))

const port = 3000

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

app.listen(port, () => console.log('please4getthelyrics listening on port ' + port))
