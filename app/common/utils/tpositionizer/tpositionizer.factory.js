(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name tPositionizer
	 * @author Dennis Haulund Nielsen
	 *
	 * @description
	 * Factory that constructs objects for use when reading/writing positioning for DOM nodes.
	 * Based on https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js
	 */

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

		/**
		 * @ngdoc method
		 * @name tPositionizer.position
		 * @kind function
		 *
		 * @description
		 * Returns a read-only equivalent of jQuery's position function
		 *
		 * @param {DOMElement} el
		 * @returns {Object}
		 */
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

		/**
		 * @ngdoc method
		 * @name tPositionizer.offset
		 * @kind function
		 *
		 * @description
		 * Returns a read-only equivalent of jQuery's offset function
		 *
		 * @param {DOMElement} el
		 * @returns {Object}
		 */
		function offset(el) {
			var boundingClientRect = el[0].getBoundingClientRect();
			return {
				width: boundingClientRect.width || el.prop('offsetWidth'),
				height: boundingClientRect.height || el.prop('offsetHeight'),
				top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
				left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
			};
		}

		/**
		 * @ngdoc method
		 * @name tPositionizer.positionElements
		 * @kind function
		 *
		 * @description
		 * Returns an object with coordinates for the targetEl in relation to the hostEl
		 *
		 * A dash seperated string determines where to position the element, the syntax is:
		 * [horizontal-position]-[vertical-position]
		 * For horizontal the following positions are available: left, center, right
		 * For vertical the following positions are available: top, center, bottom
		 *
		 * @param {DOMElement} hostEl
		 * @param {DOMElement} targetEl
		 * @param {String} positionStr
		 * @param {Boolean} appendToBody
		 * @param {Boolean} forceLayout
		 * @returns {Object}
		 */
		function positionElements(hostEl, targetEl, positionStr, appendToBody, forceLayout) {
			/*jshint maxcomplexity:false */
			var prePos = positionStr.split('|');
			var preRules, horRule, verRule;
			if(prePos.length > 1) {
				preRules = prePos[1].split('-');
				horRule = preRules[0];
				verRule = preRules[1];
			}

			var pos = prePos[0];

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
					display: 'block',
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
					if(horRule === 'inside') {
						return hostElPos.left;
					}
					return hostElPos.left - targetElWidth;
				},
				right: function () {
					if(horRule === 'inside') {
						return (hostElPos.left + hostElPos.width) - targetElWidth;
					}
					return hostElPos.left + hostElPos.width;
				}
			};

			var shiftHeight = {
				center: function () {
					return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
				},
				top: function () {
					if(verRule === 'inside') {
						return hostElPos.top;
					}
					return hostElPos.top - targetElHeight;
				},
				bottom: function () {
					if(verRule === 'inside') {
						return (hostElPos.top + hostElPos.height) - targetElHeight;
					}
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
