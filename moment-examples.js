var moment = require('moment');

var now = moment();

console.log(now.format());
/*//now.subtract(1, 'year');
console.log(now.format('YYYY'));
console.log(now.format('h:mma'));
console.log(now.format('MMM Do YYYY, h:mma'));
console.log(now.format('X'));*/
console.log(now.format('x'));
console.log(now.valueOf());

var timestamp = 1469461567012;
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment);

console.log(timestampMoment.format());

function timeStamp2Time(timestamp) {
	return moment.utc(timestamp).local().format('h:mma');
}

console.log("Timestamp is " + timeStamp2Time(timestamp));