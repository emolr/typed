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

			$stateProvider.state(Book);
		});
})();
