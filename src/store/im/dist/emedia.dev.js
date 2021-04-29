"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mutations;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// @ts-nocheck

/* eslint-disable */
var mutationsTypes = {
  GET_GROUPMEMBERS: "GET_GROUPMEMBERS",
  SHOW_MULTIANMODAL: "SHOW_MULTIANMODAL",
  HIDE_MULTIANMODAL: "HIDE_MULTIANMODAL",
  SET_CONFR: "SET_CONFR",
  SET_AVMEMBERMODAL_VISIBLE: "SET_AVMEMBERMODAL_VISIBLE"
};
var Emedia = {
  state: {
    groupMembers: [],
    multiAVModalVisible: false,
    confr: {},
    addAVMemberModalVisible: false
  },
  mutations: (_mutations = {}, _defineProperty(_mutations, mutationsTypes.GET_GROUPMEMBERS, function (state, payload) {
    state.groupMembers = payload.groupMembers;
  }), _defineProperty(_mutations, mutationsTypes.SHOW_MULTIANMODAL, function (state, payload) {
    state.multiAVModalVisible = true;
    state.confr = payload.confr;
  }), _defineProperty(_mutations, mutationsTypes.HIDE_MULTIANMODAL, function (state) {
    state.multiAVModalVisible = false;
  }), _defineProperty(_mutations, mutationsTypes.SET_CONFR, function (state, payload) {
    state.confr = payload.confr;
  }), _defineProperty(_mutations, mutationsTypes.SET_AVMEMBERMODAL_VISIBLE, function (state, payload) {
    state.addAVMemberModalVisible = payload.addAVMemberModalVisible;
  }), _mutations),
  actions: {
    getGroupMembers: function getGroupMembers(context, payload) {
      var pageNum = 1,
          pageSize = 1000;
      var options = {
        pageNum: pageNum,
        pageSize: pageSize,
        groupId: payload,
        success: function success(resp) {
          console.log("Response: ", resp);
          context.commit({
            type: mutationsTypes.GET_GROUPMEMBERS,
            groupMembers: resp.data
          });
        },
        error: function error(e) {
          console.log("error", e);
        }
      };
      WebIM.conn.listGroupMember(options);
    },
    showMultiAVModal: function showMultiAVModal(context, payload) {
      console.log("payload>>", payload);
      context.commit({
        type: mutationsTypes.SHOW_MULTIANMODAL,
        confr: payload ? payload : {}
      });
    },
    hideMultiAVModal: function hideMultiAVModal(context) {
      context.commit(mutationsTypes.HIDE_MULTIANMODAL);
    },
    setConfr: function setConfr(context, payload) {
      context.commit({
        type: mutationsTypes.SET_CONFR,
        confr: payload.confr
      });
    },
    setAVMemeberModalVisible: function setAVMemeberModalVisible(context, payload) {
      context.commit({
        type: mutationsTypes.SET_AVMEMBERMODAL_VISIBLE,
        addAVMemberModalVisible: payload.addAVMemberModalVisible
      });
    }
  } // getters: {
  // }

};
var _default = Emedia;
exports["default"] = _default;