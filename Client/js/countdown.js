function timer () {
  var timeleft = document.currentScript.getAttribute('time');
  var downloadTimer = setInterval(function () {
  timeleft--
  document.getElementById('countdowntimer').textContent = timeleft
  if (timeleft <= 0) {
    clearInterval(downloadTimer)
    mic();
  }
}, 1000)
};

function mic() {
    setTimeout(function() {
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
            document.documentElement.style.setProperty('--key-color', '#ff9900');
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
            document.querySelector('p').innerHTML = finalTranscript + '<i style="color:#ddd;">' + interimTranscript + '</>';
        }
        recognition.start();
        recognition.onspeechend = function() {
            document.getElementById("load").className = document.getElementById("load").className.replace(/\bloading\b/,'');
            document.getElementById("aura").style.animationName = "false";
            document.documentElement.style.setProperty('--key-color', '#e6e6e6');
            recognition.stop();
        }
      }, 1000);
}

timer();
