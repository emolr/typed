(function () {
	'use strict';

	angular
		.module('single')
		.controller('Single', Single);

	/* @ngInject */
	function Single($rootScope, $state, $timeout, $scope, doc, Document, documents, nMessages, UserSettings) {
		/*jshint validthis: true */
		var vm = this;


		// Variables
		vm.currentDocument = doc;
		// $scope.watch will be bound to this, so we can reset the watcher or destroy it
		var autosaver;

		// Methods
		vm.updateDocument = updateDocument;


		/* Medium Editor config */

		// We will bind the editor instance to this object
		vm.editor = {};
		// Configuration options
		vm.editorConfig = {
			buttons: [
				'bold',
				'italic',
				'underline',
				'header1',
				'header2',
				'justifyCenter',
				'unorderedlist',
				'quote',
				'anchor'

			],
			placeholder: ''
		};

		activate();

		function activate() {
			autoSave();
		};


		function updateDocument(doc) {

			var title = vm.editor.parseTitle(true);
			if(title) {
				vm.currentDocument.title = title;
			}

			Document.update(vm.currentDocument.id, vm.currentDocument)
				.then(function() {
					_updateIsSavingFlag();
				});
		}


		/**
		 * Autosave when detecting changes to the ng-model
		 *
		 */
		function autoSave() {
			// Clear previous watcher (nice if we're changing docs)
			if(autosaver) {
				autosaver();
			}
			autosaver = $scope.$watch(function() {

				return vm.currentDocument.content;

			}, function(newValue, oldValue) {
				if(angular.equals(newValue, oldValue)) {
					return;
				}
				if(!angular.isDefined(newValue)) {
					return;
				}

				updateDocument(vm.currentDocument);
			});
		}


		function _updateIsSavingFlag() {
			vm.isSaving = true;
			$timeout(function(){
				vm.isSaving = false;
			}, 1000);
		}

	};

})();
