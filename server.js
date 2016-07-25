var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
	console.log('user connected via socket.io!');

	socket.on('message', function(message) {
		console.log("message.name " + message.name);
		sendMessageWithTimeStamp(io, message.name, message.text);

		/*console.log('Message received: ' + message.text);
		// Sends to everyont BUT the sender
		//socket.broadcast.emit('message', message); // broadcasts to everyone BUT this socket
		io.emit('message', message);*/
	});

	sendMessageWithTimeStamp(socket, 'System', 'Welcome to the chat app');
	/*socket.emit('message', {
		text: 'Welcome to the chat app'
	});*/
});

http.listen(PORT, function() {
	console.log("Server started. Listening on port " + PORT);
});

function sendMessageWithTimeStamp(channel, name, message) {

	console.log(channel + ' ' + name + ' ' + message);
	channel.emit('message', {
		name: name,
		text: message,
		timeStamp: moment.valueOf()
	});
}