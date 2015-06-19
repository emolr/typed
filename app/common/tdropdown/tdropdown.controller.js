(function () {
	'use strict';

	angular
		.module('tDropdown')
		.controller('tDropdownController', tDropdownController);

	/* @ngInject */
	function tDropdownController(
		$scope, $attrs, $parse, $animate, $document, $compile, $templateRequest, $timeout,
		tDropdownService,
		tPositionizer
	) {
		/*jshint validthis: true */
		/*jshint maxcomplexity:false */

		var vm = this;

		var config = {
			wrapperOpenClass: 't-dropdown--open',
			wrapperAppendToBodyClass: 't-dropdown--apend-to-body',
			wrapperAppendToElementClass: 't-dropdown--append-to-element',

			toggleActiveClass: 't-dropdown__active',

			contentOpenClass: 't-dropdown__content--open',
			contentItemClass: 't-dropdown__menu-item',
			contentItemActiveClass: 't-dropdown__menu-item--active'
		};

		var getAttributeClassConfig = $parse($attrs.tDropdownClassConfig);

		// Overwrite config if the user has overwritten any key via an attribute
		if(getAttributeClassConfig($scope)) {
			var userConfig = getAttributeClassConfig($scope);
			for(var key in userConfig) {
				if(userConfig.hasOwnProperty(key)) {
					config[key] = userConfig[key];
				}
			}
		}

		// tPositionizer position combination
		var appendToBodyPosition = $attrs.tDropdownContentPosition || 'left-bottom';

		/*
			Since this directive does not use an isolate scope, we create
			one anyways, but in a much lighter version.

			This is to keep the "view" scope uncluttered and to avoid clashes
		 */
		var childScope = $scope.$new();

		var templateScope;

		var appendToBody = false;

		var enableContentNavigation = false;

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
		childScope.getContentElement	= getContentElement;
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

			// Should the content be navigatable and focus-able?
			enableContentNavigation = ($attrs.tDropdownContentNavigatable === 'true');

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
		}, function(isOpen) {

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
								$animate.enter(dropdownElement, document.body, document.body.lastChild)
									.then(function() {

										vm.dropdownContent = dropdownElement;

										if(enableContentNavigation) {
											_registerNavigation();
										}

									});

								var pos = tPositionizer.positionElements(
									vm.$element,
									dropdownElement,
									appendToBodyPosition, true, true);

								dropdownElement.css({
									top: pos.top + 'px',
									left: pos.left + 'px',
									position: 'absolute'
								});

								dropdownElement.addClass(config.contentOpenClass);

							} else {
								$animate.enter(dropdownElement, vm.$element, vm.toggleElement)
									.then(function() {
										if(enableContentNavigation) {
											_registerNavigation();
										}
									});
							}

						});

					});
				}
				// If the content is not navigatable, we focus the toggle element
				if(!enableContentNavigation) {
					childScope.focusToggleElement();
				}

				if(enableContentNavigation && !appendToBody) {
					vm.dropdownContentItems = vm.dropdownContent.find('.' + config.contentItemClass);
					vm.activeContentItem = focusContentElement(vm.dropdownContentItems[0]);
					vm.dropdownContentItems.bind('mouseover', _setActiveContentItem);
					$document.bind('keydown', _bindNavigationKeys);
				}

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

				vm.dropdownContentItems = vm.activeContentItem = undefined;
				$document.unbind('keydown', _bindNavigationKeys);

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
			if ($attrs.tDropdownTemplateUrl) {
				if(templateScope) {
					// Destroy the template scope, and animate the menu out
					templateScope.$destroy();
					$animate.leave(vm.dropdownContent);
				}
			}
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

		function getContentElement() {
			return vm.dropdownContent;
		}

		function focusToggleElement() {
			// If the DOM toggleElement is defined, focus it
			if(vm.toggleElement) {
				vm.toggleElement[0].focus();
			}
		}

		function focusContentElement(element) {
			element = angular.element(element);
			var activeElements = element.parent().find('.' + config.contentItemActiveClass);

			// Find all elements with the active class and remove them && and add it to the current.
			activeElements.removeClass(config.contentItemActiveClass);
			element.addClass(config.contentItemActiveClass);
			element.find('a').focus();
			return element;
		}

		function _setActiveContentItem() {
			vm.activeContentItem = focusContentElement(this);
		}

		function _bindNavigationKeys(event) {

			if(event.which === 40) {
				if(vm.activeContentItem.next().length > 0) {

					// Skip the next item if it is not a menu item
					if (!vm.activeContentItem.next().hasClass(config.contentItemClass)) {
						vm.activeContentItem = focusContentElement(vm.activeContentItem.next().next());
					} else {
						vm.activeContentItem = focusContentElement(vm.activeContentItem.next());
					}
				}
			}
			if(event.which === 38) {
				if(vm.activeContentItem.prev().length > 0) {

					// Skip the prev item if it is not a menu item
					if (!vm.activeContentItem.prev().hasClass(config.contentItemClass)) {
						vm.activeContentItem = focusContentElement(vm.activeContentItem.prev().prev());
					} else {
						vm.activeContentItem = focusContentElement(vm.activeContentItem.prev());
					}
				}
			}
		}

		function _registerNavigation() {
			vm.dropdownContentItems = vm.dropdownContent.find('.' + config.contentItemClass);
			vm.activeContentItem = focusContentElement(vm.dropdownContentItems[0]);
			vm.dropdownContentItems.bind('mouseover', _setActiveContentItem);
			$document.bind('keydown', _bindNavigationKeys);
		}

	}

})();
