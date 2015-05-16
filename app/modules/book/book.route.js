(function() {
	'use strict';

	angular.module('book')
		/* @ngInject */
		.config(function ($stateProvider) {

			var Book = {
				name: 'application.book',
				url: '/book',
				views: {
					'application@': {
						templateUrl: 'modules/book/book.template.html',
						controller: 'Book',
						controllerAs: 'book'
					}
				}
			};

			var Document = {
				name: 'application.document',
				url: '/book/document',
				views: {
					'application@': {
						templateUrl: 'modules/book/document/document.template.html',
						controller: 'DocumentCtrl',
						controllerAs: 'document'
					}
				},
				resolve: {
					documents: function(Documents) {

						var params = {};
							params.orderBy = [
							['created', 'DESC']
						];

						return Documents.findAll(params);
					}
				}
			};

			$stateProvider.state(Book);
			$stateProvider.state(Document);
		});
})();
