	(function () {
	'use strict';

	angular
		.module('documents')
		.controller('Documents', Documents);

	/* @ngInject */
	function Documents($state, $timeout, $scope, $rootScope, Document, documents, nMessages, $stateParams) {
		/*jshint validthis: true */
		var vm = this;
		console.log('init af doculoco controller')

		vm.documents = documents;

		/* Bind methods */
		vm.createDocument = createDocument;
		vm.selectDocument = selectDocument;
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

	}

})();
