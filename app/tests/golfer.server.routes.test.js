'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Golfer = mongoose.model('Golfer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, golfer;

/**
 * Golfer routes tests
 */
describe('Golfer CRUD tests', function() {
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

		// Save a user to the test db and create new Golfer
		user.save(function() {
			golfer = {
				name: 'Golfer Name'
			};

			done();
		});
	});

	it('should be able to save Golfer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Golfer
				agent.post('/golfers')
					.send(golfer)
					.expect(200)
					.end(function(golferSaveErr, golferSaveRes) {
						// Handle Golfer save error
						if (golferSaveErr) done(golferSaveErr);

						// Get a list of Golfers
						agent.get('/golfers')
							.end(function(golfersGetErr, golfersGetRes) {
								// Handle Golfer save error
								if (golfersGetErr) done(golfersGetErr);

								// Get Golfers list
								var golfers = golfersGetRes.body;

								// Set assertions
								(golfers[0].user._id).should.equal(userId);
								(golfers[0].name).should.match('Golfer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Golfer instance if not logged in', function(done) {
		agent.post('/golfers')
			.send(golfer)
			.expect(401)
			.end(function(golferSaveErr, golferSaveRes) {
				// Call the assertion callback
				done(golferSaveErr);
			});
	});

	it('should not be able to save Golfer instance if no name is provided', function(done) {
		// Invalidate name field
		golfer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Golfer
				agent.post('/golfers')
					.send(golfer)
					.expect(400)
					.end(function(golferSaveErr, golferSaveRes) {
						// Set message assertion
						(golferSaveRes.body.message).should.match('Please fill Golfer name');
						
						// Handle Golfer save error
						done(golferSaveErr);
					});
			});
	});

	it('should be able to update Golfer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Golfer
				agent.post('/golfers')
					.send(golfer)
					.expect(200)
					.end(function(golferSaveErr, golferSaveRes) {
						// Handle Golfer save error
						if (golferSaveErr) done(golferSaveErr);

						// Update Golfer name
						golfer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Golfer
						agent.put('/golfers/' + golferSaveRes.body._id)
							.send(golfer)
							.expect(200)
							.end(function(golferUpdateErr, golferUpdateRes) {
								// Handle Golfer update error
								if (golferUpdateErr) done(golferUpdateErr);

								// Set assertions
								(golferUpdateRes.body._id).should.equal(golferSaveRes.body._id);
								(golferUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Golfers if not signed in', function(done) {
		// Create new Golfer model instance
		var golferObj = new Golfer(golfer);

		// Save the Golfer
		golferObj.save(function() {
			// Request Golfers
			request(app).get('/golfers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Golfer if not signed in', function(done) {
		// Create new Golfer model instance
		var golferObj = new Golfer(golfer);

		// Save the Golfer
		golferObj.save(function() {
			request(app).get('/golfers/' + golferObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', golfer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Golfer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Golfer
				agent.post('/golfers')
					.send(golfer)
					.expect(200)
					.end(function(golferSaveErr, golferSaveRes) {
						// Handle Golfer save error
						if (golferSaveErr) done(golferSaveErr);

						// Delete existing Golfer
						agent.delete('/golfers/' + golferSaveRes.body._id)
							.send(golfer)
							.expect(200)
							.end(function(golferDeleteErr, golferDeleteRes) {
								// Handle Golfer error error
								if (golferDeleteErr) done(golferDeleteErr);

								// Set assertions
								(golferDeleteRes.body._id).should.equal(golferSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Golfer instance if not signed in', function(done) {
		// Set Golfer user 
		golfer.user = user;

		// Create new Golfer model instance
		var golferObj = new Golfer(golfer);

		// Save the Golfer
		golferObj.save(function() {
			// Try deleting Golfer
			request(app).delete('/golfers/' + golferObj._id)
			.expect(401)
			.end(function(golferDeleteErr, golferDeleteRes) {
				// Set message assertion
				(golferDeleteRes.body.message).should.match('User is not logged in');

				// Handle Golfer error error
				done(golferDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Golfer.remove().exec();
		done();
	});
});