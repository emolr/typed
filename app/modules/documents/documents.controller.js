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
			placeholder: 'Min placeholdning',
			buttons: [
				'bold',
				'italic'
			]
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
		// ** Requires $timeout, as we are messing about with "external" events
		$scope.$watch(function() {
			return vm.currentDocument.content;
		}, function(newValue, oldValue) {
			if(angular.equals(newValue, oldValue) || !angular.isDefined(newValue)) {
				return;
			}
			$timeout(function() {
				vm.currentDocument.title = vm.editor.parseTitle(true);
			});
		});


		/* Initiate */
		activate();
		autoSave();

		/* Public methods */

		// View Controller activation
		// ** Requires $timeout, as we are messing about with "external" events
		function activate() {
			$timeout(function() {
				if (vm.documents.length < 1) {
					vm.createDocument();
				} else {
					var last = vm.documents[vm.documents.length - 1];
					vm.selectDocument(last);
				}
			});
		}


		function createDocument() {
			// Set UI State to Create
			$state.go('application.document.create')
				.then(function() {
					vm.editor.focus();
				});
			vm.currentDocument = Document.createInstance();
			vm.editor.focus();
		}


		function selectDocument(doc) {
			// Set UI State to Edit
			$state.go('application.document.edit', {id: doc.id})
				.then(function() {
					vm.editor.focus();
				});
			vm.currentDocument = doc;
		}


		function updateDocument(doc) {

			if (!vm.currentDocument.id) {
				Document.create(vm.currentDocument)
					.then(function (doc) {
						nMessages.create('Saved succesfully');
					})
					.then(function() {
						// Set UI State to Edit
						$state.go('application.document.edit', {id: doc.id});
					});
			} else {
				Document.update(vm.currentDocument.id, vm.currentDocument)
					.then(function() {
						nMessages.create('Document succesfully saved');
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
			} else if (vm.currentDocument && vm.currentDocument.id === doc.id) {
				Document.destroy(doc.id).then(function() {
					createDocument();
				});
			} else {
				Document.destroy(doc.id);
			}
		}


		/* Private Methods */
		function _selectLatestDocument() {
			var params = {};

			params.orderBy = [
				['touched', 'ASC']
			];

			params.limit = 1;

			vm.currentDocument = Document.filter(params)[0];
		}


		/**
		 * Autosave when detecting changes to the ng-model
		 *
		 */

		function autoSave() {
			$scope.$watch("documents.currentDocument.content", function( newValue, oldValue ) {
				updateDocument(vm.currentDocument);
			});
		}


	};

})();
