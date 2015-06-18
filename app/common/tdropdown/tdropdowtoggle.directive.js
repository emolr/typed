(function() {
	'use strict';

	angular
		.module('tDropdown')
	  	.directive('tDropdownToggle', tDropdownToggle);

	/* @ngInject */
	function tDropdownToggle() {
		var directive = {
			require: '?^tDropdown',
			link: link,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs, tDropdownController){

			// Failsafe - if we don't have a controller, that means the wrapper directive isnt present
			if(!tDropdownController) {
				return;
			}
			tDropdownController.toggleElement = element;

			var toggleDropdown = function(event) {
				event.preventDefault();

				if(!element.hasClass('disabled') && !attrs.disabled) {
					scope.$apply(function() {
						tDropdownController.toggle();
					});
				}

			};

			element.bind('click', toggleDropdown);

			// WAI-ARIA
			element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
			scope.$watch(tDropdownController.isOpen, function( isOpen ) {
				element.attr('aria-expanded', !!isOpen);
			});

			scope.$on('$destroy', function() {
				element.unbind('click', toggleDropdown);
			});

		}
	}
})();
