// http://www.indesignjs.de/extendscriptAPI/indesign12/#about.html

var data;
var doc;
var MARGIN = 36;
var GUTTER = 20;
var TEXT_SIZE_INC = 0.25;
// var LIMIT = 1;

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

function drawVectorLine(v1, v2) {
	return b.line(v1.x, v1.y, v2.x, v2.y);
}

function drawFace(d, i) {
	b.println('Drawing face');

	var current = d.face;
	var prev = (i > 0) ? data[i-1].face : null;
	var next = (i < data.length-1) ? data[i+1].face : null;
	var x = b.width/2;
	var y = b.height/3;
	var width = 2 * b.width/3;


	// draw connected lines
	b.noFill();
	b.stroke(200, 200, 200);

	if (prev) {
		var prevLine = drawVectorLine(
			prev.getLastPoint('centered', x-b.width, y, width),
			current.getFirstPoint('centered', x, y, width)
		);
		prevLine.textWrapPreferences.textWrapMode = TextWrapModes.CONTOUR;
	}


	if (next) {
		var nextLine = drawVectorLine(
			current.getLastPoint('centered', x, y, width),
			next.getFirstPoint('centered', x+b.width, y, width)
		);
		nextLine.textWrapPreferences.textWrapMode = TextWrapModes.CONTOUR;
	}

	var poly = current.drawCentered(x, y, width);
	poly.textWrapPreferences.textWrapMode = TextWrapModes.CONTOUR;

	// draw features
	b.stroke(0, 0, 0);
	var features = current.drawFeaturesCentered(x, y, width);
	// set text wrap
	// Object.keys(features).forEach(function(key) {
	// 	features[key].textWrapPreferences.textWrapMode = TextWrapModes.CONTOUR;
	// });

}

function drawText(d) {
	b.println('Drawing text');

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
	var d;
	var i = 0;

	// loop though data, allow for limit if desired
	while(i < LIMIT && i < data.length) {

		d = data[i];

		b.println('===================================');
		b.println(' Drawing '+d._id);
		b.println('===================================');

		drawFace(d, i);
		drawText(d, i);

		if(i<data.length-1) {
			b.addPage(b.AFTER);
		}

		i++;
	}
}


b.go();