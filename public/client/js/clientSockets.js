
    const roomId = document.cookie.replace(/(?:(?:^|.*;\s*)roomNum\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    const alias = document.cookie.replace(/(?:(?:^|.*;\s*)alias\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    //Join game
    var socket = io();
    function joinGame(){
      socket.emit('client join', roomId, alias);
      console.log("joining game");
    }
    joinGame();

    //Access mic once you have connected to game
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      console.log('Access to mic allowed!')
    })
    .catch(function(err) {
      console.log('Access to mic denied!')
    });

    //Start game, wait till it is your turn
    socket.on('game start', () => {
      document.getElementById("scorespan").display = "block";
      document.getElementById("load").innerHTML = "Waiting for your turn";
      //refresh html, make it waitturn
    })

    //It is now your turn, play
    socket.on('gimme da line', () => {
      document.getElementById("scorespan").display = "block";
      document.getElementById("load").innerHTML = "Sing!"
      document.getElementById("load").className = document.getElementById("load").className.replace('',/\bloading\b/);
      document.documentElement.style.setProperty('--key-color', '#ff9900');

      window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      let finalTranscript = '';
      let recognition = new window.SpeechRecognition();
      recognition.interimResults = true;
      recognition.maxAlternatives = 10;
      recognition.continuous = false;
      recognition.onresult = (event) => {
          document.getElementById("load").className = document.getElementById("load").className.replace('',/\bloading\b/);
          let interimTranscript = '';
          for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
          let transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
              finalTranscript += transcript;
          } else {
              interimTranscript += transcript;
          }
          }
          document.querySelector('p').innerHTML = finalTranscript + '<i id="words" style="color:#6e6e6e;">' + interimTranscript + '</>';
      }
      recognition.start();
      recognition.onspeechend = function() {
          document.documentElement.style.setProperty('--key-color', '#e6e6e6');
          document.getElementById("load").className = document.getElementById("load").className.replace(/\bloading\b/,'');
          recognition.stop();
          //we need to record the voice, take transcription and put it to variable
          var transcription;
          try {
            transcription = document.getElementById("words").innerHTML;
            console.log(transcription);
            socket.emit('client result', transcription);
          } catch (e) {
            socket.emit('client result', "");
            console.log('no input recieved');
          }
      }

    })