(function () {
	'use strict';

	angular
		.module('document')
		.controller('DocumentCtrl', DocumentCtrl);

	/* @ngInject */
	function DocumentCtrl($scope, Documents, documents) {
		/*jshint validthis: true */
		var vm = this;

		vm.documents = documents;

		activate();

		function activate() {

		};
	};

})();
