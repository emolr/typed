(function () {
	'use strict';

	angular
		.module('overview')
		.animation('.animate-this-element', Animation);


	/* @ngInject */
	function Animation($timeout) {

		var queue = {
			enter: [],
			leave: []
		};

		var parentSelector = '.documents__overview-wrapper';

		var from = {
			opacity: 0,
			y: '30%'
		};

		var to = {
			opacity: 1,
			y: '0%'
		};

		return {
			enter: enter
		};

		function enter(element, doneFn) {

			var parent = angular.element(parentSelector);
			var cancel;

			TweenMax.set(parent, {opacity: 0});

			TweenMax.set(element, from);

			TweenMax.to(parent, 1, {opacity: 1, onComplete:  testFn});

			/*cancel = _queueAllAnimations('enter', element, doneFn, function(elements, done) {
				TweenMax.staggerTo(elements, 0.2, to, 0.1, done);
			});*/

			function testFn() {
				console.info('Parent done, calling children');
				TweenMax.to(angular.element('.animate-me'), {opacity: 0});
			}

			return function onClose(cancelled) {
				cancelled && cancel();
			};

		}

		function _queueAllAnimations(event, element, done, onComplete) {

			queue[event].push({
				element: element,
				done: done
			});

			queue[event].timer && $timeout.cancel(queue[event].timer);

			queue[event].timer = $timeout(function() {

				var elements = [];
				var doneFns = [];

				angular.forEach(queue[event], function(item) {
					item && elements.push(item.element);
					doneFns.push(done);
				});

				var onDone = function() {
					angular.forEach(doneFns, function(fn) {
						fn();
					});
				};

				onComplete(elements, onDone);

				queue[event] = [];

			}, 10, false);

			return function() {
				queue[event] = [];
			};

		}
	}

})();
