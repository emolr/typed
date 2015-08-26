(function() {
	'use strict';

	angular
		.module('animatetodown')
	  	.directive('animateToDown', animateToDown);

	/* @ngInject */
	function animateToDown() {
		var directive = {

			link: link,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs){


			// This animation is made especially for the books,
			// because the animation needs to be on the parent
			// to get the buttons down to.
			element.on('click', function(event) {

				// Animate the clicked element, and the whole book list.
				var parentElement = element.parent()[0];

				TweenMax.to(parentElement, 0.7, {
					y: '130px',
					ease: Power2.easeIn
				});

			});
		};
	};
})();
