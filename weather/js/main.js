

$(document).ready(function() {
const host = 'ws://127.0.0.1:8080/weather.php';
        var socket = new WebSocket(host);
        socket.onmessage = function(e) {
            console.log(e.data);
        };
});
