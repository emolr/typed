(function () {
	'use strict';

	angular
		.module('tDropdown')
		.service('tDropdownService', tDropdownService);

	/* @ngInject */
	function tDropdownService($document, $rootScope) {

		var openScope = null;

		return {
			open: open,
			close: close
		};

		function open(scope) {

			if(!openScope) {
				$document.bind('click', _closeDropdown);
				$document.bind('keydown', _bindEscapeKey);
			}

			if(openScope && openScope !== scope) {
				openScope.isOpen = false;
			}

			openScope = scope;

		}

		function close(scope) {

			if(openScope === scope) {
				openScope = null;
				$document.unbind('click', _closeDropdown);
				$document.unbind('keydown', _bindEscapeKey);
			}

		}

		function _closeDropdown(event) {

			if(!openScope) {
				return;
			}

			if(event && openScope.getAutoClose() === 'disabled') {
				return;
			}

			var toggleElement = openScope.getToggleElement();

			if(event && toggleElement[0].contains(event.target)) {
				return;
			}

			var $element = openScope.getElement();
			if(event && openScope.getAutoClose() === 'outsideClick' && $element && $element[0].contains(event.target)) {
				return;
			}

			openScope.isOpen = false;

			if(!$rootScope.$$phase) {
				openScope.$apply();
			}

		}

		function _bindEscapeKey(event) {
			if(event.which === 27) {
				openScope.focusToggleElement();
				_closeDropdown();
			}
		}

	}

})();
