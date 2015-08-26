	(function () {
	'use strict';

	angular
		.module('documents')
		.controller('Documents', Documents);

	/* @ngInject */
	function Documents($state, $timeout, $scope, $rootScope, Document, documents, nMessages, $stateParams, UserSettings) {
		/*jshint validthis: true */
		var vm = this;

		// Variables
		vm.userSettings = '';

		vm.documents = documents;

		/* Bind methods */
		vm.createDocument = createDocument;
		vm.selectDocument = selectDocument;
		vm.destroyDocument = destroyDocument;
		vm.goToOverview = goToOverview;

		// These functions are user preferences
		vm.changeFontSize = changeFontSize;


		// Watch any changes to the Documents collection and update view accordingly
		$scope.$watch(function() {
			return Document.lastModified();
		}, function(documents) {

			vm.documents = Document.filter();
		});

		/* Initiate */
		activate();

		/* Public methods */

		// View Controller activation
		function activate() {

			// Load user settings into the scope.
			if (!vm.userSettings) {
				_getUserSettings();
			}

		}


		function createDocument() {
			Document.create({}).then(function(doc) {
				selectDocument(doc);
			});
		}


		function selectDocument(doc) {
			$state.go('application.document.edit', {id: doc.id});
		}


		/**
		 * Destroys the document.
		 * If {@param} is currently selected, it select's the latest touched document,
		 * If it's the only document left, it deletes it, and creates a new document.
		 *
		 * @param  {object} doc Document object.
		 */
		function destroyDocument(doc) {
			if ($rootScope.currentDocument = doc) {
				Document.destroy(doc).then(function() {
					$state.go('application.document.overview');
				});
			} else {
				Document.destroy(doc);
			}
		}


		/* Private Methods */
		function _selectLatestDocument() {
			var doc = vm.documents[vm.documents.length - 1];
			selectDocument(doc);
		}


		/* State change functions */
		function goToOverview() {
			$state.go('application.document.overview');
		}


		/* Change the font size setting */
		/**
		 * Translates the value into a px value that can be used in the view
		 * and used to control font size of the docuement
		 *
		 * @param Int.
		 */
		function changeFontSize(value) {

			if(value === 1) {
				vm.userSettings.fontSize = '12px';
			} else if(value === 2) {
				vm.userSettings.fontSize = '16px';
			} else {
				vm.userSettings.fontSize = '22px';
			}

			vm.userSettings.fontSetting = value;

			_updateUserSettings(vm.userSettings);
		}


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
				vm.userSettings = UserSettings.get(setting.id);
			}, function (error){
				_createUserSettings();
			});
		}


	}

})();
