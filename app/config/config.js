(function () {
	'use strict';

	var core = angular.module('config', ['DEBUG_ENV', 'nCore']);

	core.config(configure);

	/* @ngInject */
	function configure(DEBUG_ENV, $logProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

		if($logProvider.debugEnabled && DEBUG_ENV) {
			$logProvider.debugEnabled(true);
		} else {
			$logProvider.debugEnabled(false);
		}

		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/404');

		$stateProvider
			.state('application.notfound', {
				url: '/404',
				views: {
					'application@': {
						templateUrl: '404.html'
					}
				}
			})
			.state('error', {
				url: '/503',
				views: {
					'application@': {
						templateUrl: '503.html'
					}
				}
			});
	}

})();
