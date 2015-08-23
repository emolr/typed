(function() {
	'use strict';

	angular
		.module('animate-to-book')
	  	.directive('animateToBook', animateToBook);

	/* @ngInject */
	function animateToBook() {
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

				var tempEl = createAnchorNode();

				// Append the newly created DIV to body
				document.getElementsByTagName('body')[0].appendChild(tempEl);


				// Create a timeline for animating the temp overlay in,
				// and fade it out and destroy afterwards.
				var tlOverlay = new TimelineMax();

				tlOverlay.to(tempEl, 0.6, {
					delay: 0.4,
					y: '-100%',
					ease: Power2.easeOut,
					onComplete: function() {
						scope.endFn()
					}
				})
					.to(tempEl, 1, {
						delay: 0.2,
						opacity: 0,
						ease: Power1.easeOut,
						onComplete: function() {
							tempEl.remove();
						}
				})


				// Animate the whole book list downwards
				var bookList = document.getElementsByClassName('book-list');

				TweenMax.to(bookList, 0.7, {
					y: '100px',
					scale: '0.95',
					ease: Power2.easeIn,
					transformOrigin: 'left bottom'
				});


				// Fade out the toolbar in the transition
				var toolbar = document.getElementsByClassName('documents__toolbar');

				TweenMax.to(toolbar, 0.7, {
					opacity: 0,
					ease: Sine.easeOut
				});


			}); // click function end

		}

	}

	function createAnchorNode() {
		var newAnchorEl = document.createElement('DIV');

		newAnchorEl.style.position = 'fixed';
		newAnchorEl.style.zIndex = '9999';
		newAnchorEl.style.width = '100vw';
		newAnchorEl.style.height = '100vh';
		newAnchorEl.style.top = '100vh';
		newAnchorEl.style.right = '0';
		newAnchorEl.style.bottom = '0';
		newAnchorEl.style.left = '0';
		newAnchorEl.style.backgroundColor = '#fff';
		newAnchorEl.style.pointerEvents = 'none';

		console.log('created');
		return newAnchorEl;
	}

})();
