(function() {
	'use strict';

	angular
		.module('tDropdown')
	  	.directive('tDropdown', tDropdown);

	/* @ngInject */
	function tDropdown() {
		var directive = {
			controller: 'tDropdownController',
			link: link,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs, tDropdownController){
			tDropdownController.activate(element);
		}
	}
})();
