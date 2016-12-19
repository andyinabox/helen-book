#includepath "../node_modules/";
#include "basiljs/basil.js";

// ranges are inclusive of first,
// exclusive of second
var RIGHT_EYE_RANGE = [114, 134];
var LEFT_EYE_RANGE = [134, 154];
var MOUTH_OUTLINE_RANGE = [58, 86];


var _defaults = {
	from_db: false
}

var data_defaults = {
	centroid: null,
	right_eye_centroid: null,
	left_eye_centroid: null,
	mouth_centroid: null,
	annotations: null,
	normalized_annotatons: null,
	image_width: null,
	image_height: null,
}

// constructor
Object.prototype.Face = function(data, opts) {

	if(!data.annotations || !data.image_width || !data.image_height) {
		throw new Error('Must init Face with `annotations`, `image_height`, and `image_width`.');
	}

	data = _.defaults(data_defaults, data);

	this._data = opts.from_db ? this._initFromDb(data) : this._init(data);

}

//
// PUBLIC METHODS
// 



//
// PRIVATE METHODS
// 


Object.prototype._init(data) {

	this._annotations = data.annotations;

	if(data.normalized_annotatons) {
		this._norm = data.normalized_annotatons;
	} else {
		_normalizeAnnotations();
	}

	if(
		data.centroid
		&& data.left_eye_centroid
		&& data.right_eye_centroid
		&& data.mouth_centroid
	) {
		this_centroid = data.centroid;
	}

}

Object.prototype._initFromDb(data) {

}

Object.prototype._normalizeAnnotations() {
	var w = this._image_width;
	var h = this._image_height;

	this._norm = this._annotations.map(function(d, i) {
		var x = d[0] / this._image_width;
		var y = d[1] / this._image_height;

		return new b.Vector(x, y);
	});
}

Object.prototype._calcCentroids() {

	if(!this._norm) {
		this._normalizeAnnotations();
	}

	this._calcMouthCentroid();
	this._calcEyeCentroids();

}

Object.prototype._calcMouthCentroid() {
	var points;

	if(!this._norm) {
		this._normalizeAnnotations();
	}

	// right eye
	points = this._norm.slice(MOUTH_OUTLINE_RANGE[0], MOUTH_OUTLINE_RANGE[1]);
	this._mouth_centroid = this._calcCentroid(points);

}

Object.prototype._calcEyeCentroids() {
	var left_eye_points;
	var right_eye_points;

	if(!this._norm) {
		this._normalizeAnnotations();
	}

	// left eye
	left_eye_points = this._norm.slice(LEFT_EYE_RANGE[0], LEFT_EYE_RANGE[1]);
	this._left_eye_centroid = this._calcCentroid(left_eye_points);

	// right eye
	right_eye_points = this._norm.slice(RIGHT_EYE_RANGE[0], RIGHT_EYE_RANGE[1]);
	this._right_eye_centroid = this._calcCentroid(left_eye_points);
}


Object.prototype._calcCentroid(points) {
	var len = points.length,
	var avgX, avgY;

	avgX = points.reduce(function(a, b) { return a + b.x; }, 0)/len;
	avgY = points.reduce(function(a, b) { return a + b.y }, 0)/len;

	return new b.Vector(avgX, avgY);
}