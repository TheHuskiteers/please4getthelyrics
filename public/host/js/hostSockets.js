var socket = io();
var currentRoundInfo

function createGame() {
  console.log("In host.html, creating a new room");
  socket.emit('host join');
}

function startGame() {
  socket.emit('game start');
}

// initialize host information
var clients = [] // no clients yet
var clientAliases = [] // no client aliases yet
document.getElementsByClassName("btn")[0].disabled = true; // 0 players, cannot start game
socket.on('create game success', (info) => {
  console.log("successfully created a new room, with " + info);
  document.getElementById("code").innerHTML = info.roomId; // show room ID
})

// keep track of clients as they join
socket.on('update pregame info', (info) => {
  console.log(info);
  document.getElementById("curPlayers").innerHTML = "Current players: " + info.clients.length;
  clients = info.clients; // updates client list
  clientAliases = info.clients.map((client) => { // updates alias list (for convenience)
    return client.alias;
  })

  console.log(clientAliases);

  // shows player aliases in grid on host screen
  // first clear all current users:
  var gridDiv = document.getElementById("nameGrid");
  while (gridDiv.firstChild) {
    gridDiv.removeChild(gridDiv.firstChild);
  }

  // create new children (aliases) to appear
  for (var i = 0; i < clientAliases.length; i++) {
    console.log(clientAliases[i]);
    var newDiv = document.createElement("div");
    var newAlias = document.createTextNode(clientAliases[i]);
    newDiv.appendChild(newAlias);

    gridDiv.appendChild(newDiv);
  }

  if (info.removeAlias != undefined) {
    clientAliases = clientAliases.filter(e => e !== info.removeAlias);
  }


  if (info.clientLength == 0) {
    document.getElementsByClassName("btn")[0].disabled = true;
  } else {
    document.getElementsByClassName("btn")[0].disabled = false;
  }
});

socket.on('game init', () => {
  document.getElementById('lobbyDiv').style.display = "none";
  document.getElementById('gameDiv').style.display = "block"
  socket.emit('new round');
})
socket.on('game info', (info) => {
  let responseBox = document.getElementById("responseText");
  let roundNum = document.getElementById("roundNum")
  roundNum.innerHTML = parseInt(roundNum.innerHTML) + 1 + ''
  responseBox.innerHTML = "It's " + info.currentPlayer + "'s Turn!"
  responseBox.style.color = "blue"
  //take the info created from processRoundData and spotify URI, put it on screen
  currentRoundInfo = info
  let songURI = info.spotifyURI;
  let roundLineData = info.roundLineData
  let visibleLines = roundLineData.visibleLines //First display
  let startTimestamp = visibleLines[0].timestamp
  let firstHiddenTimestamp = roundLineData.hiddenLines[0].timestamp
  let clipLength = (firstHiddenTimestamp - startTimestamp) * 1000
  emptyLyrics(lyricBox)
  inputJSONLyrics(lyricBox, visibleLines)
  var fullURI = "spotify:track:" + info.spotifyURI
  play(fullURI, startTimestamp * 1000);
  playLyrics(lyricBox);
  setTimeout(function () {
    pause();
    socket.emit('gimme da line'); //emit 5 seconds before pause
  }, clipLength);


})
socket.on('round results', (results) => {
  let responseBox = document.getElementById("responseText");
  console.log(results);
  info = currentRoundInfo
  let songURI = info.spotifyURI;
  let roundLineData = info.roundLineData
  let allLines = roundLineData.finalLineCouple
  let startTimestamp = allLines[0].timestamp
  let endTimestamp = allLines[allLines.length - 1].timestamp
  let clipLength = (endTimestamp - startTimestamp) * 1000
  emptyLyrics(lyricBox)
  inputJSONLyrics(lyricBox, allLines)
  if (results.correct) {
    responseBox.style.color = "green"
    responseBox.innerHTML = 'That is Correct! You said "' + results.transcription + '""'
    setTimeout(function () {
      socket.emit('new round');
    }, 3000);
  } else {
    var fullURI = "spotify:track:" + info.spotifyURI
    responseBox.style.color = "red"
    responseBox.innerHTML = 'Sorry, that is incorrect. You said "' + results.transcription + '"'
    play(fullURI, startTimestamp * 1000);
    playLyrics(lyricBox);
    setTimeout(function () {
      pause();
    }, clipLength + 1000);
    setTimeout(function () {
      socket.emit('new round');
    }, clipLength + 2000);
  }
})
socket.on('game end', (info) => {
  winners = info.winner
  highestPoints = info.points
  winnerString = ''
  winnerString += winners.pop()
  if (winners.length > 0) {
    for (winner of winners) {
      winnerString += ' and ' + winner;
    }
    winnerString += " win with " + highestPoints + " points!"
  } else {
    winnerString += " wins with " + highestPoints + " points!"
  }
  emptyLyrics(lyricBox);
  lyricBox.innerHTML = winnerString;
})
createGame();