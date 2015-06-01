(function() {
	'use strict';

	angular.module('documents')
		/* @ngInject */
		.config(function ($stateProvider) {

			/*
				Application states:

				application.document - root state
				application.document.edit - child state
				application.document.overview - index state

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

			var Edit = {
				name: 'application.document.edit',
				url: '/documents/:id',
				views: {
					'toolbar': {
						templateUrl: 'modules/documents/toolbar/toolbar.template.html',
						controller: 'Toolbar',
						controllerAs: 'toolbar'
					},
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

			var Overview = {
				name: 'application.document.overview',
				url: '/',
				views: {
					'toolbar': {
						templateUrl: 'modules/documents/toolbar/toolbar-overview.template.html',
						controller: 'Toolbar',
						controllerAs: 'toolbar'
					},
					'right': {
						templateUrl: 'modules/documents/overview/overview.template.html',
						controller: 'Overview',
						controllerAs: 'overview'
					},
					'toolbar': {
						templateUrl: 'modules/documents/toolbar/toolbar.overview.template.html',
						controller: 'Toolbar',
						controllerAs: 'toolbar'
					}
				}
			};

			$stateProvider.state(Documents);
			$stateProvider.state(Edit);
			$stateProvider.state(Overview);
		});
})();
