(function() {
	'use strict';

	angular
		.module('booklistwidth')
	  	.directive('bookListWidth', bookListWidth);

	/* @ngInject */
	function bookListWidth($timeout) {
		var directive = {

			link: link,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs){

			$timeout(function() {
				resizeWidth(element);
			}, 0);

			$(window).on('resize', function() {
				resizeWidth(element);
			});

		};
	};

	function resizeWidth(element) {
		var initWidth = element.parent().outerWidth();
		var bookWidth = element.find('LI')[0].clientWidth;
		var numberPerRow = Math.floor(initWidth / bookWidth);

		element.css('max-width', (numberPerRow * bookWidth) + 'px');
	}

})();
