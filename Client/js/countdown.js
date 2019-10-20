function timer () {
  var timeleft = document.currentScript.getAttribute('time');
  var status = document.currentScript.getAttribute('status');
  var downloadTimer = setInterval(function () {
  timeleft--
  document.getElementById('countdowntimer').textContent = timeleft
  if (timeleft <= 0) {
    clearInterval(downloadTimer)
  }
}, 1000)
}

function turn () {
  setTimeout(function () {
    var check = 1
    var myturn = false
    if (myturn == true) {
      window.location.href = '../html/myturn.html'
    } else {
      window.location.href = '../html/waitturn.html'
    }
  }, 1000)
}

timer();
