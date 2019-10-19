var timeleft = 10
var downloadTimer = setInterval(function () {
  timeleft--
  document.getElementById('countdowntimer').textContent = timeleft
  if (timeleft <= 0) {
    clearInterval(downloadTimer)
    turn()
  }
}, 1000)

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
