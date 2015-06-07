'use strict';

// Golfers controller
angular.module('golfers').controller('GolfersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Golfers',
	function($scope, $stateParams, $location, Authentication, Golfers) {
		$scope.authentication = Authentication;

		// Create new Golfer
		$scope.create = function() {
			// Create new Golfer object
			var golfer = new Golfers ({
				name: this.name,
				description: this.desc,
				imageUrl: this.imageUrl
			});

			// Redirect after save
			golfer.$save(function(response) {
				$scope.name = '';
				$scope.desc = '';	
				$scope.imageUrl ='';
				$scope.find();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Golfer
		$scope.remove = function(golfer) {
			if ( golfer ) { 
				golfer.$remove();

				for (var i in $scope.golfers) {
					if ($scope.golfers [i] === golfer) {
						$scope.golfers.splice(i, 1);
					}
				}
			} else {
				$scope.golfer.$remove(function() {
					$location.path('golfers/create');
				});
			}
		};

		// Update existing Golfer
		$scope.update = function() {
			var golfer = $scope.golfer;

			golfer.$update(function() {
				$location.path('golfers/create');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Golfers
		$scope.find = function() {
			$scope.golfers = Golfers.query();
		};

		// Find existing Golfer
		$scope.findOne = function() {
			$scope.golfer = Golfers.get({ 
				golferId: $stateParams.golferId
			});
		};
	}
]);