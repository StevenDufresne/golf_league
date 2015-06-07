'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Score = mongoose.model('Score'),
	_ = require('lodash'),
	moment = require('moment'),
	ss = require('simple-statistics');



exports.standardDeviation = function(req, res) {
	var obj = {},
	returnObj = [];

	Score.find().exec(function(err, scores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//group scores
			
			obj = groupBy(scores, 'golfer', 'score');

			//Get standard deviation
			for (var key in obj) {
			   if (obj.hasOwnProperty(key)) {
			       var scores = obj[key].score;

			        returnObj.push({
			        	'name': key,
			        	'deviation': ss.standard_deviation(scores)
			        });
			    }
			}
			res.jsonp(returnObj);
		}
	});

};




exports.averages = function(req, res) {
	var obj = {},
	returnObj = [];

	Score.find().exec(function(err, scores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//group scores
				
			obj = groupBy(scores, 'tags', 'score');

			//Get standard deviation
			for (var key in obj) {
			   if (obj.hasOwnProperty(key)) {
			       var scores = obj[key].score;

			        returnObj.push({
			        	'holes': key,
			        	'mean': ss.mean(scores)
			        });
			    }
			}

			//Inject average for both
			returnObj.unshift({
				'holes': '',
				'mean': ss.mean([returnObj[0].mean, returnObj[1].mean])

			})

			res.jsonp(returnObj);
		}
	});

};

exports.improved = function(req, res) {
	var obj = {},
	lstWeeks = [],
	returnObj = [];

	Score.find().exec(function(err, scores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//group scores

			for(var i = 0; i < scores.length; i++ ) {

				console.log(moment().diff(scores[i].date, 'days') );

				if(moment().diff(scores[i].date, 'days') < 7) {
					lstWeeks.push(scores[i]);
				}
			}
			obj = groupBy(scores, 'golfer', 'score');

			//Get standard deviation
			for (var key in obj) {
			   if (obj.hasOwnProperty(key)) {
			       var scores = obj[key].score,
			       golferMean = ss.mean(obj[key].score);

			       for(var i = 0; i < lstWeeks.length; i++ ) {
				       	if(lstWeeks[i].golfer == key) {
				       		var Increase = lstWeeks[i].score - golferMean;
							var improvement = -(Increase / golferMean) * 100;
	
				       		returnObj.push({
			        			'name': key,
			       				'improvement': improvement.toFixed(2),
			       				'score': lstWeeks[i].score
			        		});
				       	}
			       	}


			    }
			}
			res.jsonp(returnObj);
		}
	});

};


function groupBy(arr, key, prop) {
	var obj = {};

	for(var i = 0; i < arr.length; i++) {
		if(obj[arr[i][key]] !== undefined ) {
			obj[arr[i][key]][prop].push(parseInt(arr[i][prop]));

		} else {
			obj[arr[i][key]] = {};
			obj[arr[i][key]][prop] = [];
			obj[arr[i][key]][prop].push(parseInt(arr[i][prop]));
		}
	}
	return obj;

}






