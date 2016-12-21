// usage:
// node scripts/get-data.js data_doc_name [args]

const fs = require('fs');
const querystring = require('querystring');

require('dotenv').config();
var argv = require('minimist')(process.argv.slice(2));
var doc = argv._.length ? argv._[0] : 'entries';
delete argv._;

const download = require('download');
const Promise = require('es6-promise').Promise;

var db = process.env.COUCHDB_SERVER;

var constantsUrl = db + 'helendb/_design/main/_view/constants';
var dataUrl = db + 'helendb/_design/main/_view/' + doc + '?' + querystring.stringify(argv);

console.log('grabbing: '+constantsUrl)
var constants = download(constantsUrl).pipe(fs.createWriteStream('data/constants.json'));
console.log('grabbing: '+dataUrl)
var data = download(dataUrl).pipe(fs.createWriteStream('data/data.json'));

Promise.all([constants, data], values => {
	console.log(values);
	process.exit()
}, reason => {
	console.error(reason);
	process.exit()
});