/*
SUDO FOR CLIENT

1. Join game
2. Wait for host to resond say that the game is now starting
3. Either wait for your turn or perform your turn


*/

const roomId = document.cookie.replace(/(?:(?:^|.*;\s*)roomNum\s*\=\s*([^;]*).*$)|^.*$/, "$1");
const alias = document.cookie.replace(/(?:(?:^|.*;\s*)alias\s*\=\s*([^;]*).*$)|^.*$/, "$1");

var socket = io();
function joinGame(){
    socket.emit('client join', roomId, alias);
    console.log("joining game");
}
joinGame();