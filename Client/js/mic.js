window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
   let finalTranscript = '';
   let recognition = new window.SpeechRecognition();
   recognition.interimResults = true;
   recognition.maxAlternatives = 10;
   recognition.continuous = false;
   recognition.onresult = (event) => {
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
     document.getElementById("aura").style.background  = "transparent";
     recognition.stop();
   }