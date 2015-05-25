(function() {
	'use strict';

	angular.module('documents')
		/* @ngInject */
		.config(function ($stateProvider) {

			/*
				Application states:

				application.document - root state
				application.document.create - child state
				application.document.edit - child state

				UI-View structure:
				|------application------|
				| |------document-----| |
				| | | left || right | | |
			 	| |-------------------| |
			 	|-----------------------|
			 */

			var Documents = {
				name: 'application.document',
				abstract: true,
				views: {
					'application@': {
						templateUrl: 'modules/documents/documents.template.html',
						controller: 'Documents',
						controllerAs: 'documents'
					}
				},
				resolve: {
					documents: function(Document) {
						return Document.findAll();
					}
				}
			};

			var Create = {
				name: 'application.document.create',
				url: '/',
				views: {
					'left': {
						templateUrl: 'modules/documents/list/list.template.html',
						controller: 'List',
						controllerAs: 'list'
					},
					'right': {
						templateUrl: 'modules/documents/single/single.template.html',
						controller: 'Single',
						controllerAs: 'single'
					}
				}
			};

			var Edit = {
				name: 'application.document.edit',
				url: '/:id',
				views: {
					'left': {
						templateUrl: 'modules/documents/list/list.template.html',
						controller: 'List',
						controllerAs: 'list'
					},
					'right': {
						templateUrl: 'modules/documents/single/single.template.html',
						controller: 'Single',
						controllerAs: 'single'
					}
				}
			};

			$stateProvider.state(Documents);
			$stateProvider.state(Create);
			$stateProvider.state(Edit);
		});
})();
