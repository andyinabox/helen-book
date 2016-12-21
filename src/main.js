// http://www.indesignjs.de/extendscriptAPI/indesign12/#about.html

var data;
var doc;
var MARGIN = 36;
var GUTTER = 20;
var TEXT_SIZE_INC = 0.25;

function parseData(path) {
	return b.JSON.decode(b.loadString("data.json")).rows.map(function(d) {
		var data = d.value;
		data.face = new HelenFace(data.annotations);
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

	b.fill(0, 0, 0);
	b.textFont('Georgia');
	b.textSize(5);

	var text1 = b.text(loadDescription(d._id), MARGIN, MARGIN, tbWidth, mHeight);
	var text2 = b.text('', tbWidth+MARGIN+GUTTER, MARGIN, tbWidth, mHeight);
	var text3 = b.text('', tbWidth*2+MARGIN+GUTTER*2, MARGIN, tbWidth, mHeight);

	b.linkTextFrames(text1, text2);
	b.linkTextFrames(text2, text3);

	// adjust size until text fits
	if(text3.overflows === false) {
		b.println('not overflowing')
		var p = text1.paragraphs;

		// keep increasing size until overflow
		while(text3.overflows === false) {
			for(var i=0; i < p.length; i++) {
				p[i].pointSize = p[i].pointSize + TEXT_SIZE_INC;
				b.println('trying font size '+p[i].pointSize);
			}
		}

		// back it up one
		for(var i=0; i < p.length; i++) {
			p[i].pointSize = p[i].pointSize - TEXT_SIZE_INC;
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