'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication', 'Scores', 'Golfers',
	function($scope, $http,	 Authentication, Scores, Golfers) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.lockedTab = true;
		$scope.currentGolfer = '';
		$scope.golferData = "";
		$scope.weekData = "";
		$scope.yearData = "";
		$scope.weekStats = {};
		$scope.yearStats = {};
		$scope.golferStats = {};

		resetTabs();

		$scope.seeGolfer = function (golfer) {
			$scope.tab = {
		      selectedIndex: 2,
		      secondLocked:  false
		    };	

		    $scope.golferStats.currentGolfer = golfer;
	
		    Golfers.query(function (res) {
		    	angular.forEach(res,function (value, key) {
		    		if(golfer == value.name) {
		    			$scope.golferStats.currentGolfer = value
		    		}
		    	})
		    })

		    buildGolferDataSet();
		}

		$scope.resetTabs = function (idx) {
			resetTabs(idx);
		};

		$scope.showAllTime = function (idx) {
			resetTabs(idx);

			if($scope.yearData == "") {
				buildYearDataSet();
			}
		};

		$scope.getScores = function () {
			Scores.query(function (res) {		
				$scope.scores = res.sort(function(a,b){
				  return new Date(b.date) - new Date(a.date);
				});

				buildWeekDataSet();
			});
		};

		$scope.buildGolferScores = function () {
			var temp = [],
				avgFront = [],
				avgBack = [];

			angular.forEach($scope.scores, function (value, key) {
				if($scope.golferStats.currentGolfer == value.golfer.name) {
					temp.push(value);

					if(value.tags.toLowerCase()  == "front") {
						avgFront.push(value.score);
					}

					if(value.tags.toLowerCase() == "back") {
						avgBack.push(value.score);
					}
				}
			})
	
			$scope.golferStats.currentScores = temp;
			$scope.golferStats.avgFront = getAverage(avgFront).toFixed(1);
			$scope.golferStats.avgBack = getAverage(avgBack).toFixed(1);
			$scope.golferStats.average = (parseInt($scope.golferStats.avgFront) + parseInt($scope.golferStats.avgBack)) / 2
		}


		function buildWeekDataSet() {
			var series = [],
				labels = [],
				weekScores = [];

			angular.forEach($scope.scores, function(value, key) {
				if(moment().diff(value.date, 'days') < 7) {		
					labels.push(value.golfer);
					series.push(parseInt(value.score));

					weekScores.push(value)
				}
			})

			$scope.weekStats.weekScores = weekScores;
			$scope.weekStats.weekData = [series, labels];

			$http.get('/improved').
			  success(function(data, status, headers, config) {
			  	$scope.weekStats.improved = data;
			  });

		}

		function buildYearDataSet() {
			var series = [],
				labels = [],
				obj = {},
				avgObj = []

			$http.get('/sd').
			  success(function(data, status, headers, config) {
			  	$scope.yearStats.consistent = data;
			  });

			 $http.get('/averages').
			  success(function(data, status, headers, config) {
			  	$scope.yearStats.averages = data;
			  });

			$http.get('/lowHigh').
			  success(function(data, status, headers, config) {
			  	$scope.yearStats.stats = data;
			  });
		}


		function buildGolferDataSet() {
			var series = [],
				labels = [];

			angular.forEach($scope.scores, function(value, key) {
				if(value.golfer.name == $scope.golferStats.currentGolfer) {
					var d = moment(value.date).format('L').substring(0,5)
		
					labels.push(d);
					series.push(parseInt(value.score));

				}
			})

			//re order, they are the wrong direction for the chart
			series.reverse();
			labels.reverse();

			$scope.golferStats.golferData = [series, labels];

			$http.get('/lowHigh?golfer=' + $scope.golferStats.currentGolfer).
			  success(function(data, status, headers, config) {
			  	$scope.golferStats.stats = data;
			  });
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