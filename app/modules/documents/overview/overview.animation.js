(function () {
	'use strict';

	angular
		.module('overview')
		//.animation('.documents__overview-wrapper', Animation);


	/* @ngInject */
	function Animation(TimelineMax) {
		console.log('anm')
		return {
			enter: enter
		};

		function enter(element, doneFn) {
			console.log('Haha, hej fra animation', element);
		}
	}

})();
