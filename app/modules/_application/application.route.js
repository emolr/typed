(function() {
	'use strict';

	angular.module('application')
		/* @ngInject */
		.config(function ($stateProvider) {

			var Application = {
				name: 'application',
				abstract: true,
				templateUrl: 'modules/_application/application.template.html',
				controller: 'Application',
				controllerAs: 'application'
			};

			$stateProvider.state(Application);
		});
})();
