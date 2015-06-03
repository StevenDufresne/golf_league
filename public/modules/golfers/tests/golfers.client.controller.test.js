'use strict';

(function() {
	// Golfers Controller Spec
	describe('Golfers Controller Tests', function() {
		// Initialize global variables
		var GolfersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Golfers controller.
			GolfersController = $controller('GolfersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Golfer object fetched from XHR', inject(function(Golfers) {
			// Create sample Golfer using the Golfers service
			var sampleGolfer = new Golfers({
				name: 'New Golfer'
			});

			// Create a sample Golfers array that includes the new Golfer
			var sampleGolfers = [sampleGolfer];

			// Set GET response
			$httpBackend.expectGET('golfers').respond(sampleGolfers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.golfers).toEqualData(sampleGolfers);
		}));

		it('$scope.findOne() should create an array with one Golfer object fetched from XHR using a golferId URL parameter', inject(function(Golfers) {
			// Define a sample Golfer object
			var sampleGolfer = new Golfers({
				name: 'New Golfer'
			});

			// Set the URL parameter
			$stateParams.golferId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/golfers\/([0-9a-fA-F]{24})$/).respond(sampleGolfer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.golfer).toEqualData(sampleGolfer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Golfers) {
			// Create a sample Golfer object
			var sampleGolferPostData = new Golfers({
				name: 'New Golfer'
			});

			// Create a sample Golfer response
			var sampleGolferResponse = new Golfers({
				_id: '525cf20451979dea2c000001',
				name: 'New Golfer'
			});

			// Fixture mock form input values
			scope.name = 'New Golfer';

			// Set POST response
			$httpBackend.expectPOST('golfers', sampleGolferPostData).respond(sampleGolferResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Golfer was created
			expect($location.path()).toBe('/golfers/' + sampleGolferResponse._id);
		}));

		it('$scope.update() should update a valid Golfer', inject(function(Golfers) {
			// Define a sample Golfer put data
			var sampleGolferPutData = new Golfers({
				_id: '525cf20451979dea2c000001',
				name: 'New Golfer'
			});

			// Mock Golfer in scope
			scope.golfer = sampleGolferPutData;

			// Set PUT response
			$httpBackend.expectPUT(/golfers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/golfers/' + sampleGolferPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid golferId and remove the Golfer from the scope', inject(function(Golfers) {
			// Create new Golfer object
			var sampleGolfer = new Golfers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Golfers array and include the Golfer
			scope.golfers = [sampleGolfer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/golfers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGolfer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.golfers.length).toBe(0);
		}));
	});
}());