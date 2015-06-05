'use strict';

angular.module('core').directive('scatter', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				scope.$watch('scatterPlotData', function(newValue, oldValue) {

	    			if (newValue && newValue.length > 0) {

						new Chartist.Line('.ct-scatter', {
						  labels: newValue[1],
						  series: [newValue[0]]
						}, {
							fullWidth: true,
							chartPadding: {
								right: 50
							},
							showLine: false
						});
					}
		        });
			}
		};
	}
]);