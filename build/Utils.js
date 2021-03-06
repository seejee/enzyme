Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SELECTOR = exports.isCompoundSelector = exports.ITERATOR_SYMBOL = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint no-use-before-define:0 */


exports.internalInstance = internalInstance;
exports.isFunctionalComponent = isFunctionalComponent;
exports.isCustomComponentElement = isCustomComponentElement;
exports.propsOfNode = propsOfNode;
exports.typeOfNode = typeOfNode;
exports.getNode = getNode;
exports.nodeHasType = nodeHasType;
exports.childrenMatch = childrenMatch;
exports.childrenEqual = childrenEqual;
exports.nodeMatches = nodeMatches;
exports.nodeEqual = nodeEqual;
exports.containsChildrenSubArray = containsChildrenSubArray;
exports.childrenToSimplifiedArray = childrenToSimplifiedArray;
exports.isReactElementAlike = isReactElementAlike;
exports.propFromEvent = propFromEvent;
exports.withSetStateAllowed = withSetStateAllowed;
exports.splitSelector = splitSelector;
exports.isPseudoClassSelector = isPseudoClassSelector;
exports.selectorError = selectorError;
exports.selectorType = selectorType;
exports.AND = AND;
exports.coercePropValue = coercePropValue;
exports.nodeHasProperty = nodeHasProperty;
exports.mapNativeEventNames = mapNativeEventNames;
exports.displayNameOfNode = displayNameOfNode;

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectIs = require('object-is');

var _objectIs2 = _interopRequireDefault(_objectIs);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _object = require('object.entries');

var _object2 = _interopRequireDefault(_object);

var _object3 = require('object.assign');

var _object4 = _interopRequireDefault(_object3);

var _functionPrototype = require('function.prototype.name');

var _functionPrototype2 = _interopRequireDefault(_functionPrototype);

var _reactCompat = require('./react-compat');

var _version = require('./version');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ITERATOR_SYMBOL = exports.ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;

function internalInstanceKey(node) {
  return Object.keys(Object(node)).filter(function (key) {
    return key.match(/^__reactInternalInstance\$/);
  })[0];
}

function internalInstance(inst) {
  return inst._reactInternalInstance || inst[internalInstanceKey(inst)];
}

function isFunctionalComponent(inst) {
  return !!inst && !!inst.constructor && typeof inst.constructor === 'function' && (0, _functionPrototype2['default'])(inst.constructor) === 'StatelessComponent';
}

function isCustomComponentElement(inst) {
  return !!inst && _react2['default'].isValidElement(inst) && typeof inst.type === 'function';
}

function propsOfNode(node) {
  if (_version.REACT013 && node && node._store) {
    return node._store.props || {};
  }
  if (node && node._reactInternalComponent && node._reactInternalComponent._currentElement) {
    return node._reactInternalComponent._currentElement.props || {};
  }
  if (node && node._currentElement) {
    return node._currentElement.props || {};
  }
  if (_version.REACT15 && node) {
    if (internalInstance(node) && internalInstance(node)._currentElement) {
      return internalInstance(node)._currentElement.props || {};
    }
  }

  return node && node.props || {};
}

function typeOfNode(node) {
  return node ? node.type : null;
}

function getNode(node) {
  return (0, _reactCompat.isDOMComponent)(node) ? (0, _reactCompat.findDOMNode)(node) : node;
}

function nodeHasType(node, type) {
  if (!type || !node) return false;
  if (!node.type) return false;
  if (typeof node.type === 'string') return node.type === type;
  return (typeof node.type === 'function' ? (0, _functionPrototype2['default'])(node.type) === type : node.type.name === type) || node.type.displayName === type;
}

function internalChildrenCompare(a, b, lenComp, isLoose) {
  var nodeCompare = isLoose ? nodeMatches : nodeEqual;

  if (a === b) return true;
  if (!Array.isArray(a) && !Array.isArray(b)) {
    return nodeCompare(a, b, lenComp);
  }
  if (!a && !b) return true;
  if (a.length !== b.length) return false;
  if (a.length === 0 && b.length === 0) return true;
  for (var i = 0; i < a.length; i += 1) {
    if (!nodeCompare(a[i], b[i], lenComp)) return false;
  }
  return true;
}

function childrenMatch(a, b, lenComp) {
  return internalChildrenCompare(a, b, lenComp, true);
}

function childrenEqual(a, b, lenComp) {
  return internalChildrenCompare(a, b, lenComp, false);
}

function removeNullaryReducer(acc, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];

  var addition = value == null ? {} : _defineProperty({}, key, value);
  return (0, _object4['default'])({}, acc, addition);
}

