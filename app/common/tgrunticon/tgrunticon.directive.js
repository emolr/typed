(function() {
	'use strict';

	angular
		.module('tgrunticon')
	  	.directive('tGrunticon', tGrunticon);

	/* @ngInject */
	function tGrunticon() {
		var directive = {
			link: link,
			restrict: 'A'
		};

		return directive;

		function link(scope, element, attrs){
			if(window.grunticon) {
				window.grunticon.embedSVG();
			}
		}
	}
})();
