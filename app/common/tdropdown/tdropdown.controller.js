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

		var config = {
			wrapperOpenClass: 't-dropdown--open',
			wrapperAppendToBodyClass: 't-dropdown--apend-to-body',
			wrapperAppendToElementClass: 't-dropdown--append-to-element',

			toggleActiveClass: 't-dropdown__active',

			contentOpenClass: 't-dropdown__content--open'
		};

		var getAttributeClassConfig = $parse($attrs.tDropdownClassConfig);

		// Overwrite config if the user has overwritten any key via an attribute
		if(getAttributeClassConfig($scope)) {
			var userConfig = getAttributeClassConfig($scope);
			for(var i in userConfig) {
				if(config.hasOwnProperty(i)) {
					config[i] = userConfig[i];
				}
			}
		}

		/*
			When appending the content to the body, we need to position it absolutely.

			A dash seperated string determines where to position the element, the syntax is:
			[horizontal-position]-[vertical-position]

			For horizontal the following positions are available: left, center, right
			For vertical the following positions are available: top, center, bottom
		 */
		var appendToBodyPosition = $attrs.tDropdownContentPosition || 'left-bottom';

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

			if(vm.dropdownContent && $attrs.tDropdownTemplateUrl) {
				throw 'Please use either an inline directive or a template-url, not both.';
			}

			vm.$element = element;

			if($attrs.tDropddownIsOpen) {

				// Attribute Getter
				getAttributeIsOpen = $parse($attrs.isOpen);
				// Attribute Setter
				setAttributeIsOpen = getAttributeIsOpen.assign;

				// Watch the Attribute
				$scope.$watch(getAttributeIsOpen, function(value) {
					childScope.isOpen = !!value;
				});

			}

			appendToBody = angular.isDefined($attrs.tDropdownAppendToBody);

			vm.$element.addClass(appendToBody ? config.wrapperAppendToBodyClass : config.wrapperAppendToElementClass);

			if ( appendToBody && vm.dropdownContent ) {

				$document.find('body').append(vm.dropdownContent);

				element.on('$destroy', function handleDestroyEvent() {
					vm.dropdownContent.remove();
				});

			}

		}

		// Watch the childscope isOpen boolean
		childScope.$watch(function() {
			return childScope.isOpen;
		}, function(isOpen, wasOpen) {

			if ( appendToBody && vm.dropdownContent ) {

				var pos = tPositionizer.positionElements(vm.$element, vm.dropdownContent, appendToBodyPosition, true, true);

				vm.dropdownContent.css({
					top: pos.top + 'px',
					left: pos.left + 'px',
					position: 'absolute'
				});
			}

			// Use ngAnimate to toggle the openClass (see docs for ngAnimate + css classes)
			// Root element (the "wrapper")
			$animate[isOpen ? 'addClass' : 'removeClass'](vm.$element, config.wrapperOpenClass);
			// Toggle element
			$animate[isOpen ? 'addClass' : 'removeClass'](vm.toggleElement, config.toggleActiveClass);

			if(vm.dropdownContent && !$attrs.templateUrl) {
				$animate[isOpen ? 'addClass' : 'removeClass'](vm.dropdownContent, config.contentOpenClass);
			}

			// It should open
			if(isOpen) {
				// Compile and animate the menu with the provided template
				if($attrs.tDropdownTemplateUrl) {
					$templateRequest($attrs.tDropdownTemplateUrl).then(function(tpl) {

						// Assign a scope to the new tempalte
						templateScope = $scope.$new();

						// Compile the template, and animate it, appending to the toggleElement
						$compile(tpl.trim())(templateScope, function(dropdownElement) {

							if(appendToBody) {
								$animate.enter(dropdownElement, document.body, document.body.lastChild);

								vm.dropdownContent = dropdownElement;
								vm.dropdownContent.addClass(config.contentOpenClass);

								var pos = tPositionizer.positionElements(vm.$element, vm.dropdownContent, appendToBodyPosition, true, true);

								vm.dropdownContent.css({
									top: pos.top + 'px',
									left: pos.left + 'px',
									position: 'absolute'
								});

							} else {
								$animate.enter(dropdownElement, vm.$element, vm.toggleElement);
							}
						});

					});
				}
				// Set focus on the toggle element (EMIL, DET ER HER DU SKAL JAMME MED DIN NAVIGATABLE)
				childScope.focusToggleElement();
				// Tell our service to register event listeners etc.
				tDropdownService.open(childScope);
			} else {

			// It should close
				if ($attrs.tDropdownTemplateUrl) {
					if(templateScope) {
						// Destroy the template scope, and animate the menu out
						templateScope.$destroy();
						$animate.leave(vm.dropdownContent);
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
