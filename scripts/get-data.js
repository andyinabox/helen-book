// usage:
// node scripts/get-data.js data_doc_name [args]

require('dotenv').config();
const fs = require('fs');
const querystring = require('querystring');
const got = require('got');
const Promise = require('es6-promise').Promise;

var argv = require('minimist')(process.argv.slice(2));
var doc = argv._.length ? argv._[0] : 'entries';
delete argv._;

const gotOptions = {
	baseUrl: process.env.COUCHDB_SERVER,
	json: true,
	body: JSON.stringify({
		"name": process.env.COUCHDB_USER,
		"password": process.env.COUCHDB_PASSWORD
	})
};

// these are loaded from .env file
// you may also want to set `NODE_TLS_REJECT_UNAUTHORIZED=0`
// if using a self-signed certificate
const db = process.env.COUCHDB_SERVER;
const constantsUrl = db + 'helendb/_design/main/_view/constants';
const dataUrl = db + 'helendb/_design/main/_view/' + doc + '?' + querystring.stringify(argv);

console.log('grabbing: '+constantsUrl)
const constants = got.get(constantsUrl).then(response => {
	fs.writeFileSync('data/constants.json', response.body);
});
console.log('grabbing: ' + dataUrl)
const data = got.get(dataUrl).then(response => {
	fs.writeFileSync('data/data.json', response.body);
});

Promise.all([constants, data], values => {
	console.log(values);
	process.exit()
}, reason => {
	console.error(reason);
	process.exit()
});