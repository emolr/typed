(function () {
	'use strict';

	angular
		.module('documents')
		.controller('Documents', Documents);

	/* @ngInject */
	function Documents($scope, Document, documents, nMessages) {
		/*jshint validthis: true */
		var vm = this;

		vm.documents = documents;

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


		$scope.$watch(function() {
			return Document.lastModified();
		}, function(documents) {
			vm.documents = Document.filter();
		});

		$scope.$watch(function() {
			return vm.editor;
		}, function(newVal) {
			console.log(newVal);
			console.log(vm.editor)
		});


		/* Initiate */
		activate();


		/* Public methods */
		function activate() {
			if (vm.documents.length < 1) {
				vm.createDocument();
			} else {
				var last = vm.documents[vm.documents.length - 1];
				vm.selectDocument(last);
			}
		}


		function createDocument() {
			vm.currentDocument = Document.createInstance();
		}


		function selectDocument(doc) {
			vm.currentDocument = doc;
		}


		function updateDocument(doc) {
			if (!vm.currentDocument.id) {
				Document.create(vm.currentDocument)
					.then(function (doc) {
						nMessages.create('Saved succesfully');
					});
			} else {
				Document.update(vm.currentDocument.id, vm.currentDocument)
					.then(function() {
						nMessages.create('Saved succesfully');
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
			if (vm.documents.length > 1 && vm.currentDocument.id === doc.id) {
				Document.destroy(doc.id)
					.then(function() {
						var last = vm.documents[vm.documents.length - 1];
						vm.selectDocument(last);
					});
			} else {
				Document.destroy(doc.id)
					.then(function() {
						vm.createDocument();
					});
			}
		}


	};

})();
