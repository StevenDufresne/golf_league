'use strict';

angular.module('core').directive('charts', [
	function($window) {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				var id = '#'+ attrs.id;
				var chartType = attrs.type;
				var dataName = attrs.dataname;

				scope.$watch(dataName, function(newValue, oldValue) {
	    			if (newValue && newValue.length > 0) {
	    				new Chartist[chartType](id, {
						  labels: newValue[1],
						  series: [newValue[0]]
						}, {
							fullWidth: true,
							chartPadding: {
								right: 20,
								left: -10
							}
						})

					}
		        });
			}
		};
	}
]);