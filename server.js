var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendUserList(socket) {
	var info = clientInfo[socket.id];
	var users = [];

	// or if (typeof info === 'undefined') ??
	if (!info) {
		return;
	}

	Object.keys(clientInfo).forEach(function(socketId) {
		console.log('Checking ' + info.room + ' against ' + clientInfo[socketId].room);
		if (info.room === clientInfo[socketId].room) {
			//console.log('pushing user ' + clientInfo[socketId].user);
			users.push(clientInfo[socketId].name);
		}
	});

	io.to(clientInfo[socket.id].room).emit('message', {
		name: 'System',
		text: 'users : ' + users.join(' '),
		timestamp: moment().valueOf()
	});
}


io.on('connection', function(socket) {

	//logRooms(socket);

	console.log('user connected via socket.io!');

	socket.on('disconnect', function() {
		console.log('received disconnect');
	
		var userData = clientInfo[socket.id];

		// if we're 'connected' to this room
		if (typeof userData !== 'undefined') {
			console.log(userData);
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});

			delete clientInfo[socket.id];
		}
	});

	socket.on('message', function(message) {
		console.log("message.name " + message.name + ' in room ' + message.rooom);

		// Intercept special messages
		if (message.text === "@currentUsers") {
			// do something special
			sendUserList(socket);
		} else if (message.text.startsWith('@private')) {
			makePrivateMessage(socket, message);
		}
	
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

function makePrivateMessage(socket, message) {
	// split the incoming message into component parts
	// First, the @private
	var nameAndMessage = message.text.slice('@private '.length);
	var firstSpace = nameAndMessage.indexOf(' ');
	message.recipientName = nameAndMessage.slice(0, firstSpace);
	message.text = nameAndMessage.slice(firstSpace+1);
}

function logRooms(socket) {
	console.log('Logging rooms...');
	console.log(socket);

	for (var p in socket) {
		if (socket.hasOwnProperty(p)) {
			console.log(p + ' ' + socket[p]);
		}
	}
	socket.rooms.forEach(function(room) {
		console.log(room);
	});
}
