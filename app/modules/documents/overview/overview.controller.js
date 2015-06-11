(function () {
	'use strict';

	angular
		.module('overview')
		.controller('Overview', Overview);

	/* @ngInject */
	function Overview($scope) {
		/*jshint validthis: true */
		var vm = this;

		vm.trueBool = true;
		vm.falseBool = false;

		vm.dropdownMenus = {
			lort: true
		};
		vm.testMethod = function() {
			console.log($scope)
		}

		activate();

		function activate() {

		};
	};

})();
