(function () {
	'use strict';

	angular
		.module('documents')
		.controller('Documents', Documents);

	/* @ngInject */
	function Documents($state, $timeout, $scope, Document, documents, nMessages) {
		/*jshint validthis: true */
		var vm = this;

		// $scope.watch will be bound to this, so we can reset the watcher or destroy it
		var autosaver;

		vm.documents = documents;
		vm.currentDocument = {};

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

		/* Bind methods */
		vm.createDocument = createDocument;
		vm.selectDocument = selectDocument;
		vm.updateDocument = updateDocument;
		vm.destroyDocument = destroyDocument;

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
			if (vm.documents.length < 1) {
				vm.createDocument();
			} else {
				var last = vm.documents[vm.documents.length - 1];
				vm.selectDocument(last);
			}

			autoSave();
		}


		function createDocument() {
			vm.currentDocument = Document.create({}).then(function(doc) {
				selectDocument(doc);
			});
		}


		function selectDocument(doc) {
			vm.currentDocument = doc;
			// Set UI State to Edit
			$state.go('application.document.edit', {id: doc.id});
		}


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
		 * Destroys the document.
		 * If {@param} is currently selected, it select's the latest touched document,
		 * If it's the only document left, it deletes it, and creates a new document.
		 *
		 * @param  {object} doc Document object.
		 */
		function destroyDocument(doc) {
			if (vm.documents.length > 1) {
				Document.destroy(doc.id).then(function() {
					_selectLatestDocument();
				});
			} else {
				Document.destroy(doc.id).then(function() {
					createDocument();
				});
			}
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

		/* Private Methods */
		function _selectLatestDocument() {
			var doc = vm.documents[vm.documents.length - 1];
			selectDocument(doc);
		}


		function _updateIsSavingFlag() {
			vm.isSaving = true;
			$timeout(function(){
				vm.isSaving = false;
			}, 1000);
		}

	}

})();
