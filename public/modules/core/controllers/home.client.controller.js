'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Scores', 'Golfers',
	function($scope, Authentication, Scores, Golfers) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.lockedTab = true;
		$scope.currentGolfer = '';

		resetTabs();


		$scope.seeGolfer = function (score) {
			$scope.tab = {
		      selectedIndex: 1,
		      secondLocked:  false
		    };	

		    $scope.currentGolfer = score.golfer;

		    buildDataSet();
		}

		$scope.resetTabs = function () {
			resetTabs();
		}


		$scope.getScores = function () {
			$scope.scores = Scores.query();
		}

		function buildDataSet() {
			var dataSet = [];

			angular.forEach($scope.scores, function(value, key) {
				if(value.golfer == $scope.currentGolfer) {

					dataSet.push({
						'date': new Date(value.date),
						'value': value.score
					})
				}
			})

			$scope.data = dataSet;

		}

		function resetTabs() {
			$scope.tab = {
		      selectedIndex: 0,
		      secondLocked:  true
		    };
		}
	}
]);