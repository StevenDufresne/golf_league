'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Golfer = mongoose.model('Golfer'),
	_ = require('lodash');

/**
 * Create a Golfer
 */
exports.create = function(req, res) {
	var golfer = new Golfer(req.body);
	golfer.user = req.user;

	golfer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(golfer);
		}
	});
};

/**
 * Show the current Golfer
 */
exports.read = function(req, res) {
	res.jsonp(req.golfer);
};

/**
 * Update a Golfer
 */
exports.update = function(req, res) {
	var golfer = req.golfer ;

	golfer = _.extend(golfer , req.body);

	golfer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(golfer);
		}
	});
};

/**
 * Delete an Golfer
 */
exports.delete = function(req, res) {
	var golfer = req.golfer ;

	golfer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(golfer);
		}
	});
};

/**
 * List of Golfers
 */
exports.list = function(req, res) { 
	Golfer.find().sort('-created').populate('user', 'displayName').exec(function(err, golfers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(golfers);
		}
	});
};

/**
 * Golfer middleware
 */
exports.golferByID = function(req, res, next, id) { 
	Golfer.findById(id).populate('user', 'displayName').exec(function(err, golfer) {
		if (err) return next(err);
		if (! golfer) return next(new Error('Failed to load Golfer ' + id));
		req.golfer = golfer ;
		next();
	});
};

/**
 * Golfer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.golfer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
