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

		function run(DS, DSLocalForageAdapter) {
			DS.registerAdapter('localforage', DSLocalForageAdapter, {default: true});
		}
})();
