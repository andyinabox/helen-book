// http://www.indesignjs.de/extendscriptAPI/indesign12/#about.html

var data;
var doc;
var MARGIN = 36;
var GUTTER = 20;

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
	b.stroke(0, 0, 0);
	b.noFill();
	var features = d.face.drawFeaturesCentered(b.width/2, b.height/3, 2 * b.width/3	);
	// set text wrap
	Object.keys(features).forEach(function(key) {
		features[key].textWrapPreferences.textWrapMode = TextWrapModes.CONTOUR;
	});
}

function drawText(d) {

	var mWidth = b.width - MARGIN*2;
	var mHeight = b.height - MARGIN*2;
	var tbWidth = (mWidth - GUTTER*2) / 3;

	b.fill(0, 0, 0);
	b.textFont('Georgia');
	b.textSize(10);

	var text1 = b.text(loadDescription(d._id), MARGIN, MARGIN, tbWidth, mHeight);
	var text2 = b.text('', tbWidth+MARGIN+GUTTER, MARGIN, tbWidth, mHeight);
	var text3 = b.text('', tbWidth*2+MARGIN+GUTTER*2, MARGIN, tbWidth, mHeight);

	b.linkTextFrames(text1, text2);
	b.linkTextFrames(text2, text3);
}

function draw() {

	b.forEach(data, function(d, i) {

		drawFace(d);
		drawText(d);

		if(i<data.length-1) {
			b.addPage(b.AFTER);
		}
	});
}


b.go();