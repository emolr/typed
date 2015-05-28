(function() {
	'use strict';

	angular.module('typed')
		.constant('settings', {
			documentQueryParams: {
				orderBy: [
					['created', 'DESC']
				]
			},
			animation: {
				globalDuration: {
					short: 0.2,
					medium: 0.4,
					long: 1
				}
			}
		});
})();
