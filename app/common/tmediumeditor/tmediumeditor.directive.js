(function() {
	'use strict';

	angular
		.module('tMediumEditor')
	  	.directive('tMediumEditor', tMediumEditor);

	/* @ngInject */
	function tMediumEditor(MediumEditor, $timeout) {

		var editor;

		var options = {};
		var placeholder = '';

		var directive = {
            require: ['ngModel', 'tMediumEditor'],
			link: {
				pre: preLink,
				post: postLink
			},
			controller: controller,
			restrict: 'EA'
		};

		return directive;

		function preLink(scope, element, attrs, controllers) {

			var directiveController = controllers[1];

			// Attributes are parsed as strings, convert to object
			if(attrs.options) {
				options = scope.$eval(attrs.options);
			}

			placeholder = options.placeholder;

			editor = new MediumEditor(element, options);

			angular.forEach(directiveController, function(val, key) {
				editor[key] = val;
			});

			var scopeTree = attrs.tMediumEditor.split('.');
			scope[scopeTree[0]][scopeTree[1]] = editor;

		}

		function postLink(scope, element, attrs, controllers){

			// Assign injected controllers to variables for sanity
			var ngModel = controllers[0];

			var onChange = function() {

				// If user cleared the whole text, we have to reset the editor because MediumEditor
				// lacks an API method to alter placeholder after initialization
				if (element.html() === '<p><br></p>' || element.html() === '') {
					options.placeholder = placeholder;
					editor.setup();
				}

				ngModel.$setViewValue(element.html());

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
				if(!editor) {
					// If a value is present in the model, remove the placeholder from the mediumEditor options
					if(!ngModel.$isEmpty(ngModel.$viewValue)) {
						options.placeholder = '';
					}
					editor.setup();
				}

				element.html(ngModel.$isEmpty(ngModel.$viewValue) ? '' : ngModel.$viewValue);

				if(!ngModel.$isEmpty(ngModel.$viewValue)) {
					angular.element(element).removeClass('medium-editor-placeholder');
				}

				// Focus the editor :-)
				element.focus();

			};

			scope.$on('$destroy', function() {
				element.off(bindEvents);
			});

		}

		function controller($scope, $element, $attrs) {
			/*jshint validthis:true */
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

		function _resetEditor(element) {
			editor.destroy();
			editor = undefined;
			editor = new MediumEditor(element, options);
		}
	}
})();
