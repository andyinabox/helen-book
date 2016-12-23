// http://www.indesignjs.de/extendscriptAPI/indesign12/#about.html

var data;
var doc;
var MARGIN = 36;
var GUTTER = 20;
var TEXT_SIZE_INC = 0.25;

var urlPattern = /(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

function isUrl(str) {
	return b.isURL(str) || str.indexOf('www.') > -1;
}

function parseData(path) {
	return b.JSON.decode(b.loadString("data.json")).rows.map(function(d) {
		var data = d.value;
		data.face = new HelenFace(data.annotations);
		data.flickr_response = b.JSON.decode(data.flickr_response);
		return data;
	});
}

function loadDescription(id) {
	return b.loadString('txt/' + id + '.txt');
}


function setup() {
	data = parseData("data.json");
	doc = b.doc();
}

function drawFace(d) {
	b.noFill();

	b.stroke(200, 200, 200);
	var poly = d.face.drawCentered(b.width/2, b.height/3, 2 * b.width/3	);
	poly.textWrapPreferences.textWrapMode = TextWrapModes.CONTOUR;

	b.stroke(0, 0, 0);
	var features = d.face.drawFeaturesCentered(b.width/2, b.height/3, 2 * b.width/3	);
	// set text wrap
	// Object.keys(features).forEach(function(key) {
	// 	features[key].textWrapPreferences.textWrapMode = TextWrapModes.CONTOUR;
	// });

}

function drawText(d) {

	var mWidth = b.width - MARGIN*2;
	var mHeight = b.height - MARGIN*2;
	var tbWidth = (mWidth - GUTTER*2) / 3;
	var description = loadDescription(d._id);

	b.fill(0, 0, 0);
	b.textFont('Georgia');
	b.textSize(5);

	var text1 = b.text(description, MARGIN, MARGIN, tbWidth, mHeight);
	var text2 = b.text('', tbWidth+MARGIN+GUTTER, MARGIN, tbWidth, mHeight);
	var text3 = b.text('', tbWidth*2+MARGIN+GUTTER*2, MARGIN, tbWidth, mHeight);

	b.linkTextFrames(text1, text2);
	b.linkTextFrames(text2, text3);

	var redactedStyle = b.characterStyle('Redacted');
	var normalStyle = b.characterStyle('Normal');

	b.words(text1, function(w, i) {
		if(isUrl(w.contents)) {
			b.println('url found! '+w.contents);
			w.applyCharacterStyle(redactedStyle);
		} else {
			w.applyCharacterStyle(normalStyle);
		}
	});

	var overflows = text3.overflows

	// adjust size until text fits
	if(description.length && !overflows) {

		// keep increasing size until overflow
		while(!overflows) {
			b.paragraphs(text1, function(p, i) {

				p.pointSize += TEXT_SIZE_INC;
				overflows = text3.overflows;

				// dial it back once and then we're done
				if(overflows) {
					p.pointSize -= TEXT_SIZE_INC;
					return false;
				}		

			});
		}
	}

}

function draw() {

	b.forEach(data, function(d, i) {
	// var d = data[0]; i = 0;
		drawFace(d);
		drawText(d);

		if(i<data.length-1) {
			b.addPage(b.AFTER);
		}
	});
}


b.go();