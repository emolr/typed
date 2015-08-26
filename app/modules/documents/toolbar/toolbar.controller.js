(function () {
	'use strict';

	angular
		.module('toolbar')
		.controller('Toolbar', Toolbar);

	/* @ngInject */
	function Toolbar($rootScope, $scope, UserSettings) {
		/*jshint validthis: true */
		var vm = this;


		activate();

		function activate() {
			//...
		};


	};

})();
