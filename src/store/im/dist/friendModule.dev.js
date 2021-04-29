"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// @ts-nocheck

/* eslint-disable */
var FriendModule = {
  state: {
    friendRequest: [],
    blackList: {}
  },
  mutations: {
    changeFriendRequestState: function changeFriendRequestState(state, data) {
      state.friendRequest = data;
    },
    updateBlackList: function updateBlackList(state, blackList) {
      state.blackList = blackList;
    }
  },
  actions: {
    addfirend: function addfirend(context, payload) {
      var username = localStorage.getItem("userInfo") && JSON.parse(localStorage.getItem("userInfo")).userId;
      var id = payload.id;
      WebIM.conn.subscribe({
        to: id,
        message: username + "请求添加你为好友"
      });
    },
    // 接受好友请求
    acceptSubscribe: function acceptSubscribe(context, payload) {
      WebIM.conn.subscribed({
        to: payload,
        message: "[resp:true]"
      });
    },
    // 拒绝好友请求
    declineSubscribe: function declineSubscribe(context, payload) {
      var username = localStorage.getItem("userInfo") && JSON.parse(localStorage.getItem("userInfo")).userId;
      var id = payload.id;
      WebIM.conn.unsubscribed({
        to: id,
        message: username + "拒绝您的好友请求"
      });
    },
    // 添加黑名单-单人
    onAddBlack: function onAddBlack(context, payload) {
      var addName = payload.userId.name;
      WebIM.conn.addToBlackList({
        name: addName
      });
      this._vm.dispatch("onGetContactUserList", {
        type: "addBlack",
        addName: addName
      });
    },
    // 获取黑名单
    onGetFirendBlack: function onGetFirendBlack(context, payload) {
      WebIM.conn.getBlacklist();
    },
    // 移除黑名单
    onRemoveBlack: function onRemoveBlack(context, payload) {
      var blackName = payload.removeName;
      WebIM.conn.removeFromBlackList({
        name: blackName,
        success: function success() {
          console.log("Remove from black list success.");
        },
        error: function error() {
          console.log("Remove from black list error.");
        }
      });
    },
    // 删除好友
    onDelteFirend: function onDelteFirend(context, payload) {
      var deleteName = payload.userId.name;
      var option = {
        to: deleteName,
        success: function success() {
          // 删除成功
          conn.unsubscribed({
            to: deleteName
          });
          console.log("删除好友成功");
        },
        error: function error() {// 删除失败
        }
      };
      payload.callback();
      Vue.$router.push("/contact");
      WebIM.conn.removeRoster(option);
    }
  },
  getters: {
    addfirend: function addfirend(state) {
      return state.firendList.myFirendList;
    }
  }
};
var _default = FriendModule;
exports["default"] = _default;