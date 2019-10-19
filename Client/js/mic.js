function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();

    recognition.onstart = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
    }
    recognition.onend = function() {
      recognition.stop();
      console.log('Speech recognition has stopped.');
      console.log(document.getElementById('transcript').value);
      window.location.href = "../html/waitturn.html";
      }
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

startDictation();