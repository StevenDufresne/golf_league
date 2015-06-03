'use strict';

// Configuring the Articles module
angular.module('scores').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidemenu', 'Scores', 'scores', 'dropdown', '/scores(/create)?');
		Menus.addSubMenuItem('sidemenu', 'scores', 'List Scores', 'scores');
		Menus.addSubMenuItem('sidemenu', 'scores', 'New Score', 'scores/create');
	}
]);