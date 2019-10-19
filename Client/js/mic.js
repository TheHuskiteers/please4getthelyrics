<<<<<<< HEAD
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
=======
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  var recognition = new SpeechRecognition()
} catch (e) {
  console.error(e)
  $('.no-browser-support').show()
  $('.app').hide()
}

recognition.onstart = function () {
  instructions.text('Voice recognition activated. Try speaking into the microphone.')
}

recognition.onspeechend = function () {
  instructions.text('You were quiet for a while so voice recognition turned itself off.')
}

recognition.onerror = function (event) {
  if (event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.')
  };
}

recognition.onresult = function (event) {
  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far.
  // We only need the current one.
  var current = event.resultIndex

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript

  // Add the current transcript to the contents of our Note.
  noteContent += transcript
  noteTextarea.val(noteContent)
}

var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript)

if (!mobileRepeatBug) {
  noteContent += transcript
  noteTextarea.val(noteContent)
}

$('#start-record-btn').on('click', function (e) {
  recognition.start()
})

$('#pause-record-btn').on('click', function (e) {
  recognition.stop()
})
>>>>>>> 6aa963744aca55336be2935c045e6285d952e80d
