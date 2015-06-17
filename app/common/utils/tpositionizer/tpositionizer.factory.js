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

		function positionElements(hostEl, targetEl, positionStr, appendToBody, forceLayout) {

			var pos = positionStr;

			var hostElPos,
				targetElWidth,
				targetElHeight,
				targetElPos;

			hostElPos = appendToBody ? offset(hostEl) : position(hostEl);

			if(forceLayout) {
				var ghostEl = targetEl.clone(false);
				ghostEl.css({
					visibility: 'hidden',
					position: 'absolute',
					left: '-9999px'
				});
				ghostEl.appendTo('body');
				targetElWidth = ghostEl.prop('offsetWidth');
				targetElHeight = ghostEl.prop('offsetHeight');
				ghostEl.remove();
			} else {
				targetElWidth = targetEl.prop('offsetWidth');
				targetElHeight = targetEl.prop('offsetHeight');
			}

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

			/*
				hor - ver
			 */
			switch(pos) {
				case 'left-bottom':
					targetElPos = {
						left: shiftWidth['left'](),
						top: shiftHeight['bottom']()
					};
					break;
				case 'center-bottom':
					targetElPos = {
						left: shiftWidth['center'](),
						top: shiftHeight['bottom']()
					};
					break;
				case 'right-bottom':
					targetElPos = {
						left: shiftWidth['right'](),
						top: shiftHeight['bottom']()
					};
					break;
				case 'left-center':
					targetElPos = {
						left: shiftWidth['left'](),
						top: shiftHeight['center']()
					};
					break;
				case 'center-center':
					targetElPos = {
						left: shiftWidth['center'](),
						top: shiftHeight['center']()
					};
					break;
				case 'right-center':
					targetElPos = {
						left: shiftWidth['right'](),
						top: shiftHeight['center']()
					};
					break;
				case 'left-top':
					targetElPos = {
						left: shiftWidth['left'](),
						top: shiftHeight['top']()
					};
					break;
				case 'center-top':
					targetElPos = {
						left: shiftWidth['center'](),
						top: shiftHeight['top']()
					};
					break;
				case 'right-top':
					targetElPos = {
						left: shiftWidth['right'](),
						top: shiftHeight['top']()
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
