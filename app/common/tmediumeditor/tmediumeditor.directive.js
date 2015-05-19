(function() {
	'use strict';

	angular
		.module('tMediumEditor')
	  	.directive('tMediumEditor', tMediumEditor);

	/* @ngInject */
	function tMediumEditor(MediumEditor) {
		var directive = {
            require: ['ngModel', 'tMediumEditor'],
			scope: { bindOptions: '=' },
			link: link,
			controller: controller,
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs, controllers){

			var ngModel = controllers[0];
			//var directiveController = controllers[1];

			var options = {};
			var placeholder = '';

			var initOptions = function() {
				// Attributes are parsed as strings, convert to object
				if(attrs.options) {
					options = scope.$eval(attrs.options);
				}

				if(angular.isDefined(scope.bindOptions)) {
					options = angular.extend(options, scope.bindOptions);
				}
				console.log(attrs.tMediumEditor)
				if(attrs.tMediumEditor) {
					console.log(attrs.tMediumEditor)
					console.log(attrs.tMediumEditor.split('.'));

					console.log(scope.$parent)

					//attrs.tMediumEditor = new MediumEditor(element, options);
				}

				placeholder = options.placeholder;
			};
			initOptions();

			//if(attrs.tMediumEditor) {
			//	scope.$parent[attrs.tMediumEditor].editor = new MediumEditor(element, options);
			//}

			/*
				This methods uses scope.$apply
			 */
			var onChange = function() {

				scope.$apply(function() {

					// If user cleared the whole text, we have to reset the editor because MediumEditor
					// lacks an API method to alter placeholder after initialization
					if (element.html() === '<p><br></p>' || element.html() === '') {
						options.placeholder = placeholder;
						//scope.$parent[attrs.tMediumEditor].editor = new MediumEditor(element, options);
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

					//scope.$parent[attrs.tMediumEditor].editor = new MediumEditor(element, options);
				}

				element.html(ngModel.$isEmpty(ngModel.$viewValue) ? '' : ngModel.$viewValue);

				if(!ngModel.$isEmpty(ngModel.$viewValue)) {
					angular.element(element).removeClass('medium-editor-placeholder');
				}
			};

		}

		function controller() {
			var vm = this;

			vm.test = function() {
				console.log('Test from directive controller');
			};

		}
	}
})();
