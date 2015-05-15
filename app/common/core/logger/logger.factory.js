(function () {
	'use strict';

	angular
		.module('core.logger', [])
		.factory('logger', logger);

	/* @ngInject */
	function logger($log, toastr) {

		var service = {
			showToasts: true,

			error   : error,
			info    : info,
			success : success,
			warning : warning,

			// straight to console; bypass toastr
			log     : $log.log
		};

		var toastrOptions = {
			tapToDismiss: true,
			toastClass: 'alert-box',
			containerId: 'toast',
			debug: false,

			showMethod: 'fadeIn', //fadeIn, slideDown, and show are built into jQuery
			showDuration: 300,
			showEasing: 'swing', //swing and linear are built into jQuery
			onShown: undefined,
			hideMethod: 'fadeOut',
			hideDuration: 600,
			hideEasing: 'swing',
			onHidden: undefined,

			extendedTimeOut: 0,
			iconClasses: {
				error: 'alert',
				info: 'info',
				success: 'success',
				warning: 'warning'
			},
			iconClass: 'fa',
			positionClass: 'fixed',
			timeOut: 0, // Set timeOut and extendedTimeOut to 0 to make it sticky
			titleClass: 'title',
			messageClass: 'message',
			target: 'body',
			closeButton: true,
			closeHtml: '<a class="close">&times;</a>',
			newestOnTop: true,
			preventDuplicates: true
		};

		return service;
		/////////////////////

		function error(message, data, title) {
			toastr.options = toastrOptions;
			toastr.error(message, title);
			$log.error('Error: ' + message, data);
		}

		function info(message, data, title) {
			toastr.options = toastrOptions;
			toastr.info(message, title);
			$log.info('Info: ' + message, data);
		}

		function success(message, data, title) {
			toastr.options = toastrOptions;
			toastr.success(message, title);
			$log.info('Success: ' + message, data);
		}

		function warning(message, data, title) {
			toastr.options = toastrOptions;a
			toastr.warning(message, title);
			$log.warn('Warning: ' + message, data);
		}

	};

})();
