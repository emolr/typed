(function() {
	'use strict';

	angular
		.module('tdebounce')
	  	.directive('tDebounce', tDebounce);

	/* @ngInject */
	function tDebounce($window) {
		var directive = {

			link: link,
			restrict: 'A',
			scope: {
				tDebounce: '&',
				tDebounceDelay: '='
			}
		};

		return directive;

		function link(scope, element, attrs){
			var initial;

			element.bind('keydown', function() {
				clearTimeout(initial);
				startTimeout();
			});

			function startTimeout() {
				initial = $window.setTimeout(function() {
					scope.tDebounce();
				}, scope.tDebounceDelay);
			}
		};
	};
})();
