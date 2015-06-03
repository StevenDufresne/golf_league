'use strict';

//Golfers service used to communicate Golfers REST endpoints
angular.module('golfers').factory('Golfers', ['$resource',
	function($resource) {
		return $resource('golfers/:golferId', { golferId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);