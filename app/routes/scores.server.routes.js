'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var scores = require('../../app/controllers/scores.server.controller');

	// Scores Routes
	app.route('/scores')
		.get(scores.list)
		.post(users.requiresLogin, scores.create);

	app.route('/scores/:scoreId')
		.get(scores.read)
		.put(users.requiresLogin, scores.hasAuthorization, scores.update)
		.delete(users.requiresLogin, scores.hasAuthorization, scores.delete);

	// Finish by binding the Score middleware
	app.param('scoreId', scores.scoreByID);
};
