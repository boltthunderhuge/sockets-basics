var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket) {
	console.log('user connected via socket.io!');

	socket.on('message', function(message) {
		console.log("message.name " + message.name + ' in room ' + message.rooom);
		message.timeStamp = moment().valueOf();
		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	socket.on('joinroom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);

		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined ' + req.room,
			timeStamp: moment().valueOf
		});
	});

	socket.emit('message', {name: 'System', text: 'Welcome to the chat app', timeStamp: moment().valueOf()});

});

http.listen(PORT, function() {
	console.log("Server started. Listening on port " + PORT);
});
