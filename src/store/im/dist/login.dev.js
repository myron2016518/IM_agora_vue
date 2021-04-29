"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

const _elementUi = require("element-ui");

// @ts-nocheck

/* eslint-disable */
var LoginIM = {
  state: {
    isRegister: false,
    username: ""
  },
  mutations: {
    setUserName: function setUserName(state, username) {
      state.username = username;
    },
    setRegisterFlag: function setRegisterFlag(state, flag) {
      state.isRegister = flag;
    }
  },
  actions: {
    onLogin: function onLogin(context, payload) {
      context.commit("setUserName", payload.username);
      var options = {
        user: payload.username,
        pwd: payload.password,
        appKey: WebIM.config.appkey,
        apiUrl: "https://a1.easecdn.com"
      };
      console.log("====onlogin==", options);

      WebIM.conn.open(options);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          userId: payload.username,
          password: payload.password
        })
      );
    },
    onLogout: function onLogout(context) {
      context.commit("setUserName", "");
      localStorage.setItem("userInfo", "");
      WebIM.conn.close();
    },
    onRegister: function onRegister(context, payload) {
      var _this = this; // context.commit('setUserName', payload.username)

      var options = {
        username: payload.username,
        password: payload.password,
        nickname: payload.nickname,
        appKey: WebIM.config.appkey,
        success: function success() {
          (0, _elementUi.Message)({
            type: "success",
            message: "注册成功"
          });
          context.commit("setRegisterFlag", false);
        },
        error: function error(err) {
          if (
            JSON.parse(err.data).error == "duplicate_unique_property_exists"
          ) {
            _elementUi.Message.error("用户已存在！");
          } else if (JSON.parse(err.data).error == "illegal_argument") {
            if (
              JSON.parse(err.data).error_description === "USERNAME_TOO_LONG"
            ) {
              return message.error("用户名超过64个字节！");
            }

            _elementUi.Message.error("用户名不合法！");
          } else if (JSON.parse(err.data).error == "unauthorized") {
            _elementUi.Message.error("注册失败，无权限！");
          } else if (JSON.parse(err.data).error == "resource_limited") {
            _elementUi.Message.error(
              "您的App用户注册数量已达上限,请升级至企业版！"
            );
          }
        }
      };
      WebIM.conn.registerUser(options);
    },
    setRegisterFlag: function setRegisterFlag(context, flag) {
      var path = flag ? "/register" : "/login";
      Vue.$router.push(path);
      context.commit("setRegisterFlag", flag);
    }
  },
  getters: {}
};
var _default = LoginIM;
exports["default"] = _default;
