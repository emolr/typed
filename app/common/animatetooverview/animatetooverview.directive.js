(function() {
	'use strict';

	angular
		.module('animatetooverview')
	  	.directive('animateToOverview', animateToOverview);

	/* @ngInject */
	function animateToOverview($timeout, $state) {
		var directive = {

			link: link,
			restrict: 'EA',
			scope: {
				endFn: '&'
			}
		};

		return directive;

		function link(scope, element, attrs){


			function activate() {
				// First clear any left overlays
				var oldOverlay = document.getElementsByClassName('singleOverlay')[0];

				if(oldOverlay) {
					oldOverlay.remove();
				}


				slideBooksUp();
				slideOverlayDown();
				fadeInToolbar();
			}

			// Only activate the animation on state overview
			if($state.current.name == "application.document.overview") {
				activate();
			}


			function createAnchorNode() {

				var newAnchorEl = document.createElement('DIV');

				newAnchorEl.style.position = 'fixed';
				newAnchorEl.style.zIndex = '9999';
				newAnchorEl.style.width = '100vw';
				newAnchorEl.style.height = '100vh';
				newAnchorEl.style.top = '0';
				newAnchorEl.style.right = '0';
				newAnchorEl.style.bottom = '0';
				newAnchorEl.style.left = '0';
				newAnchorEl.style.backgroundColor = '#fff';
				newAnchorEl.style.pointerEvents = 'none';
				newAnchorEl.style.opacity = '1';

				return newAnchorEl;
			}

			function slideBooksUp() {
				var bookList = document.getElementsByClassName('books');

				TweenMax.fromTo(bookList, 1, {
					y: '100px',
					scale: '0.95',
					ease: Power2.easeOut,
					transformOrigin: 'bottom bottom'
				}, {
					y: '0',
					scale: '1',
					ease: Power2.easeOut,
					transformOrigin: 'bottom bottom'
				});
			}

			function slideOverlayDown() {
				var tempEl = createAnchorNode();

				// Append the newly created DIV to body
				document.getElementsByTagName('body')[0].appendChild(tempEl);

				// Slide down the created overlay


				TweenMax.to(tempEl, 0.6, {
					y: '100%',
					ease: Power2.easeIn,
					onComplete: function() {
						tempEl.remove();
					}
				});
			}

			function fadeInToolbar() {

				// Fade in the toolbar in the transition
				var toolbar = document.getElementsByClassName('documents__toolbar');

				TweenMax.fromTo(toolbar, 0.7, {
					opacity: 0,
					ease: Sine.easeIn
				}, {
					delay: 0.2,
					opacity: 1,
					ease: Sine.easeIn
				});
			}

		};
	};
})();
