(function () {
	'use strict';

	angular
		.module('toolbar')
		.controller('Toolbar', Toolbar);

	/* @ngInject */
	function Toolbar($rootScope, $scope, UserSettings) {
		/*jshint validthis: true */
		var vm = this;


		// Variables
		// Default font size in document
		$rootScope.userSettings = '';


		// Public methods
		vm.changeFontSize = changeFontSize;


		activate();

		function activate() {
			if (!$rootScope.userSettings) {
				_getUserSettings();
			}
		};


		function changeFontSize(value) {

			if(value === 1) {
				$rootScope.userSettings.fontSize = '12px';
			} else if(value === 2) {
				$rootScope.userSettings.fontSize = '16px';
			} else {
				$rootScope.userSettings.fontSize = '22px';
			}

			$rootScope.userSettings.fontSetting = value;

			_updateUserSettings($rootScope.userSettings);
		};


		function _updateUserSettings(object) {
			UserSettings.update('setting', object);
		}

		// Creates a settings record
		function _createUserSettings() {
			UserSettings.create({id: 'setting'});
		}


		// Get's user settings from DB, if no settings record created,
		// create one.
		function _getUserSettings() {
			UserSettings.find('setting').then(function(setting) {
				$rootScope.userSettings = UserSettings.get(setting.id);
			}, function (error){
				_createUserSettings();
			});
		}


	};

})();
