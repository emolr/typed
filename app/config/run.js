(function() {
	'use strict';

	/**
	 * @ngdoc overview
	 * @name typed
	 * @description
	 * # typed
	 *
	 * Main module of the application.
	 */
	angular
		.module('typed')
		.run(run);

		function run(Translate, $state, $rootScope, $localStorage) {
			var didRunTranslate = false;

			$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

				if(!didRunTranslate) {


					if(!$localStorage.translate) {
						event.preventDefault();
						Translate.init().then(function() {
							$state.go(toState.name, toParams);
						});
					} else {
						event.preventDefault();
						Translate.init().then(function() {
							$state.go(toState.name, toParams);
						});
					}

					didRunTranslate = true;
				}
			});
		}
})();
