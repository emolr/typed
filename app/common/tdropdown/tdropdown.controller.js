(function () {
	'use strict';

	angular
		.module('tDropdown')
		.controller('tDropdownController', tDropdownController);

	/* @ngInject */
	function tDropdownController(
		$scope, $attrs, $parse, $animate, $document, $compile, $templateRequest,
		tDropdownService,
		tPositionizer
	) {
		/*jshint validthis: true */
		var vm = this;

		// This should be moved to a provider
		var config = {
			openClass: 'dropdown--open',
			menuOpenClass: 'dropdown__content--open',
			// TODO: toggleActiveClass?
			placeholderClass: 'dropdown__placeholder'
		};

		/*
			Since this directive does not use an isolate scope, we create
			one anyways, but in a much lighter version.

			This is to keep the "view" scope uncluttered and to avoid clashes
		 */
		var childScope = $scope.$new();

		var templateScope;

		var appendToBody = false;

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

			if(vm.dropdownMenu && $attrs.templateUrl) {
				throw 'Please use either an inline directive or a template-url, not both.';
			}

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

			appendToBody = angular.isDefined($attrs.appendToBody);

			if ( appendToBody && vm.dropdownMenu ) {

				$document.find('body').append( vm.dropdownMenu );

				element.on('$destroy', function handleDestroyEvent() {
					vm.dropdownMenu.remove();
				});

			}

		}

		// Watch the childscope isOpen boolean
		childScope.$watch(function() {

			return childScope.isOpen;

		}, function(isOpen, wasOpen) {

			if ( appendToBody && vm.dropdownMenu ) {

				// TODO: Bottom left? Skal du sq da ik bestemme din cunt
				var pos = tPositionizer.positionElements(vm.$element, vm.dropdownMenu, 'center-center', true);

				vm.dropdownMenu.css({
					top: pos.top + 'px',
					left: pos.left + 'px',
					visibility: isOpen ? 'visible' : 'hidden',
					position: 'absolute'
				});
			}

			// Use ngAnimate to toggle the openClass (see docs for ngAnimate + css classes)
			$animate[isOpen ? 'addClass' : 'removeClass'](vm.$element, config.openClass);

			// TODO: use ngAnimate to toggle a class on the menu, on everythin even?!
			if(vm.dropdownMenu && !$attrs.templateUrl) {
				$animate[isOpen ? 'addClass' : 'removeClass'](vm.dropdownMenu, config.menuOpenClass);
			}

			// It should open
			if(isOpen) {
				// Compile and animate the menu with the provided template
				if($attrs.templateUrl) {
					$templateRequest($attrs.templateUrl).then(function(tpl) {

						// Assign a scope to the new tempalte
						templateScope = $scope.$new();

						// Compile the template, and animate it, appending to the toggleElement
						$compile(tpl.trim())(templateScope, function(dropdownElement) {
							$animate.enter(dropdownElement, vm.$element, vm.toggleElement);
						});

					});
				}
				// Set focus on the toggle element (EMIL, DET ER HER DU SKAL JAMME MED DIN NAVIGATABLE)
				childScope.focusToggleElement();
				// Tell our service to register event listeners etc.
				tDropdownService.open(childScope);
			} else {

			// It should close
				if ($attrs.templateUrl) {
					if(templateScope) {
						// Destroy the template scope, and animate the menu out
						templateScope.$destroy();
						$animate.leave(vm.dropdownMenu);
					}
				}

				// Tell our service to deregister event listeners etc.
				tDropdownService.close(childScope);
			}

			// Update the open attribute (this also reflects to the WAI ARIA)
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
			childScope.isOpen = arguments.length ? !!open : !childScope.isOpen;
			return childScope.isOpen;
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
