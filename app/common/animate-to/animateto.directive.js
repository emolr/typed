(function() {
	'use strict';

	angular
		.module('animateto')
	  	.directive('animateTo', animateTo);

	/* @ngInject */
	function animateTo($document) {
		var directive = {
			link: link,
			restrict: 'EA',
			scope: {
				endFn: '&'
			}
		};

		return directive;

		function link(scope, element, attrs){

			var fromEl = element[0];

			var elSize = element[0].getBoundingClientRect();

			element.on('click', function(event) {

				var tempEl = createAnchorNode(element, elSize);
				var tempElChilds = tempEl.children;

				// Append the cloned element to body
				element.parent()[0].appendChild(tempEl);


				// Animate the cloned element
				TweenMax.to(tempEl, 0.6, {
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					ease: Power2.easeInOut,
					onComplete: function() {
						scope.endFn();
					}
				});


				// Animate all children independently
				for (var i = 0, len = tempElChilds.length; i < len; i++ ) {
					TweenMax.to(tempElChilds[i], 0.4, {
						opacity: 0
					});
				}

			});

		}

		function createAnchorNode(el, dimensions) {
			var newAnchorEl = el[0].cloneNode(true);

			newAnchorEl.className += ' ' + 'animate-anchor-out';
			newAnchorEl.style.position = 'fixed';
			newAnchorEl.style.zIndex = '9999';
			newAnchorEl.style.width = dimensions.width + 'px';
			newAnchorEl.style.height = dimensions.height + 'px';
			newAnchorEl.style.top = dimensions.top + 'px';
			newAnchorEl.style.right = dimensions.right + 'px';
			newAnchorEl.style.bottom = dimensions.bottom + 'px';
			newAnchorEl.style.left = dimensions.left + 'px';

			return newAnchorEl;
		}

		function fadeOutChild(element, index, array) {
			this.hide();
		}

	}
})();
