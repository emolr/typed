(function () {
	'use strict';

	angular
		.module('overview')
		.animation('.book-wrapper', Animation);


	/* @ngInject */
	function Animation() {

		return {
			enter: enter,
			leave: leave
		};

		function enter(element, doneFn) {

		}

		function leave(element, doneFn) {

		}
	}

})();
