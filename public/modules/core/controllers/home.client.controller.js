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
	
		   	Golfers.query(function(res) {
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

			$http.get('/lowHigh?week=true').
			  success(function(data, status, headers, config) {
			  	$scope.weekStats.lowHigh = data;
			  });

			 //Load up the missings	
			 getMissing(weekScores, $scope.weekStats, 'missing');


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

			$http.get('/playerAverages').
			  success(function(data, status, headers, config) {
			  	var series = [],
				labels = [];

				angular.forEach(data, function(value, key) {
					labels.push(value.golfer);
					series.push(parseInt(value.mean));

				})

				$scope.yearStats.playerAverages = [series, labels];
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


		function getMissing(scores, arr, prop) {
			var missing = [];
		  	Golfers.query(function(golfers) {
 
		  		for(var i = 0; i < golfers.length; i++) {
		  			var exist = false;

		  			for(var k = 0; k <scores.length; k++) {
		  				if(golfers[i].name == scores[k].golfer.name) {
		  					exist = true;
		  					break;
		  				}
		  			}

		  			if(!exist) {
		  				missing.push(golfers[i]);
		  			}

		  		}

		  		arr[prop] = missing;

		    })


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
