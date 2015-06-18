(function() {
	'use strict';

	angular.module('sandbox')
		/* @ngInject */
		.config(function ($stateProvider) {

			var Sandbox = {
				name: 'application.sandbox',
				url: '/sandbox',
				views: {
					'application@': {
						templateUrl: 'modules/sandbox/sandbox.template.html',
						controller: 'Sandbox',
						controllerAs: 'sandbox'
					}
				}
			};

			$stateProvider.state(Sandbox);
		});
})();
