const fs = require('fs');
const path = require('path');

const decode = require('parse-entities');
const strip = require('strip')

const data = require('../data/data.json').rows.map(function(d) { return d.value });

var description;

var cleanText = (str) => {
	return decode(strip(str));
}

data.forEach((d, i) => {
	description = d.flickr_description || d.flickr_title;
	fs.writeFileSync(__dirname + '/../data/txt/' + d._id + '.txt', cleanText(description), 'utf8');
});

