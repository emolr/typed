(function() {
	'use strict';

	angular
		.module('animate-fade-in-overlay')
	  	.directive('animateFadeInOverlay', animateFadeInOverlay);

	/* @ngInject */
	function animateFadeInOverlay() {
		var directive = {

			link: link,
			restrict: 'EA',
			scope: {
				endFn: '&'
			}
		};

		return directive;

		function link(scope, element, attrs){

			element.on('click', function(event) {
				fadeInOverlay();
				fadeOutToolbar();
			});


			function fadeInOverlay() {
				var tempEl = createAnchorNode();

				// Append the newly created DIV to body
				document.getElementsByTagName('body')[0].appendChild(tempEl);

				// Slide down the created overlay


				TweenMax.fromTo(tempEl, 0.5, {
					opacity: 0,
					ease: Sine.easeOut
				}, {
					// delay: 0.2,
					opacity: 1,
					ease: Sine.easeOut,
					onComplete: function() {
						scope.endFn();
					}
				});
			}

			function fadeOutToolbar() {

				// Fade in the toolbar in the transition
				var toolbar = document.getElementsByClassName('documents__toolbar')[0];
				toolbar.style.zIndex = 1000;

				TweenMax.fromTo(toolbar, 0.4, {
					opacity: 1,
					ease: Sine.easeIn
				}, {
					delay: 0.1,
					opacity: 0,
					ease: Sine.easeIn
				});
			}


			function createAnchorNode() {
				var newAnchorEl = document.createElement('DIV');

				newAnchorEl.style.position = 'fixed';
				newAnchorEl.style.zIndex = '10';
				newAnchorEl.style.width = '100vw';
				newAnchorEl.style.height = '100vh';
				newAnchorEl.style.top = '0';
				newAnchorEl.style.right = '0';
				newAnchorEl.style.bottom = '0';
				newAnchorEl.style.left = '0';
				newAnchorEl.style.backgroundColor = '#fff';
				newAnchorEl.style.pointerEvents = 'none';
				newAnchorEl.style.opacity = '0';
				newAnchorEl.className = 'singleOverlay';

				return newAnchorEl;
			}

		};
	};
})();
