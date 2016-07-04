var moment = require('moment');
var now = moment();

console.log(now.format());

var timestamp = 224342343;
var timestampMoment = moment.utc(now).local();

console.log(timestampMoment.format('h:mm a'))


//
// now.subtract(1,'year');
// console.log(now.format());
// console.log(now.format('MMM Do YYYY, h:mm:ss a'));