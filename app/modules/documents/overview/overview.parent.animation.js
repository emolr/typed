(function () {
	'use strict';

	angular
		.module('overview')
		.animation('.documents__overview-wrapper', Animation);


	/* @ngInject */
	function Animation(settings) {

		var parentFrom =  {
			opacity: 0
		};
		var parentTo = {
			opacity: 1
		};

		var childFrom = {
			opacity: 0,
			y: '30%'
		};

		var childTo = {
			opacity: 1,
			y: '0%'
		};

		return {
			enter: enter,
			leave: leave
		};

		function enter(element, doneFn) {

			// Let's find all books in the overview list
			var children = angular.element(element).find('.book-wrapper');

			// Initial state of animatable elements (.ng-enter)
			TweenMax.set(element, parentFrom);
			TweenMax.set(children, childFrom);

			// Final state of animatable elements (.ng-enter-active)
			TweenMax.to(element, settings.animation.globalDuration.short, {opacity: 1, onComplete: animateMyChildren});

			// Callback method to be executed when the "main" element is done animating (ng-animate-children)
			function animateMyChildren() {
				TweenMax.staggerTo(
					children,
					settings.animation.globalDuration.medium,
					childTo,
					settings.animation.globalDuration.short,
					doneFn
				);
			}

		}

		function leave(element, doneFn) {

			// Let's find all books in the overview list
			var children = angular.element(element).find('.book-wrapper');
			console.log(children, typeof children);

			// Final state of animatable elements (.ng-enter-active)
			TweenMax.staggerTo(children, settings.animation.globalDuration.medium, {opacity: 0, y: '30%'}, 0.2, animateMyParent);

			// Callback method to be executed when the "main" element is done animating (ng-animate-children)
			function animateMyParent() {
				TweenMax.to(
					element,
					settings.animation.globalDuration.short,
					{opacity: 0, onComplete: doneFn}
				);
			}

		}

	}

})();
