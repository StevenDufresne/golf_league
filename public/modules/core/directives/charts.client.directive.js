'use strict';

angular.module('core').directive('charts', [
	function($window) {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				scope.$watch('lineData', function(newValue, oldValue) {
	    			if (newValue && newValue.length > 0) {
						var chart = new Chartist.Line('.ct-chart', {
						  labels: newValue[1],
						  series: [newValue[0]]
						}, {
							fullWidth: true,
							chartPadding: {
								right: 20,
								left: -10
							}
						});
					}
		        });
			}
		};
	}
]);