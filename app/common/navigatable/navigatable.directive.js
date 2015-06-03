(function() {
	'use strict';

	angular
		.module('navigatable')
	  	.directive('navigatable', navigatable);

	/* @ngInject */
	function navigatable() {
		var directive = {

			link: link,
			restrict: 'A'
		};

		return directive;

		function link(scope, element, attrs){
			var listItems = element.children().find('a');
			var activeItem = 0;

			// Initially focus the first dropdown item
			listItems[activeItem].focus();

			// Set focus on mouseover of an element
			listItems.on('mouseover', function() {
				this.focus();
				activeItem = getIndex(this, listItems);
			});

			element.on('keydown', function(e) {
				if(e.which == 40) { // down
					if (activeItem <= listItems.length - 2) {
						activeItem += 1;
						listItems[activeItem].focus();
					}

					return false;
				}

				if(e.which == 38) { // up
					if(activeItem > 0) {
						activeItem -= 1;
						listItems[activeItem].focus();
					}

					return false;
				}

				if(e.which == 13) { // enter
					console.log('Enter is pressed');
				}
			});


			function getIndex(node, list) {
				for (var i = 0, len = list.length; i < len; i++) {
					if (node == list[i]) {
						return i;
					}
				}
			}

		};
	};
})();