function internalNodeCompare(a, b, lenComp, isLoose) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.type !== b.type) return false;

  var left = propsOfNode(a);
  var right = propsOfNode(b);
  if (isLoose) {
    left = (0, _object2['default'])(left).reduce(removeNullaryReducer, {});
    right = (0, _object2['default'])(right).reduce(removeNullaryReducer, {});
  }

  var leftKeys = Object.keys(left);
  for (var i = 0; i < leftKeys.length; i += 1) {
    var prop = leftKeys[i];
    // we will check children later
    if (prop === 'children') {
      // continue;
    } else if (!(prop in right)) {
      return false;
    } else if (right[prop] === left[prop]) {
      // continue;
    } else if (_typeof(right[prop]) === _typeof(left[prop]) && _typeof(left[prop]) === 'object') {
      if (!(0, _isEqual2['default'])(left[prop], right[prop])) return false;
    } else {
      return false;
    }
  }

  var leftHasChildren = 'children' in left;
  var rightHasChildren = 'children' in right;
  var childCompare = isLoose ? childrenMatch : childrenEqual;
  if (leftHasChildren || rightHasChildren) {
    if (!childCompare(childrenToSimplifiedArray(left.children), childrenToSimplifiedArray(right.children), lenComp)) {
      return false;
    }
  }

  if (!isTextualNode(a)) {
    var rightKeys = Object.keys(right);
    return lenComp(leftKeys.length - leftHasChildren, rightKeys.length - rightHasChildren);
  }

  return false;
}

function nodeMatches(a, b) {
  var lenComp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _objectIs2['default'];

  return internalNodeCompare(a, b, lenComp, true);
}

function nodeEqual(a, b) {
  var lenComp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _objectIs2['default'];

  return internalNodeCompare(a, b, lenComp, false);
}

function containsChildrenSubArray(match, node, subArray) {
  var children = childrenOfNode(node);
  var checker = function checker(_, i) {
    return arraysEqual(match, children.slice(i, i + subArray.length), subArray);
  };
  return children.some(checker);
}

function arraysEqual(match, left, right) {
  return left.length === right.length && left.every(function (el, i) {
    return match(el, right[i]);
  });
}

function childrenToSimplifiedArray(nodeChildren) {
  var childrenArray = (0, _reactCompat.childrenToArray)(nodeChildren);
  var simplifiedArray = [];

  for (var i = 0; i < childrenArray.length; i += 1) {
    var child = childrenArray[i];
    var previousChild = simplifiedArray.pop();

    if (previousChild === undefined) {
      simplifiedArray.push(child);
    } else if (isTextualNode(child) && isTextualNode(previousChild)) {
      simplifiedArray.push(previousChild + child);
    } else {
      simplifiedArray.push(previousChild);
      simplifiedArray.push(child);
    }
  }

  return simplifiedArray;
}

function childrenOfNode(node) {
  var props = propsOfNode(node);
  var children = props.children;

  return (0, _reactCompat.childrenToArray)(children);
}

function isTextualNode(node) {
  return typeof node === 'string' || typeof node === 'number';
}

function isReactElementAlike(arg) {
  return _react2['default'].isValidElement(arg) || isTextualNode(arg) || Array.isArray(arg);
}

// 'click' => 'onClick'
// 'mouseEnter' => 'onMouseEnter'
function propFromEvent(event) {
  var nativeEvent = mapNativeEventNames(event);
  return 'on' + String(nativeEvent[0].toUpperCase()) + String(nativeEvent.slice(1));
}

function withSetStateAllowed(fn) {
  // NOTE(lmr):
  // this is currently here to circumvent a React bug where `setState()` is
  // not allowed without global being defined.
  var cleanup = false;
  if (typeof global.document === 'undefined') {
    cleanup = true;
    global.document = {};
  }
  fn();
  if (cleanup) {
    // This works around a bug in node/jest in that developers aren't able to
    // delete things from global when running in a node vm.
    global.document = undefined;
    delete global.document;
  }
}

