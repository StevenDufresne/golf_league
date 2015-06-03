'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Score = mongoose.model('Score'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, score;

/**
 * Score routes tests
 */
describe('Score CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Score
		user.save(function() {
			score = {
				name: 'Score Name'
			};

			done();
		});
	});

	it('should be able to save Score instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Score
				agent.post('/scores')
					.send(score)
					.expect(200)
					.end(function(scoreSaveErr, scoreSaveRes) {
						// Handle Score save error
						if (scoreSaveErr) done(scoreSaveErr);

						// Get a list of Scores
						agent.get('/scores')
							.end(function(scoresGetErr, scoresGetRes) {
								// Handle Score save error
								if (scoresGetErr) done(scoresGetErr);

								// Get Scores list
								var scores = scoresGetRes.body;

								// Set assertions
								(scores[0].user._id).should.equal(userId);
								(scores[0].name).should.match('Score Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Score instance if not logged in', function(done) {
		agent.post('/scores')
			.send(score)
			.expect(401)
			.end(function(scoreSaveErr, scoreSaveRes) {
				// Call the assertion callback
				done(scoreSaveErr);
			});
	});

	it('should not be able to save Score instance if no name is provided', function(done) {
		// Invalidate name field
		score.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Score
				agent.post('/scores')
					.send(score)
					.expect(400)
					.end(function(scoreSaveErr, scoreSaveRes) {
						// Set message assertion
						(scoreSaveRes.body.message).should.match('Please fill Score name');
						
						// Handle Score save error
						done(scoreSaveErr);
					});
			});
	});

	it('should be able to update Score instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Score
				agent.post('/scores')
					.send(score)
					.expect(200)
					.end(function(scoreSaveErr, scoreSaveRes) {
						// Handle Score save error
						if (scoreSaveErr) done(scoreSaveErr);

						// Update Score name
						score.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Score
						agent.put('/scores/' + scoreSaveRes.body._id)
							.send(score)
							.expect(200)
							.end(function(scoreUpdateErr, scoreUpdateRes) {
								// Handle Score update error
								if (scoreUpdateErr) done(scoreUpdateErr);

								// Set assertions
								(scoreUpdateRes.body._id).should.equal(scoreSaveRes.body._id);
								(scoreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Scores if not signed in', function(done) {
		// Create new Score model instance
		var scoreObj = new Score(score);

		// Save the Score
		scoreObj.save(function() {
			// Request Scores
			request(app).get('/scores')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Score if not signed in', function(done) {
		// Create new Score model instance
		var scoreObj = new Score(score);

		// Save the Score
		scoreObj.save(function() {
			request(app).get('/scores/' + scoreObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', score.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Score instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Score
				agent.post('/scores')
					.send(score)
					.expect(200)
					.end(function(scoreSaveErr, scoreSaveRes) {
						// Handle Score save error
						if (scoreSaveErr) done(scoreSaveErr);

						// Delete existing Score
						agent.delete('/scores/' + scoreSaveRes.body._id)
							.send(score)
							.expect(200)
							.end(function(scoreDeleteErr, scoreDeleteRes) {
								// Handle Score error error
								if (scoreDeleteErr) done(scoreDeleteErr);

								// Set assertions
								(scoreDeleteRes.body._id).should.equal(scoreSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Score instance if not signed in', function(done) {
		// Set Score user 
		score.user = user;

		// Create new Score model instance
		var scoreObj = new Score(score);

		// Save the Score
		scoreObj.save(function() {
			// Try deleting Score
			request(app).delete('/scores/' + scoreObj._id)
			.expect(401)
			.end(function(scoreDeleteErr, scoreDeleteRes) {
				// Set message assertion
				(scoreDeleteRes.body.message).should.match('User is not logged in');

				// Handle Score error error
				done(scoreDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Score.remove().exec();
		done();
	});
});