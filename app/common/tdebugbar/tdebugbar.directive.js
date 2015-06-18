(function() {
	'use strict';

	angular
		.module('tdebugbar')
	  	.directive('tDebugbar', tDebugbar);

	/* @ngInject */
	function tDebugbar($state) {
		var directive = {
            
			templateUrl: 'common/tdebugbar/tdebugbar.template.html',
            
			link: link,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs){

			scope.isAtSandbox = false;

			scope.goToSandbox = function() {
				$state.go('application.sandbox').then(function() {
					scope.isAtSandbox = true;
				}, function() {
					scope.isAtSandbox = false;
				});
			};

			scope.goToRoot = function(path) {
				$state.go(path).then(function() {
					scope.isAtSandbox = false;
				}, function() {
					scope.isAtSandbox = true;
				});
			};

		}
	}
})();
