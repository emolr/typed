(function () {
	'use strict';

	angular
		.module('tDropdown')
		.controller('tDropdownController', tDropdownController);

	/* @ngInject */
	function tDropdownController(
		$scope, $attrs, $parse, $animate, $document, $compile, $templateRequest,
		tDropdownService
		//tPositionizer
	) {
		/*jshint validthis: true */
		var vm = this;

		// This should be moved to a provider
		var config = {
			openClass: 'dropdown--open',
			placeholderClass: 'dropdown__placeholder'
		};

		/*
			Since this directive does not use an isolate scope, we create
			one anyways, but in a much lighter version.

			This is to keep the "view" scope uncluttered and to avoid clashes
		 */
		var childScope = $scope.$new();

		var templateScope, oldElement;

		// Element Attribute getter/setter
		var getAttributeIsOpen;
		var setAttributeIsOpen = angular.noop;

		// These methods are "public"
		vm.activate 	= activate;
		vm.toggle 		= toggle;
		vm.isOpen		= isOpen;

		// These methods are "private" to this directive and all it's children
		childScope.getToggleElement 	= getToggleElement;
		childScope.getAutoClose 		= getAutoClose;
		childScope.getElement			= getElement;
		childScope.focusToggleElement	= focusToggleElement;

		// Initialization
		function activate(element) {

			vm.$element = element;

			if($attrs.isOpen) {

				// Attribute Getter
				getAttributeIsOpen = $parse($attrs.isOpen);
				// Attribute Setter
				setAttributeIsOpen = getAttributeIsOpen.assign;

				// Watch the Attribute
				$scope.$watch(getAttributeIsOpen, function(value) {
					childScope.isOpen = !!value;
				});

			}

		}

		// Watch the childscope isOpen boolean
		childScope.$watch(function() {

			return childScope.isOpen;

		}, function(isOpen, wasOpen) {

			// Use ngAnimate to toggle the openClass (see docs for ngAnimate + css classes)
			$animate[isOpen ? 'addClass' : 'removeClass'](vm.$element, config.openClass);

			if(isOpen) {
				// Compile and update dom with the provided template
				if(vm.dropdownMenuTemplateUrl) {
					$templateRequest(vm.dropdownMenuTemplateUrl).then(function(tpl) {

						templateScope = $scope.$new();

						$compile(tpl.trim())(templateScope, function(dropdownElement) {
							var newElement = dropdownElement;
							vm.dropdownMenu.replaceWith(newElement);
							vm.dropdownMenu = newElement;
						});

					});
				}

				childScope.focusToggleElement();
				tDropdownService.open(childScope);
			} else {

				if (vm.dropdownMenuTemplateUrl) {
					if(templateScope) {
						templateScope.$destroy();
					}

					// Replace with placeholder
					var newEl = angular.element('<ul class="' + config.placeholderClass + '"></ul>');
					vm.dropdownMenu.replaceWith(newEl);
					vm.dropdownMenu = newEl;
				}

				tDropdownService.close(childScope);
			}

			setAttributeIsOpen($scope, isOpen);

		});

		// Bind Events
		$scope.$on('$locationChangeSuccess', function() {
			if(childScope.getAutoClose() !== 'disabled') {
				childScope.isOpen = false;
			}
		});
		$scope.$on('$destroy', function() {
			childScope.$destroy();
		});

		// "Root" scope methods
		function toggle(open) {
			// If argument is provided use this, otherwise do the opposite of the childScopes current state
			return childScope.isOpen = arguments.length ? !!open : !childScope.isOpen;
		}

		function isOpen() {
			return childScope.isOpen;
		}

		// "Child" scope methods
		function getToggleElement() {
			return vm.toggleElement;
		}

		function getAutoClose() {
			return $attrs.autoClose || 'always';
		}

		function getElement() {
			return vm.$element;
		}

		function focusToggleElement() {
			// If the DOM toggleElement is defined, focus it
			if(vm.toggleElement) {
				vm.toggleElement[0].focus();
			}
		}
	}

})();
