var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: true});

socket.on('client join success', function () {
    window.location.href = '../Client/html/waithost.html';
  });
