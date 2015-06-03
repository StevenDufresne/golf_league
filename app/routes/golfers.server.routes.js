'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var golfers = require('../../app/controllers/golfers.server.controller');

	// Golfers Routes
	app.route('/golfers')
		.get(golfers.list)
		.post(users.requiresLogin, golfers.create);

	app.route('/golfers/:golferId')
		.get(golfers.read)
		.put(users.requiresLogin, golfers.hasAuthorization, golfers.update)
		.delete(users.requiresLogin, golfers.hasAuthorization, golfers.delete);

	// Finish by binding the Golfer middleware
	app.param('golferId', golfers.golferByID);
};
