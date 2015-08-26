(function () {
	'use strict';

	angular
		.module('usersettings')
		.factory('UserSettings', UserSettings);

	/* @ngInject */
	function UserSettings(DS) {

		return DS.defineResource('setting');

	};

})();
