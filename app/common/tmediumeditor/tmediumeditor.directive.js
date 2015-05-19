(function() {
	'use strict';

	angular
		.module('tMediumEditor')
	  	.directive('tMediumEditor', tMediumEditor);

	/* @ngInject */
	function tMediumEditor(MediumEditor) {
		var directive = {
            require: 'ngModel',
			link: link,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs, ngModel){

			var options = {};
			var placeholder = '';

			// Attributes are parsed as strings, convert to object
			if(attrs.options) {
				options = scope.$eval(attrs.options);
			}
			placeholder = options.placeholder;

			if(angular.isDefined(scope.bindOptions)) {
				options = angular.extend(options, scope.bindOptions);
			}

			/*
				This methods uses scope.$apply
			 */
			var onChange = function() {

				scope.$apply(function() {

					// If user cleared the whole text, we have to reset the editor because MediumEditor
					// lacks an API method to alter placeholder after initialization
					if (element.html() === '<p><br></p>' || element.html() === '') {
						options.placeholder = placeholder;
						var editor = new MediumEditor(element, options);
					}

					ngModel.$setViewValue(element.html());

				});

			};

			/*
				View > Model
			 */
			var bindEvents = ngModel.$options.updateOn;

			if(ngModel.$options.updateOnDefault) {
				bindEvents += ' input';
			}


			element.on(bindEvents, onChange);

			/*
				Model > View
			 */
			ngModel.$render = function() {
				if(!this.editor) {
					if(!ngModel.$isEmpty(ngModel.$viewValue)) {
						options.placeholder = '';
					}

					this.editor = new MediumEditor(element, options);
				}

				element.html(ngModel.$isEmpty(ngModel.$viewValue) ? '' : ngModel.$viewValue);

				if(!ngModel.$isEmpty(ngModel.$viewValue)) {
					angular.element(element).removeClass('medium-editor-placeholder');
				}
			};

		}
	}
})();
