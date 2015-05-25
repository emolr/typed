(function () {
	'use strict';

	angular
		.module('documents')
		.controller('Documents', Documents);

	/* @ngInject */
	function Documents($state, $timeout, $scope, Document, documents, nMessages) {
		/*jshint validthis: true */
		var vm = this;

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

		// Watch any changes to the currently edited document, if it changes,
		// parse the title and set it on the model.
		$scope.$watch(function() {
			return vm.currentDocument.content;
		}, function(newValue, oldValue) {
			if(angular.equals(newValue, oldValue) || !angular.isDefined(newValue)) {
				return;
			}
			vm.currentDocument.title = vm.editor.parseTitle(true);
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
			vm.currentDocument = Document.create({});
			// Set UI State to Create
			$state.go('application.document.create');
		}


		function selectDocument(doc) {
			vm.currentDocument = doc;
			// Set UI State to Edit
			$state.go('application.document.edit', {id: doc.id});
		}


		function updateDocument(doc) {
			if (!vm.currentDocument.id) {
				Document.create(vm.currentDocument)
					.then(function (doc) {
						return nMessages.create('Created');
					})
					.then(function() {
						// Set UI State to Edit
						$state.go('application.document.edit', {id: doc.id});
					});
			} else {
				vm.isSaving = true;
				Document.update(vm.currentDocument.id, vm.currentDocument)
					.then(function() {
						_updateIsSavingFlag();
					});
			}
		}


		/**
		 * Destroys the document.
		 * If {@param} is currently selected, it select's the latest touched document,
		 * If it's the only document left, it deletes it, and creates a new document.
		 *
		 * @param  {object} doc Document object.
		 */
		function destroyDocument(doc) {
			if (vm.documents.length > 1 && vm.currentDocument && vm.currentDocument.id === doc.id) {
				Document.destroy(doc.id).then(function() {
					_selectLatestDocument();
				});
			} else {
				Document.destroy(doc.id).then(function() {
					createDocument();
				});
			}
		}


		/* Private Methods */
		function _selectLatestDocument() {
			var params = {};

			params.orderBy = [
				['created', 'ASC']
			];

			params.limit = 1;

			var doc = Document.filter(params)[0];
			selectDocument(doc);
		}


		/**
		 * Autosave when detecting changes to the ng-model
		 *
		 */

		function autoSave() {
			$scope.$watch(function() {

				return vm.currentDocument.content;

			}, function(newValue, oldValue) {

				if (angular.equals(newValue, oldValue)) {
					return;
				}

				updateDocument(vm.currentDocument);
			});
		}


		function _updateIsSavingFlag() {
			$timeout(function(){
				vm.isSaving = false;
			}, 1000);
		}


	};

})();
