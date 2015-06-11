(function () {
	'use strict';

	angular
		.module('tPositionizer')
		.factory('tPositionizer', tPositionizer);

	/* @ngInject */
	function tPositionizer($document, $window) {

		return {
			position: position,
			offset: offset,
			positionElements: positionElements
		};

		function position(el) {
			var elBCR = offset(el);
			var offsetParentBCR = { top: 0, left: 0 };
			var offsetParentEl = _parentOffsetElement(el[0]);
			if (offsetParentEl !== $document[0]) {
				offsetParentBCR = offset(angular.element(offsetParentEl));
				offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
				offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
			}

			var boundingClientRect = el[0].getBoundingClientRect();
			return {
				width: boundingClientRect.width || el.prop('offsetWidth'),
				height: boundingClientRect.height || el.prop('offsetHeight'),
				top: elBCR.top - offsetParentBCR.top,
				left: elBCR.left - offsetParentBCR.left
			};
		}

		function offset(el) {
			var boundingClientRect = el[0].getBoundingClientRect();
			return {
				width: boundingClientRect.width || el.prop('offsetWidth'),
				height: boundingClientRect.height || el.prop('offsetHeight'),
				top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
				left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
			};
		}

		function positionElements(hostEl, targetEl, positionStr, appendToBody) {
			var positionStrParts = positionStr.split('-');
			var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

			var hostElPos,
				targetElWidth,
				targetElHeight,
				targetElPos;

			hostElPos = appendToBody ? offset(hostEl) : position(hostEl);

			targetElWidth = targetEl.prop('offsetWidth');
			targetElHeight = targetEl.prop('offsetHeight');

			var shiftWidth = {
				center: function () {
					return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
				},
				left: function () {
					return hostElPos.left;
				},
				right: function () {
					return hostElPos.left + hostElPos.width;
				}
			};

			var shiftHeight = {
				center: function () {
					return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
				},
				top: function () {
					return hostElPos.top;
				},
				bottom: function () {
					return hostElPos.top + hostElPos.height;
				}
			};

			switch (pos0) {
				case 'right':
					targetElPos = {
						top: shiftHeight[pos1](),
						left: shiftWidth[pos0]()
					};
					break;
				case 'left':
					targetElPos = {
						top: shiftHeight[pos1](),
						left: hostElPos.left - targetElWidth
					};
					break;
				case 'bottom':
					targetElPos = {
						top: shiftHeight[pos0](),
						left: shiftWidth[pos1]()
					};
					break;
				default:
					targetElPos = {
						top: hostElPos.top - targetElHeight,
						left: shiftWidth[pos1]()
					};
					break;
			}

			return targetElPos;
		}

		function _getStyle(el, cssprop) {
			if (el.currentStyle) { //IE
				return el.currentStyle[cssprop];
			} else if ($window.getComputedStyle) {
				return $window.getComputedStyle(el)[cssprop];
			}
			// finally try and get inline style
			return el.style[cssprop];
		}

		function _isStaticPositioned(el) {
			return (_getStyle(el, 'position') || 'static' ) === 'static';
		}

		function _parentOffsetElement(el) {
			var docDomEl = $document[0];
			var offsetParent = el.offsetParent || docDomEl;
			while (offsetParent && offsetParent !== docDomEl && _isStaticPositioned(offsetParent) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docDomEl;
		}
	}

})();
