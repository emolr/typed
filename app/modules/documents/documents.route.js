(function() {
	'use strict';

	angular.module('documents')
		/* @ngInject */
		.config(function ($stateProvider) {

			var Documents = {
				name: 'application.document',
				url: '/documents',
				views: {
					'application@': {
						templateUrl: 'modules/documents/documents.template.html',
						controller: 'Documents',
						controllerAs: 'documents'
					}
				},
				resolve: {
					documents: function(Document) {

						var params = {};
						params.orderBy = [
							['created', 'DESC']
						];

						return Document.findAll(params);
					}
				}
			};

			$stateProvider.state(Documents);
		});
})();
