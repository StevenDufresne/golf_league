'use strict';

angular.module('core').directive('scatter', [
	function($window) {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				var type = 

				scope.$watch('scatterPlotData', function(newValue, oldValue) {
					if (newValue && newValue.length > 0) {
						var chart2 = new Chartist.Line('.ct-scatter', {
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