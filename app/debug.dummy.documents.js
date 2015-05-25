(function(angular) {
	'use strict';

	angular.module('typed')
		.run(function(Document, $http, $q, $state, $rootScope) {

			var dummyDocuments = [
				{
					file: 'our_cats.html',
					title: 'OUR CATS'
				}
			];

			Document.findAll().then(function(documents) {
				if(documents.length > 0) {
					return;
				}

				var promises = [];

				console.info('Generating dummy-data, ' +
				'disable this functionality ' +
				'by removing the debug.dummy.documents.js ' +
				'from index.html');

				_fetchDummyData()
					.then(function(files) {
						for(var i = 0, len = files.length; i < len; i++) {
							promises.push(Document.create({title: dummyDocuments[i].title,content: files[i].data}));
						}
						return $q.all(promises);
					})
					.then(function(docs) {
						console.info('Dummy-data generated.');
					});
			});


			function _fetchDummyData() {

				var promises = [];

				for(var i = 0, len = dummyDocuments.length; i < len; i++) {
					promises.push($http.get('assets/dummy-data/' + dummyDocuments[i].file));
				}

				return $q.all(promises);

			}

		});

})(angular);
