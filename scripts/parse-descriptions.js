const fs = require('fs');
const path = require('path');

const decode = require('parse-entities');
const strip = require('strip')

const data = require('../data/data.json').rows.map(function(d) { return d.value });

var description;

var cleanText = (str) => {
	return decode(strip(str));
}


var loadComments = (d) => {
	var comments = '';
	var flickr, count;

	// JSON decode flickr response
	if(d.flickr_response) {
		flickr = JSON.parse(d.flickr_response).photo;
	} else return comments;


	count = parseInt(flickr.comments._content);

	// get comments
	if(count && flickr.notes) {
		comments = flickr.notes.note.map(function(c, i) {
			return c._content;
		});
	} else return comments;

	return comments.join("\n");
}

data.forEach((d, i) => {
	description = d.flickr_description || d.flickr_title || loadComments(d);
	fs.writeFileSync(__dirname + '/../data/txt/' + d._id + '.txt', cleanText(description), 'utf8');
});

