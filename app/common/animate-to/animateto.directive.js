(function() {
	'use strict';

	angular
		.module('animateto')
	  	.directive('animateTo', animateTo);

	/* @ngInject */
	function animateTo($document) {
		var directive = {
			link: link,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs){

			var fromEl = element[0];
			var toEl = angular.element(attrs.animateTo)[0];

			var elSize = fromEl.getBoundingClientRect();

			console.log(toEl)

			element.on('click', function(event) {

				var tempEl = createNode(elSize);
				TweenMax.set(toEl, {opacity: 0});

				document.getElementsByTagName('body')[0].appendChild(tempEl);

				TweenMax.to(tempEl, 5, {
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					ease: Power2.easeInOut
				});

			});

		}

		function createNode(dimensions) {

			var newEl = document.createElement('div');
			newEl.className = 'animate-to__transporter';
			newEl.style.position = 'absolute';
			newEl.style.width = dimensions.width + 'px';
			newEl.style.height = dimensions.height + 'px';
			newEl.style.top = dimensions.top + 'px';
			newEl.style.right = dimensions.right + 'px';
			newEl.style.bottom = dimensions.bottom + 'px';
			newEl.style.left = dimensions.left + 'px';
			return newEl;

		}

	}
})();
