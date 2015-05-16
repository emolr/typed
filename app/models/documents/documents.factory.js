(function () {
	'use strict';

	angular
		.module('documents')
		.factory('Documents', Documents);

	/* @ngInject */
	function Documents(DS) {

		return DS.defineResource({
			name: 'Document',
			beforeCreate: beforeCreate,
			beforeUpdate: beforeUpdate
		});


		function beforeCreate (resource, data, cb) {
			data.created = Date.now();
			data.touched = Date.now();

			cb(null, data);
		}


		function beforeUpdate (resource, data, cb) {
			data.modified = Date.now();
			data.touched = Date.now();

			cb(null, data);
		}

	};

})();
