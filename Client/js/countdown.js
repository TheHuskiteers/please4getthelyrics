var timeleft = 10;
var downloadTimer = setInterval(function(){
timeleft--;
document.getElementById("countdowntimer").textContent = timeleft;
if(timeleft <= 0){
    clearInterval(downloadTimer);
    load_home();
}
},1000);

function load_home() {
    document.getElementById("content").innerHTML='<object type="text/html" data="home.html" ></object>';
}