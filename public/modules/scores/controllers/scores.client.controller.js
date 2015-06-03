'use strict';

// Scores controller
angular.module('scores').controller('ScoresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Scores', 'Golfers',
	function($scope, $stateParams, $location, Authentication, Scores, Golfers) {
		$scope.authentication = Authentication;

		// Create new Score
		$scope.create = function() {
			// Create new Score object
			var score = new Scores ({
				golfer: this.golfer,
				score: this.score,
				date: this.submissionDate,
				tags: this.tags
			});

			// Redirect after save
			score.$save(function(response) {
				$scope.find();
				$scope.golfer = '';
				$scope.score = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Score
		$scope.remove = function(score) {
			if ( score ) { 
				score.$remove();

				for (var i in $scope.scores) {
					if ($scope.scores [i] === score) {
						$scope.scores.splice(i, 1);
					}
				}
			} else {
				$scope.score.$remove(function() {
					$location.path('scores');
				});
			}
		};

		// Update existing Score
		$scope.update = function() {
			var score = $scope.score;

			score.$update(function() {
				$location.path('scores/' + score._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Scores
		$scope.find = function() {
			$scope.scores = Scores.query();
		};

				// Find a list of Scores
		$scope.getGolfers = function() {
			Golfers.query(function(res){
				$scope.golfers = res;
			});
		};

		// Find existing Score
		$scope.findOne = function() {
			$scope.score = Scores.get({ 
				scoreId: $stateParams.scoreId
			});
		};


		$scope.getGolfers();
	}
]);