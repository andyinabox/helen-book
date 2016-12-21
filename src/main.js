// http://www.indesignjs.de/extendscriptAPI/indesign12/#about.html

var data;
var doc;
var description;
var MARGIN = 36;
var GUTTER = 20;

app.textImportPreferences.characterSet = TextImportCharacterSet.MACINTOSH_ROMAN;
app.textImportPreferences.useTypographersQuotes = true;

function cleanText(str) {
	var re = /<[^>]*>/g
	return str.replace(re, '');
}


function parseData(path) {
	return b.JSON.decode(b.loadString("data.json")).rows.map(function(d) {
		var data = d.value;
		data.flickr_description = cleanText(data.flickr_description);
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

function draw() {
	b.println(data.length);

	var mWidth = b.width - MARGIN*2;
	var mHeight = b.height - MARGIN*2;
	var tbWidth = (mWidth - GUTTER*2) / 3;

	b.forEach(data, function(d, i) {
	// var d = data[0]; var i = 0;
		var annotations = d.annotations;
		var imageSize = d.helen_img_size;
		// var imgHeight = b.height;
		// var imgWidth = imageSize[0] * (imgHeight / imageSize[1]);
		var imgWidth = b.width;
		var imgHeight = imageSize[1] * (imgWidth / imageSize[0]);
		var annotationScale = imgWidth / imageSize[1];

		// b.pushMatrix();

			// b.translate((b.width-imageSize[0] * annotationScale) / 2, 0);
			// b.scale(annotationScale);

			b.stroke(0, 0, 0);
			b.noFill();
			var features = d.face.drawFeaturesCentered(b.width/2, b.height/3, 2 * b.width/3	);

			// b.println(Object.keys(features).length);

			// set text wrap
			Object.keys(features).forEach(function(key) {
				features[key].textWrapPreferences.textWrapMode = TextWrapModes.CONTOUR;
			});

			// b.forEach(annotations, function(a, i) {
			// 	b.println(i);
				
			// 	b.textFont('Helvetica');
			// 	b.textSize(8);
			// 	b.fill(0, 0, 0);
			// 	b.noStroke();
			// 	b.text(i, a[0]*annotationScale, a[1]*annotationScale, 30, 10);
			// 	b.ellipse(a[0]*annotationScale, a[1]*annotationScale, 2, 2);

			// });

		// b.popMatrix();

		b.fill(0, 0, 0);
		b.textFont('Georgia');
		b.textSize(10);


		// var text1 = b.text(d.flickr_description, MARGIN, MARGIN, tbWidth, mHeight);
		var text1 = b.text(loadDescription(d._id), MARGIN, MARGIN, tbWidth, mHeight);
		var text2 = b.text('', tbWidth+MARGIN+GUTTER, MARGIN, tbWidth, mHeight);
		var text3 = b.text('', tbWidth*2+MARGIN+GUTTER*2, MARGIN, tbWidth, mHeight);

		b.linkTextFrames(text1, text2);
		b.linkTextFrames(text2, text3);

		if(i<data.length-1) {
			b.addPage(b.AFTER);
		}
	});
}


b.go();