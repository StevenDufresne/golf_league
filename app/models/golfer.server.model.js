'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Golfer Schema
 */
var GolferSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Golfer name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	description: {

	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Golfer', GolferSchema);