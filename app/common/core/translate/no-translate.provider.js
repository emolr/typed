(function() {
	'use strict';

	angular
		.module('core.translate.provider', [])
		.provider('translate', translate);

	/* @ngInject */
	function translate() {

		var defaults = {
			root: null,
			endpoint: 'translation',
			project: null,
			platformId: null,
			languageId: null
		};

		this.configure = function(config) {
			angular.extend(defaults, config);
		};

		this.$get = [function() {
			return {
				settings: defaults
			};
		}];
	};

})();
