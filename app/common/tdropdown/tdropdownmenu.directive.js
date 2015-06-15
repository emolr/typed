(function() {
	'use strict';

	angular
		.module('tDropdown')
	  	.directive('tDropdownMenu', tDropdownMenu);

	/* @ngInject */
	function tDropdownMenu() {
		var directive = {
			require: '?^tDropdown',
			link: link,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs, tDropdownController){
			// Failsafe - if we don't have a controller, that means the wrapper directive isnt present
			if(!tDropdownController) {
				return;
			}

			tDropdownController.dropdownMenu = element;

		}
	}
})();
