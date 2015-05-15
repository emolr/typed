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
		.module('typed', [
			
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ngRoute',
    'ui.router',
    'config',
    'DEBUG_ENV',
    'API_ENDPOINTS',
    'core.exception',
    'core.logger',
    'angular-loading-bar',
    'cgBusy',
    'angulartics',
    'angulartics.google.analytics',
    'mm.foundation',
    'ngLodash',
    'application',
    'index',
  ,
			/* ---> Do not delete this comment (ngImports) <--- */
	]);
})();
