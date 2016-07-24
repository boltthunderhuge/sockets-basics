var PORT = process.env.PORT || 3000;
var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
	console.log('user connected via socket.io!');

	socket.on('message', function(message) {
		console.log('Message received: ' + message.text);
		// Sends to everyont BUT the sender
		//socket.broadcast.emit('message', message); // broadcasts to everyone BUT this socket
		io.emit('message', message);
	});

	socket.emit('message', {
		text: 'Welcome to the chat app'
	});
});

http.listen(PORT, function() {
	console.log("Server started. Listening on port " + PORT);
});