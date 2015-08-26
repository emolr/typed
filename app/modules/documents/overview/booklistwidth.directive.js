(function() {
	'use strict';

	angular
		.module('booklistwidth')
	  	.directive('bookListWidth', bookListWidth);

	/* @ngInject */
	function bookListWidth() {
		var directive = {
            
			link: link,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs){
			element.text('this is the bookListWidth directive');
		};
	};
})();
