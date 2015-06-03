'use strict';

angular.module('core').directive('charts', [
	function($window) {
		return {
			template: '<div id="downloads"></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				scope.$watch('data', function(newValue, oldValue) {

	                if (newValue && newValue.length > 0) {


						MG.data_graphic({
						    data: newValue,
						    width: window.innerWidth - 20,
						    target: '#downloads',
						    show_secondary_x_label: false,
						    show_secondary_y_label: false,
						    x_accessor: 'date',
						    y_accessor: 'value',
						})
	                }
	            });
			}
		};
	}
]);