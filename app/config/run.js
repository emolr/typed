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

		function run($rootScope, $state, DS, DSLocalForageAdapter, nLogger, $stateParams) {
			DS.registerAdapter('localforage', DSLocalForageAdapter, {default: true});

			$rootScope.currentDocument = undefined;
			$rootScope.$on('$stateChangeStart', function(e, toState, toParams) {
				if(toParams.id) {
					$rootScope.currentDocument = toParams.id;
				} else {
					$rootScope.currentDocument = undefined;
				}
			});

			/*
				Debug help: Log route changes - disable by setting debugRouting to false
			 */
			var debugRouting = false;

			$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
				if(debugRouting) {
					nLogger.info('$stateChangeStart', toState);
				}
			});
			$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
				if(debugRouting) {
					nLogger.error('$stateChangeError', error);
				}
				$rootScope.currentState = {};
			});
			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
				if(debugRouting) {
					nLogger.success('$stateChangeSuccess', toState);
				}
				$rootScope.currentState = toState;
			});
			$rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
				if(debugRouting) {
					nLogger.warning('$stateNotFound', unfoundState);
				}
				$rootScope.currentState = {};
			});

		}
})();
