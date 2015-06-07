'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Score Schema
 */
var ScoreSchema = new Schema({
	golfer: {},
	tags: {
		type: String
	},
	score: {
		type: String,
		default: '',
		required: 'Please fill Score',
		trim: true
	},
	date :{
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Score', ScoreSchema);