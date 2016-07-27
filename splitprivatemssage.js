var testInput = '@private Jen fuck you, jen!';

function extractMessageAndUser(testInput) {
	var nameAndMessage = testInput.slice('@private '.length);

	console.log(testInput + ' -> ' + nameAndMessage);

	var firstSpace = nameAndMessage.indexOf(' ');
	var name = nameAndMessage.slice(0, firstSpace);
	var message = nameAndMessage.slice(firstSpace+1);

	console.log('name : ' + name + ' of length ' + name.length);
	console.log('message : ' + message);
}

extractMessageAndUser(testInput);