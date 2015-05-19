(function() {
	'use strict';

	angular
		.module('tMediumEditor')
	  	.directive('tMediumEditor', tMediumEditor);

	/* @ngInject */
	function tMediumEditor(MediumEditor) {
		var directive = {
            require: 'ngModel',
			link: link,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs){
			console.log(MediumEditor);
		};
	};
})();
