var path = require('path')
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var SpotifyWebApi = require('spotify-web-api-node')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var fs = require('fs')

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')))

const port = 3000

var jsonLyricFiles = []
// Read JSON karaoke Files.
files = fs.readdirSync('./public/karson/')
files.forEach((fileName) => {
  if (fileName.includes('.json')) {
    file = fs.readFileSync('./public/karson/' + fileName, 'utf-8')
    jsonLyricFiles.push({
      spotifyURI: fileName.split('.json')[0],
      lyricData: JSON.parse(file)
    })
  }
})

server.listen(port, () => console.log('Server listening on port ' + port))
// Room id creator
var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 4)
}

function shuffle (b) { // Shuffles lists, pass by value (WORKS)
  a = b.slice(0)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function processRoundData (lyricData) {
  // TODO: Game difficulty: prioritize chorus for easy, verse 1 for normal, verse 2 for hard.
  // Pick a section fully randomly
  console.log(lyricData[0][2].lyric)
  const musicSection = shuffle(lyricData)[0]
  // Pick a \\, keep adding until the next \\.
  const newLineCoupleIndicies = []
  for (let i = 0; i < musicSection.length; i++) {
    if (musicSection[i].lyric == '\\') {
      newLineCoupleIndicies.push(i)
    }
  }
  newLineCoupleIndicies.pop()
  const startingIndex = shuffle(newLineCoupleIndicies)[0]
  const finalLineCouple = []
  const newLineIndicies = []
  const onSecondCouple = false
  for (let i = startingIndex + 1; i < musicSection.length && !(musicSection[i].lyric == '\\'); i++) {
    console.log('Line: ' + musicSection[i].lyric)
    if (musicSection[i].lyric == '/') {
      newLineIndicies.push(i - startingIndex)
    }
    finalLineCouple.push(musicSection[i])
  }
  console.log(newLineIndicies)
  // Now, extract a missing line.
  const lastLineIndex = newLineIndicies.pop()
  const visibleLines = finalLineCouple.slice(0)
  const hiddenLines = []
  let answerString = ''
  for (let i = lastLineIndex + 1; i < finalLineCouple.length; i++) {
    answerString += finalLineCouple[i].lyric
    hiddenLines.push(finalLineCouple[i])
    visibleLines[i] = {
      timestamp: -1,
      lyric: '__'
    }
  }
  // TODO: Pick half the line.
  return {
    finalLineCouple: finalLineCouple,
    visibleLines: visibleLines,
    hiddenLines: hiddenLines,
    answer: answerString
  }
}
// console.log(JSON.stringify(processRoundData(jsonLyricFiles[0].lyricData)))
// console.log(JSON.stringify(processRoundData(jsonLyricFiles[1].lyricData)))
console.log(JSON.stringify(processRoundData(jsonLyricFiles[2].lyricData)))
console.log(JSON.stringify(processRoundData(jsonLyricFiles[3].lyricData)))
// console.log(JSON.stringify(processRoundData(jsonLyricFiles[4].lyricData)))
// console.log(JSON.stringify(processRoundData(jsonLyricFiles[5].lyricData)))
// console.log(JSON.stringify(processRoundData(jsonLyricFiles[6].lyricData)))
// console.log(JSON.stringify(processRoundData(jsonLyricFiles[7].lyricData)))

var rooms = {}
function Room (host) {
  this.host = host
  this.clients = []
  this.roomSize = 0
  this.open = true
  this.getClients = function () {
    var client_data = this.clients.map((client) => {
      return {
        alias: client.alias,
        id: client.id
      }
    })
    return client_data
  }
  this.open = true;
  this.songOrder = shuffle(jsonLyricFiles);
  this.currentPlayer = 0;

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
    socket.emit('create game success', { roomId: roomId, clients: socket.room.getClients() })
    console.log('Host ' + socket.id + ' has joined and created room ' + roomId)
  })

  socket.on('game start', () => {
    socket.room.open = false

    // TODO: Acually start game. Fetch song data, pick song,
    var gameInfo = {}
    socket.emit('game init', gameInfo)
    for (client of socket.room.clients) {
      client.emit('game start')
    }
  })

  socket.on('gimme da line', () => {
    currentPlayer = socket.room.clients.pop()
    currentPlayer.emit('gimme da line');
    
    //Once the player has said the line, put the player at the back of the player order.
    // socket.room.currentPlayer = socket.room.currentPlayer + 1 >= socket.clients.length ? 0 : socket.room.currentPlayer + 1
  })

  socket.on('new round', () => {
    if(socket.room.songOrder.length == 0){
      //TODO: End Game.
    } else{
      const nextSong = socket.room.songOrder.pop()
      const spotifyURI = nextSong.spotifyURI
      socket.room.roundLineData = processRoundData(nextSong.lyricData)
      socket.emit('game info', { spotifyURI: spotifyURI, roundLineData: socket.room.roundLineData })
    }
  })

  // handle client joining
  socket.on('client join', (roomId, alias) => {
    console.log('Yay for ' + roomId + alias)
    if (rooms[roomId] && rooms[roomId].open) {
      socket.alias = alias
      socket.host = false
      socket.roomId = roomId
      socket.room = rooms[roomId]
      rooms[roomId].clients.push(socket)
      socket.room.host.emit('update pregame info', { roomId: roomId, clients: socket.room.getClients() })
      socket.emit('client join success')
      console.log('Client ' + socket.id + ' has joined room ' + roomId)
    } else {
      socket.emit('client join faliure')
      console.log('Client tried to connect with ' + roomId + alias)
      console.log('Unfortunately, ' + rooms[roomId])
      console.log('and ' + rooms[roomId].open)
      console.log('Client ' + socket.id + ' failed to join room ' + roomId)
    }
  })

  socket.on('client result', (transcription) => {
    // TODO: verify transcription, attribute points accordingly
    const correct = socket.room.roundLineData.answer == transcription /// / TODO: make this more merciful
    results = {
      transcription: transcription,
      correct: correct

    }
    socket.room.host.emit('round results', results)
  })

  // handle disconnect
  socket.on('disconnect', (reason) => {
    console.log((socket.host) ? 'Host ' + socket.id + " has left, because of '" + reason + "'." : 'Client ' + socket.id + " has left, because of '" + reason + "'.")

    // delete room

    if (socket.host) {
      delete rooms[socket.roomId]
      // TODO: have clients timeout when room deleted
    } else if (socket.room) {
      // if socket isn't host, remove from clients array, then update host
      const alias = socket.alias
      socket.room.clients = socket.room.clients.filter((obj) => { return obj.id !== socket.id })
      socket.room.host.emit('update pregame info', { roomId: socket.host, clients: socket.room.getClients() })
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
  console.log(req.body.roomNum, req.body.alias)
  if (rooms[req.body.roomNum] !== undefined) { // if room exists
    res.cookie('roomNum', req.body.roomNum)
    res.cookie('alias', req.body.alias)
    res.redirect('/client.html')
  }
  // not easy to return error msg to form submit
  // so just do nothing if roomId DNE
})
