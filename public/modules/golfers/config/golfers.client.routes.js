'use strict';

//Setting up route
angular.module('golfers').config(['$stateProvider',
	function($stateProvider) {
		// Golfers state routing
		$stateProvider.
		state('listGolfers', {
			url: '/golfers',
			templateUrl: 'modules/golfers/views/list-golfers.client.view.html'
		}).
		state('createGolfer', {
			url: '/golfers/create',
			templateUrl: 'modules/golfers/views/create-golfer.client.view.html'
		}).
		state('viewGolfer', {
			url: '/golfers/:golferId',
			templateUrl: 'modules/golfers/views/view-golfer.client.view.html'
		}).
		state('editGolfer', {
			url: '/golfers/:golferId/edit',
			templateUrl: 'modules/golfers/views/edit-golfer.client.view.html'
		});
	}
]);