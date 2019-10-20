navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function (stream) {
    console.log('Access to mic allowed!')
  })
  .catch(function (err) {
    console.log('Access to mic denied!')
  })
