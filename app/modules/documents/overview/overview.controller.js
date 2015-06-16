(function () {
	'use strict';

	angular
		.module('overview')
		.controller('Overview', Overview);

	/* @ngInject */
	function Overview($scope) {
		/*jshint validthis: true */
		var vm = this;

		activate();

		function activate() {

		};

		vm.viewSpecificDropdownClasses = {
			toggleClass: 'tis__toggle',
			toggleActiveClass: 'ttis__active',

			contentClass: 'hest__content',
			contentOpenClass: 'hest__content--open'
		}
	};

})();