function splitSelector(selector) {
  // step 1: make a map of all quoted strings with a uuid
  var quotedSegments = selector.split(/[^" ]+|("[^"]*")|.*/g).filter(Boolean).reduce(function (obj, match) {
    return (0, _object4['default'])({}, obj, _defineProperty({}, match, _uuid2['default'].v4()));
  }, {});

  var splits = selector
  // step 2: replace all quoted strings with the uuid, so we don't have to properly parse them
  .replace(/[^" ]+|("[^"]*")|.*/g, function (x) {
    return quotedSegments[x] || x;
  })
  // step 3: split as best we can without a proper parser
  .split(/(?=\.|\[.*])|(?=#|\[#.*])/)
  // step 4: restore the quoted strings by swapping back the uuid's for the original segments
  .map(function (selectorSegment) {
    var restoredSegment = selectorSegment;
    (0, _object2['default'])(quotedSegments).forEach(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          k = _ref5[0],
          v = _ref5[1];

      restoredSegment = restoredSegment.replace(v, k);
    });
    return restoredSegment;
  });

  if (splits.length === 1 && splits[0] === selector) {
    // splitSelector expects selector to be "splittable"
    throw new TypeError('Enzyme::Selector received what appears to be a malformed string selector');
  }

  return splits;
}

var containsQuotes = /'|"/;
var containsColon = /:/;

function isPseudoClassSelector(selector) {
  if (containsColon.test(selector)) {
    if (!containsQuotes.test(selector)) {
      return true;
    }
    var tokens = selector.split(containsQuotes);
    return tokens.some(function (token, i) {
      return containsColon.test(token) && i % 2 === 0;
    });
  }
  return false;
}

function selectorError(selector) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return new TypeError('Enzyme received a ' + String(type) + ' CSS selector (\'' + String(selector) + '\') that it does not currently support');
}

var isCompoundSelector = exports.isCompoundSelector = /^[.#]?-?[_a-z]+[_a-z0-9-]*[.[#]/i;

var isPropSelector = /^\[.*]$/;

var SELECTOR = exports.SELECTOR = {
  CLASS_TYPE: 0,
  ID_TYPE: 1,
  PROP_TYPE: 2
};

function selectorType(selector) {
  if (isPseudoClassSelector(selector)) {
    throw selectorError(selector, 'pseudo-class');
  }
  if (selector[0] === '.') {
    return SELECTOR.CLASS_TYPE;
  } else if (selector[0] === '#') {
    return SELECTOR.ID_TYPE;
  } else if (isPropSelector.test(selector)) {
    return SELECTOR.PROP_TYPE;
  }
  return undefined;
}

function AND(fns) {
  var fnsReversed = fns.slice().reverse();
  return function (x) {
    return fnsReversed.every(function (fn) {
      return fn(x);
    });
  };
}

function coercePropValue(propName, propValue) {
  // can be undefined
  if (propValue === undefined) {
    return propValue;
  }

  // can be the empty string
  if (propValue === '') {
    return propValue;
  }

  if (propValue === 'NaN') {
    return NaN;
  }

  if (propValue === 'null') {
    return null;
  }

  var trimmedValue = propValue.trim();

  // if propValue includes quotes, it should be
  // treated as a string
  // eslint override pending https://github.com/eslint/eslint/issues/7472
  // eslint-disable-next-line no-useless-escape
  if (/^(['"]).*\1$/.test(trimmedValue)) {
    return trimmedValue.slice(1, -1);
  }

  var numericPropValue = +trimmedValue;

  // if parseInt is not NaN, then we've wanted a number
  if (!(0, _objectIs2['default'])(NaN, numericPropValue)) {
    return numericPropValue;
  }

  // coerce to boolean
  if (trimmedValue === 'true') return true;
  if (trimmedValue === 'false') return false;

  // user provided an unquoted string value
  throw new TypeError('Enzyme::Unable to parse selector \'[' + String(propName) + '=' + String(propValue) + ']\'. ' + ('Perhaps you forgot to escape a string? Try \'[' + String(propName) + '="' + String(trimmedValue) + '"]\' instead.'));
}

function nodeHasProperty(node, propKey, stringifiedPropValue) {
  var nodeProps = propsOfNode(node);
  var descriptor = Object.getOwnPropertyDescriptor(nodeProps, propKey);
  if (descriptor && descriptor.get) {
    return false;
  }
  var nodePropValue = nodeProps[propKey];

  var propValue = coercePropValue(propKey, stringifiedPropValue);

  if (nodePropValue === undefined) {
    return false;
  }

  if (propValue !== undefined) {
    return (0, _objectIs2['default'])(nodePropValue, propValue);
  }

  return Object.prototype.hasOwnProperty.call(nodeProps, propKey);
}

function mapNativeEventNames(event) {
  var nativeToReactEventMap = {
    compositionend: 'compositionEnd',
    compositionstart: 'compositionStart',
    compositionupdate: 'compositionUpdate',
    keydown: 'keyDown',
    keyup: 'keyUp',
    keypress: 'keyPress',
    contextmenu: 'contextMenu',
    dblclick: 'doubleClick',
    doubleclick: 'doubleClick', // kept for legacy. TODO: remove with next major.
    dragend: 'dragEnd',
    dragenter: 'dragEnter',
    dragexist: 'dragExit',
    dragleave: 'dragLeave',
    dragover: 'dragOver',
    dragstart: 'dragStart',
    mousedown: 'mouseDown',
    mousemove: 'mouseMove',
    mouseout: 'mouseOut',
    mouseover: 'mouseOver',
    mouseup: 'mouseUp',
    touchcancel: 'touchCancel',
    touchend: 'touchEnd',
    touchmove: 'touchMove',
    touchstart: 'touchStart',
    canplay: 'canPlay',
    canplaythrough: 'canPlayThrough',
    durationchange: 'durationChange',
    loadeddata: 'loadedData',
    loadedmetadata: 'loadedMetadata',
    loadstart: 'loadStart',
    ratechange: 'rateChange',
    timeupdate: 'timeUpdate',
    volumechange: 'volumeChange',
    beforeinput: 'beforeInput'
  };

  if (!_version.REACT013) {
    // these could not be simulated in React 0.13:
    // https://github.com/facebook/react/issues/1297
    nativeToReactEventMap.mouseenter = 'mouseEnter';
    nativeToReactEventMap.mouseleave = 'mouseLeave';
  }

  return nativeToReactEventMap[event] || event;
}

function displayNameOfNode(node) {
  var type = node.type;


  if (!type) return null;

  return type.displayName || (typeof type === 'function' ? (0, _functionPrototype2['default'])(type) : type.name) || type;
}