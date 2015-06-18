(function() {
	'use strict';

	angular
		.module('tDropdown')
	  	.directive('tDropdownContent', tDropdownContent);

	/* @ngInject */
	function tDropdownContent() {
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

			tDropdownController.dropdownContent = element;

		}
	}
})();
