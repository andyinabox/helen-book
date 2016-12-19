#includepath "../node_modules/";
#include "basiljs/basil.js";


// ranges are inclusive of first,
// exclusive of second
var RIGHT_EYE_RANGE = [114, 134];
var LEFT_EYE_RANGE = [134, 154];
var MOUTH_OUTLINE_RANGE = [58, 86];

var _defaults = {
}

// constructor
var HelenFace = function(annotations, opts) {

	if(!annotations) {
		throw new Error('Must init Face with annotations.');
	}

	this.opts = Object.assign(_defaults, (opts||{}));
	this.annotations = annotations;
	this.extents = this._getAnnotationExtents(annotations);
	this.normalized = this._normalizeAnnotations(annotations, this.extents);
	this.centroids = this._calcCentroids(this.normalized);
}

//
// PUBLIC METHODS
// 



//
// PRIVATE METHODS
// 

HelenFace.prototype._getAnnotationExtents = function (annotations) {

	var xExtents = [];
	var yExtents = [];

	var xs = annotations.map(function(d) { return d[0]; });
	var ys = annotations.map(function(d) { return d[1]; });

	xExtents = [b.min(xs), b.max(xs)];
	yExtents = [b.min(ys), b.max(ys)];

	return [xExtents, yExtents];
}


HelenFace.prototype._normalizeAnnotations = function (annotations, extents) {

	return normalized = annotations.map(function(d, i) {
		var x = b.norm(d[0], extents[0][0], extents[0][1]);
		var y = b.norm(d[1], extents[1][0], extents[1][1]);

		return new b.Vector(x, y);
	});
}

HelenFace.prototype._calcCentroids = function (annotations) {

	var mouth_centroid = this._calcCentroid(annotations.slice(MOUTH_OUTLINE_RANGE[0], MOUTH_OUTLINE_RANGE[1]));
	var left_eye_centroid = this._calcCentroid(annotations.slice(LEFT_EYE_RANGE[0], LEFT_EYE_RANGE[1]));
	var right_eye_centroid = this._calcCentroid(annotations.slice(RIGHT_EYE_RANGE[0], RIGHT_EYE_RANGE[1]));

	return {
		mouth: mouth_centroid,
		left_eye: left_eye_centroid,
		right_eye: right_eye_centroid,
		face: this._calcCentroid([mouth_centroid, left_eye_centroid, right_eye_centroid])
	}

}

HelenFace.prototype._calcCentroid = function (points) {
	var len = points.length;

	var avgX = points.reduce(function(a, b) { return a + b.x; }, 0)/len;
	var avgY = points.reduce(function(a, b) { return a + b.y }, 0)/len;

	return new b.Vector(avgX, avgY);
}