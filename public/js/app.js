var name = getQueryVariable('name') || 'Mystery Dude';
var room = getQueryVariable('room');

var socket = io();

var $room = jQuery(".room-title").text(room);

socket.on('connect', function() {
	console.log('connected to socket.io server');

	socket.emit('message', {
		name: name,
		text: 'joined ' + room
	});
});

socket.on('message', function(message){

	var $messageDiv = jQuery('.messages');
	console.log(message.text);

	var formattedLocalTime = moment.utc(message.timeStamp).local().format('h:mma');
	var messageWithTime = formattedLocalTime;// + ' : ' + message.text;
	$messageDiv.append('<p><strong>' + message.name + ' ' + formattedLocalTime + '</strong>');
	$messageDiv.append('<p>' + message.text + "</p>");
});

// handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function(event) {
	event.preventDefault(); // prevents page refresh

	var $messageField = $form.find('input[name=message]');
	socket.emit('message', {
		name: name,
		text: $messageField.val() // selector locates any input tag within $form with a name attribute that equals 'message'
	});

	// Clear the field
	$messageField.val('');
});