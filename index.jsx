﻿#includepath "node_modules/";#include "basiljs/basil.js";var data;var doc;function parseData(path) {	return b.JSON.decode(b.loadString("data.json")).rows.map(function(d) {		return d.value	});}function setup() {	data = parseData("data.json");	doc = b.doc();	b.noFill();	b.stroke(0, 0, 0);}function draw() {	b.println(data.length);	b.forEach(data, function(d) {		var annotations = d.annotations;		var imageSize = d.helen_img_size;		// var imgHeight = b.height;		// var imgWidth = imageSize[0] * (imgHeight / imageSize[1]);		var imgWidth = b.width;		var imgHeight = imageSize[1] * (imgWidth / imageSize[0]);		var annotationScale = imgWidth / imageSize[1];		b.pushMatrix();			b.translate((b.width-imageSize[0] * annotationScale) / 2, 0);			b.scale(annotationScale);			b.beginShape();			b.forEach(annotations, function(a) {				b.vertex(a[0], a[1]);			});			b.endShape();		b.popMatrix();		b.addPage(b.AFTER);	});}b.go();