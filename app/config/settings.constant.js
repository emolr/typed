(function() {
	'use strict';

	angular.module('typed')
		.constant('settings', {
			documentQueryParams: {
				orderBy: [
					['created', 'DESC']
				]
			}
		});
})();
