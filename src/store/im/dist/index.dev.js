"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

var _login = _interopRequireDefault(require("./login"));

var _chat = _interopRequireDefault(require("./chat"));

var _friendModule = _interopRequireDefault(require("./friendModule"));

var _group = _interopRequireDefault(require("./group"));

var _emedia = _interopRequireDefault(require("./emedia"));

var _agora = _interopRequireDefault(require("./agora"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// @ts-nocheck

/* eslint-disable */
_vue["default"].use(_vuex["default"]);

var store = new _vuex["default"].Store({
  modules: {
    login: _login["default"],
    chat: _chat["default"],
    friendModule: _friendModule["default"],
    group: _group["default"],
    emedia: _emedia["default"],
    agora: _agora["default"]
  }
});
var _default = store;
exports["default"] = _default;