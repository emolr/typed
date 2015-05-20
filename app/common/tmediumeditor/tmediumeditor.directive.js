(function() {
	'use strict';

	angular
		.module('tMediumEditor')
	  	.directive('tMediumEditor', tMediumEditor);

	/* @ngInject */
	function tMediumEditor(MediumEditor, $timeout) {
		var directive = {
            require: ['ngModel', 'tMediumEditor'],
			link: link,
			controller: controller,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs, controllers){

			// Assign injected controllers to variables for sanity
			var ngModel = controllers[0];
			var directiveController = controllers[1];

			var options = {};
			var placeholder = '';

			var initOptions = function() {
				// Attributes are parsed as strings, convert to object
				if(attrs.options) {
					options = scope.$eval(attrs.options);
				}
				placeholder = options.placeholder;

				// Create new Medium Editor instance
				var mediumEditor = new MediumEditor(element, options);

				// Attach Directive Controller methods to Medium Editor instance
				angular.forEach(directiveController, function(val, key) {
					mediumEditor[key] = val;
				});

				// Find the "controllerAs" path, attach the Medium Editor to it
				// ie. given <t-medium-editor="documents.editor">,
				// the mediumEditor instance will be attached to scope.documents.editor.
				var scopeTree = attrs.tMediumEditor.split('.');
				scope[scopeTree[0]][scopeTree[1]] = mediumEditor;

			};

			var onChange = function() {

				scope.$apply(function() {

					// If user cleared the whole text, we have to reset the editor because MediumEditor
					// lacks an API method to alter placeholder after initialization
					if (element.html() === '<p><br></p>' || element.html() === '') {
						options.placeholder = placeholder;
						initOptions();
					}

					ngModel.$setViewValue(element.html());

				});

			};

			/*
				View > Model
			 */
			// Get configured "updateOn" events
			var bindEvents = ngModel.$options.updateOn;
			// If updateOnDefault, we add the "input" event, to the events we listen to
			if(ngModel.$options.updateOnDefault) {
				bindEvents += ' input';
			}

			// Bind events
			element.on(bindEvents, onChange);

			/*
				Model > View
			 */
			ngModel.$render = function() {
				// On initial render of ngModel, if there's no mediumEditor yet - boot it up!
				if(!this.editor) {
					// If a value is present in the model, remove the placeholder from the mediumEditor options
					if(!ngModel.$isEmpty(ngModel.$viewValue)) {
						options.placeholder = '';
					}
					initOptions();
				}

				element.html(ngModel.$isEmpty(ngModel.$viewValue) ? '' : ngModel.$viewValue);

				if(!ngModel.$isEmpty(ngModel.$viewValue)) {
					angular.element(element).removeClass('medium-editor-placeholder');
				}
			};

			scope.$on('$destroy', function() {
				element.off(bindEvents);
			});

		}


		function controller($document, $scope, $element, $attrs) {
			var vm = this;

			/**
			 * Returns the first DOM Node in the editor, or it's text.
			 * @param stripHtml
			 * @returns {*} DOM Node or String
			 */
			vm.parseTitle = function(stripHtml) {
				return _returnFirstChildNode(stripHtml);
			};

			/**
			 * Set focus on the editor
			 */
			vm.focus = function() {
				$element.focus();
			};

			/*
				Private methods
			 */

			/**
			 *
			 * @returns {*} Editor Instance
			 * @private
			 */
			function _getEditor() {
				var scopeTree = $attrs.tMediumEditor.split('.');
				return $scope[scopeTree[0]][scopeTree[1]];
			}

			/**
			 * Returns the first DOM Node in the editor, or it's text.
			 * @param stripHtml
			 * @returns {*}
			 * @private
			 */
			function _returnFirstChildNode(stripHtml) {
				var editor = _getEditor();
				var firstChildNode = editor.elements[0].children[0];

				if(!firstChildNode) {
					return '';
				}

				if(stripHtml) {
					return firstChildNode.textContent;
				}

				return firstChildNode;
			}

		}
	}
})();
