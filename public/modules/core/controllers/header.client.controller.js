'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', 'Authentication', 'Menus', '$mdSidenav',
	function($scope, $location, Authentication, Menus, $mdSidenav) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('sidemenu');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.toggleNav = function (name) {
			$mdSidenav(name).toggle();
		}

		$scope.visitLink= function (link) {
			$mdSidenav('left').close();
			$location.path(link);
		}

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);