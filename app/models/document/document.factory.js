(function () {
	'use strict';

	angular
		.module('document')
		.factory('Document', Document);

	/* @ngInject */
	function Document(DS) {

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
