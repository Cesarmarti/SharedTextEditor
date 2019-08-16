var express = require('express');
var socket = require('socket.io')

var app = express();


app.get('/',function(req,res){
	res.sendFile(__dirname+'/public/index.html');
});
app.use(express.static('public'));

var http = require('http').createServer(app);
var io = socket(http);

//vec textov

var allTexts = {
    default: 'Start typing here.'
};

io.on('connection',function(socket){
	console.log('a new user with id ' + socket.id + " has entered");

    socket.emit('newUser', allTexts['default']);

    socket.on('text', handleTextSent);

    socket.on('switchRoom', function(room) {
        //console.log(room);
        socket.leave(socket.room);
        socket.room = room;
        socket.join(room);
        socket.emit('newUser', allTexts[room]);
    });
    function handleTextSent(data){
        allTexts[socket.room] = data.text;
        socket.to(socket.room).emit('text',data);
        //io.sockets.emit('text', data);
    }
});

http.listen(8081, function () {
    console.log("Text editor running. Listening on port 8081.");
})
