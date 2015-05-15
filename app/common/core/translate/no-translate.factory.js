(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name biodivApp.factory:NoTranslate
	 * @description
	 * # NoTranslate
	 * Factory of the biodivApp
	 */
	angular
		.module('core.translate.factory', ['core.translate.provider', 'core.logger', 'ngStorage'])
		.factory('Translate', Translate);

	/* @ngInject */
	function Translate($http, $q, $rootScope, $localStorage, translate, $timeout, logger) {

		var service = {
			init: init
		};

		return service;

		function init() {
			var deferred = $q.defer();

			if($localStorage.translate === undefined || $localStorage.translate.expire < Date.now()) {
				get().then(function() {
					deferred.resolve();
				}, function() {
					deferred.reject();
				});
			} else {
				$rootScope.translate = $localStorage.translate;
				deferred.resolve();
			}

			return deferred.promise;
		}

		function get() {

			var url = translate.settings.root + translate.settings.endpoint + '/project/' + translate.settings.projectId + '/platform/' + translate.settings.platformId + '/language/' + translate.settings.languageId;

			return $http.get(url).then(function(results) {
				var translate =  results.data.data;
				translate.expire = Date.now() + (24 * 60 * 60 * 1000);

				$localStorage.translate = translate;
				$rootScope.translate = translate;
			}, function(error) {
				logger.error('Error communicating with translation API', error, 'Translation Error:')
			});

		}
	};

})();
