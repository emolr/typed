(function () {
	'use strict';

	var core = angular.module('config', ['DEBUG_ENV', 'core.translate', 'core.exception', 'core.logger', 'angular-loading-bar', 'cgBusy']);

	var config = {
		appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator,
		appTitle: 'Title'
	};

	core.value('config', config);

	core.constant('toastr', toastr);

	core.value('cgBusyDefaults', {
		message:'Loading Stuff',
		backdrop: true,
		templateUrl: '../common/core/loadingindicator/loadingindicator.template.html'
	});

	core.config(configure);

	/* @ngInject */
	function configure(DEBUG_ENV, $logProvider, exceptionHandlerProvider, $stateProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider, translateProvider) {

		if($logProvider.debugEnabled && DEBUG_ENV) {
			$logProvider.debugEnabled(true);
		} else {
			$logProvider.debugEnabled(false);
		}

		//Translate
		translateProvider.configure({
			root: '//mobilev2.like.st/',
			endpoint: 'api/translation',
			projectId: 180, //Ex 180
			platformId: 179, // Ex 179
			languageId: 'da-DK' // Ex 'da-DK'
		});

		exceptionHandlerProvider.configure(config.appErrorPrefix);

		cfpLoadingBarProvider.includeSpinner = false;
		cfpLoadingBarProvider.latencyThreshold = 600;

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
