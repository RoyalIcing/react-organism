/*!
 * react-organism v0.3.3
 * MIT Licensed
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["makeOrganism"] = factory(require("react"));
	else
		root["makeOrganism"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_awareness__ = __webpack_require__(3);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




// Returns a new stateful component, given the specified state handlers and a pure component to render with
/* harmony default export */ __webpack_exports__["default"] = (function (Pure, handlersIn) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      onChange = _ref.onChange,
      adjustArgs = _ref.adjustArgs;

  return function (_PureComponent) {
    _inherits(Organism, _PureComponent);

    function Organism() {
      var _temp, _this, _ret;

      _classCallCheck(this, Organism);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _PureComponent.call.apply(_PureComponent, [this].concat(args))), _this), _this.alterState = function (stateChanger) {
        // Can either be a plain object or a callback to transform the existing state
        _this.setState(stateChanger,
        // Call onChange once updated with current version of state
        onChange ? function () {
          onChange(_this.state);
        } : undefined);
      }, _this.awareness = Object(__WEBPACK_IMPORTED_MODULE_1_awareness__["a" /* default */])(_this.alterState, handlersIn, {
        getProps: function getProps() {
          return _this.props;
        },
        adjustArgs: adjustArgs
      }), _this.state = _this.awareness.state, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Organism.prototype.componentDidMount = function componentDidMount() {
      this.awareness.loadAsync(this.props, null);
    };

    Organism.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      this.awareness.loadAsync(nextProps, this.props);
    };

    Organism.prototype.render = function render() {
      // Render the pure component, passing both props and state, plus handlers bundled together
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Pure, _extends({}, this.props, this.state, { handlers: this.awareness.handlers }));
    };

    return Organism;
  }(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export callHandler */
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var nextFrame = function nextFrame() {
  return new Promise(function (resolve) {
    window.requestAnimationFrame(resolve);
  });
};

function stateChangerCatchingError(stateChanger, transformError) {
  return function (prevState, props) {
    // Check if stateChanger is a function
    if ((typeof stateChanger === 'undefined' ? 'undefined' : _typeof(stateChanger)) === _typeof(stateChanger.call)) {
      try {
        // Call state changer
        return stateChanger(prevState, props);
      }
      // State changer may throw
      catch (error) {
        // Store error in state
        return transformError(error);
      }
    }
    // Else just an object with changes
    else {
        return stateChanger;
      }
  };
}

function processStateChanger(changeState, stateChanger, storeError) {
  if (!stateChanger) {
    return;
  }

  // Check if thenable (i.e. a Promise)
  if (_typeof(stateChanger.then) === _typeof(Object.assign)) {
    return stateChanger.then(function (stateChanger) {
      return stateChanger && changeState(stateChanger);
    }).catch(storeError);
  }
  // Check if iterator
  else if (_typeof(stateChanger.next) === _typeof(Object.assign)) {
      return processIterator(changeState, stateChanger, storeError);
    }
    // Otherwise, change state immediately
    // Required for things like <textarea> onChange to keep cursor in correct position
    else {
        changeState(stateChanger);
      }
}

function processIterator(changeState, iterator, storeError, previousValue) {
  return Promise.resolve(processStateChanger(changeState, previousValue, storeError)) // Process the previous changer
  .then(function () {
    return nextFrame();
  }) // Wait for next frame
  .then(function () {
    var result = iterator.next(); // Get the next step from the iterator
    if (result.done) {
      // No more iterations remaining
      return processStateChanger(changeState, result.value, storeError); // Process the changer
    } else {
      return processIterator(changeState, iterator, storeError, result.value); // Process the iterator’s following steps
    }
  });
}

function callHandler(handler, transformError, args, alterState) {
  if ((typeof transformError === 'undefined' ? 'undefined' : _typeof(transformError)) === _typeof('')) {
    var errorKey = transformError;
    transformError = function transformError(error) {
      var _ref;

      return _ref = {}, _ref[errorKey] = error, _ref;
    };
  }

  var storeError = function storeError(error) {
    alterState(function () {
      return transformError(error);
    });
  };
  // Call handler function, props first, then rest of args
  try {
    var changeState = function changeState(stateChanger) {
      alterState(stateChangerCatchingError(stateChanger, transformError));
    };
    var result = handler.apply(null, args);
    // Can return multiple state changers, ensure array, and then loop through
    [].concat(result).forEach(function (stateChanger) {
      processStateChanger(changeState, stateChanger, storeError);
    });
  }
  // Catch error within handler’s (first) function
  catch (error) {
    storeError(error);
  }
}

var defaultTransformErrorForKey = function defaultTransformErrorForKey(key) {
  return function (error) {
    var _ref2;

    var stateKey = (key === 'load' ? 'load' : 'handler') + 'Error';
    return _ref2 = {}, _ref2[stateKey] = error, _ref2;
  };
};

// Returns a new stateful component, given the specified state handlers and a pure component to render with
/* harmony default export */ __webpack_exports__["a"] = (function (alterState, handlersIn) {
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref3$getProps = _ref3.getProps,
      getProps = _ref3$getProps === undefined ? function () {
    return {};
  } : _ref3$getProps,
      _ref3$transformErrorF = _ref3.transformErrorForKey,
      transformErrorForKey = _ref3$transformErrorF === undefined ? defaultTransformErrorForKey : _ref3$transformErrorF,
      adjustArgs = _ref3.adjustArgs;

  var state = Object.assign({
    loadError: null,
    handlerError: null
  }, handlersIn.initial(getProps()));

  // Uses `load` handler, if present, to asynchronously load initial state
  function loadAsync(nextProps, prevProps) {
    if (handlersIn.load) {
      callHandler(handlersIn.load, transformErrorForKey('load'), [nextProps, prevProps], alterState);
    }
  }

  var handlers = Object.keys(handlersIn).reduce(function (out, key) {
    // Special case for `load` handler to reload fresh
    if (key === 'load') {
      out.load = function () {
        loadAsync(getProps(), null);
      };
      return out;
    }

    out[key] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (adjustArgs) {
        args = adjustArgs(args);
      }

      callHandler(handlersIn[key], transformErrorForKey(key), [Object.assign({}, getProps(), { handlers: handlers })].concat(args), alterState);
    };
    return out;
  }, {});

  return {
    state: state,
    loadAsync: loadAsync,
    handlers: handlers
  };
});

/***/ })
/******/ ]);
});