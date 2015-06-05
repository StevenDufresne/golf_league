'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Scores', 'Golfers',
	function($scope, Authentication, Scores, Golfers) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.lockedTab = true;
		$scope.currentGolfer = '';
		$scope.lineData = "";
		$scope.scatterPlotData = "";
		$scope.weekDate = moment().subtract(14, 'days');

		resetTabs();

		$scope.seeGolfer = function (score) {
			$scope.tab = {
		      selectedIndex: 2,
		      secondLocked:  false
		    };	

		    $scope.currentGolfer = score.golfer;

		    buildLineDataSet();
		}

		$scope.resetTabs = function (idx) {
			resetTabs(idx);
		};

		$scope.showAllTime = function (idx) {
			resetTabs(idx);

			if($scope.scatterPlotData == "") {
				buildScatterDataSet();
			}
		};

		$scope.getScores = function () {
			Scores.query(function (res) {		
				$scope.scores = res.sort(function(a,b){
				  return new Date(b.date) - new Date(a.date);
				});
			});
		};

		$scope.buildGolderScores = function () {
			var temp = [],
				avgFront = [],
				avgBack = [];

			angular.forEach($scope.scores, function (value, key) {
				if($scope.currentGolfer == value.golfer) {
					temp.push(value);

					if(value.tags.toLowerCase()  == "front") {
						avgFront.push(value.score);
					}

					if(value.tags.toLowerCase() == "back") {
						avgBack.push(value.score);
					}
				}
			})
	

			$scope.currentScores = temp;
			$scope.avgFront = getAverage(avgFront).toFixed(1);
			$scope.avgBack = getAverage(avgBack).toFixed(1);
			$scope.average = (parseInt($scope.avgFront) + parseInt($scope.avgBack)) / 2
		}

		function getAverage (arr) {
			var sum = 0;

			if(arr.length == 0) return 0;

			for (var i = 0; i < arr.length; i++) {
				var num = parseInt(arr[i])
				sum += num;
			};

			return sum/arr.length;

		}

		function buildLineDataSet() {
			var series = [],
				labels = [];

			angular.forEach($scope.scores, function(value, key) {
				if(value.golfer == $scope.currentGolfer) {
					var d = moment(value.date).format('L').substring(0,5)
					
					labels.push(d);
					series.push(parseInt(value.score));

				}
			})

			$scope.lineData = [series, labels];

		}

		function buildScatterDataSet() {
			var series = [],
				labels = [],
				obj = {};

			angular.forEach($scope.scores, function(value, key) {
				var d = moment(value.date).format('L').substring(0,5)
				if(labels.indexOf(d) < 1) {
					labels.push(d);
				}

				if(obj[value.golfer] !== undefined) {
					obj[value.golfer].series.push(parseInt(value.score));

				} else {
					obj[value.golfer] = {};
					obj[value.golfer].series = [];

					obj[value.golfer].series.push(parseInt(value.score));
				}


			})

			angular.forEach(obj, function (value, key) {
				series.push(value.series);
			})

			$scope.scatterPlotData = [series, labels];

		}

		function resetTabs(idx) {
			$scope.tab = {
		      selectedIndex: idx,
		      secondLocked:  true
		    };
		}
	}
])
.filter('isAfter', function() {
  return function(items, dateAfter) {
    // Using ES6 filter method
    if(items != undefined) {
	    return items.filter(function(item){
	      return moment(item.date).isAfter(dateAfter);
	    })
    }
  }
});