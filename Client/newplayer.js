var Player = function(id) {
    this.id = id;
    this.update = function(){
        //SEND DATA TO HOST
    };
};

var player = new Player(Math.floor(Math.random() * 20));

addplayer = function() {
    player.update();
};