"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Store: true
};
Object.defineProperty(exports, "Store", {
  enumerable: true,
  get: function get() {
    return _store.default;
  }
});
exports.default = void 0;

var _store = _interopRequireDefault(require("./store"));

var _storeHelpers = require("./store-helpers");

Object.keys(_storeHelpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _storeHelpers[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Store: _store.default
};
exports.default = _default;