'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stats = require('../../app/controllers/stats.server.controller');

	// Stats Routes
	app.route('/sd')
		.get(stats.standardDeviation);

	app.route('/averages')
		.get(stats.averages);

	app.route('/improved')
		.get(stats.improved);

	app.route('/lowHigh')
		.get(stats.lowHigh);



};
