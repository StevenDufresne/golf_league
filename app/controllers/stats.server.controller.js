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
			
			obj = groupByNest(scores, 'golfer', 'name', 'score');

			//Get standard deviation
			for (var key in obj) {
			   if (obj.hasOwnProperty(key)) {
			       var scores = obj[key].score;

			        returnObj.push({
			        	'golfer': obj[key].golfer,
			        	'name': key,
			        	'deviation': ss.standard_deviation(scores).toFixed(1)
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
			        	'mean': ss.mean(scores).toFixed(1)
			        });
			    }
			}

			if(returnObj[0] !== undefined && returnObj[1] !== undefined) {
				//Inject average for both

				returnObj.unshift({
					'holes': '',
					'mean': ss.mean([parseInt(returnObj[0].mean), parseInt(returnObj[1].mean)]).toFixed(1)

				})

			}

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

				if(moment().diff(scores[i].date, 'days') < 7) {
					lstWeeks.push(scores[i]);
				}
			}



			obj = groupByNest(scores, 'golfer','name','score');



			//Get standard deviation
			for (var key in obj) {
			   if (obj.hasOwnProperty(key)) {
			       var scores = obj[key].score,
			       golferMean = ss.mean(obj[key].score);

			       

			       for(var i = 0; i < lstWeeks.length; i++ ) {
				       	if(lstWeeks[i].golfer.name == key) {
				       		var Increase = lstWeeks[i].score - golferMean;
							var improvement = -(Increase / golferMean) * 100;

				       		returnObj.push({
				       			'golfer': obj[key].golfer,
			       				'improvement': parseInt(improvement.toFixed(1)),
			       				'score': lstWeeks[i].score
			        		});
				       	}
			       	}


			    }
			}

			returnObj.sort(ImprovedSort).reverse();
			res.jsonp(returnObj);
		}
	});

};


exports.lowHigh	 = function(req, res) {
	var obj = {},
	returnObj = [],
	filter = (req.query.golfer == undefined) ? "" : req.query.golfer,
	query = {};

	//Do they want it for a specific golfer?
	if(filter !== "") {
		query = Score.find().where('golfer.name').equals(filter);
	} else {
		query = Score.find();
	}

	query.exec(function(err, scores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//group scores

			scores.sort(HighLowSort);

			if(Object.keys(scores).length > 1) {
				returnObj.push({
					'prop': 'low',
					'score': scores[0]
				},
				{
					'prop': 'high',
					'score': scores[scores.length - 1]
				});

			}
			
			res.jsonp(returnObj);
		}
	});

};

function groupByNest(arr, key1, key2 , prop) {
	var obj = {};

	for(var i = 0; i < arr.length; i++) {
		if(obj[arr[i][key1][key2]] !== undefined ) {
			obj[arr[i][key1][key2]][prop].push(parseInt(arr[i][prop]));

		} else {
			obj[arr[i][key1][key2]] = {};

			obj[arr[i][key1][key2]][prop] = [];
			obj[arr[i][key1][key2]][prop].push(parseInt(arr[i][prop]));
		}

		obj[arr[i][key1][key2]][key1] = arr[i][key1];
	}
	return obj;

}

function HighLowSort(a,b) {
  if (a.score < b.score)
    return -1;
  if (a.score > b.score)
    return 1;
  return 0;
}

function ImprovedSort(a,b) {
  if (a.improvement < b.improvement)
    return -1;
  if (a.improvement > b.improvement)
    return 1;
  return 0;
}

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






