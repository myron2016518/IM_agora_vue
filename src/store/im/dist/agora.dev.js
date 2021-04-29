"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _elementUi = require("element-ui");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// @ts-nocheck

/* eslint-disable */
var rtc = WebIM.rtc;
var CALLSTATUS = {
  idle: 0,
  inviting: 1,
  alerting: 2,
  confirmRing: 3,
  // caller
  receivedConfirmRing: 4,
  // callee
  answerCall: 5,
  receivedAnswerCall: 6,
  confirmCallee: 7
};
var Agora = {
  state: {
    callStatus: CALLSTATUS.idle,
    callDuration: "00:00",
    minisize: false,
    confr: {
      channel: "",
      token: "",
      type: null,
      callId: null,
      callerDevId: null,
      calleeDevId: null,
      confrName: "",
      callerIMName: "",
      calleeIMName: ""
    },
    gid: "",
    inviteModal: false,
    joinedMembers: [],
    invitedMembers: []
  },
  mutations: {
    updateAgoraConfr: function updateAgoraConfr(state, msg) {
      console.log("msg>>", msg);
      var confrInfo = msg.ext || {};
      var confr = {
        channel: confrInfo.channelName,
        token: confrInfo.token,
        type: confrInfo.type,
        callId: confrInfo.callId,
        callerDevId: confrInfo.callerDevId,
        calleeDevId: confrInfo.calleeDevId
      };

      if (confrInfo.type === 2) {
        confr.confrName = msg.to;
      } else {
        confr.confrName = msg.from;
      }

      if (msg.calleeIMName) {
        confr.calleeIMName = msg.calleeIMName;
      }

      if (msg.callerIMName) {
        confr.callerIMName = msg.callerIMName;
      }

      state.confr = confr;
    },
    onSetCallStatus: function onSetCallStatus(state, status) {
      console.log("更新会议状态-----", state, "status>>", status);
      state.callStatus = status;
    },
    onHangup: function onHangup(state, status) {
      rtc.localAudioTrack && rtc.localAudioTrack.close();
      rtc.localVideoTrack && rtc.localVideoTrack.close();
      rtc.client && rtc.client.leave();
      var resetState = {
        callStatus: CALLSTATUS.idle,
        callDuration: "00:00",
        minisize: false,
        confr: {
          channel: "",
          token: "",
          type: null,
          callId: null,
          callerDevId: null,
          calleeDevId: null,
          confrName: "",
          callerIMName: "",
          calleeIMName: ""
        },
        gid: "",
        inviteModal: false,
        joinedMembers: [],
        invitedMembers: []
      };
      state.callStatus = resetState.callStatus;
      state.callDuration = resetState.callDuration;
      state.confr = resetState.confr;
      state.gid = resetState.gid;
      state.inviteModal = resetState.inviteModal;
      state.joinedMembers = resetState.joinedMembers;
      state.invitedMembers = resetState.invitedMembers;
    },
    onSetCallDuration: function onSetCallDuration(state, callDuration) {
      state.callDuration = callDuration;
    },
    onSetJoinedMembers: function onSetJoinedMembers(state, members) {
      var joinCurrent = state.joinedMembers.concat(members);
      var newInvitedMem = []; //todo

      if (state.invitedMembers.length) {
        newInvitedMem = state.invitedMembers.filter(function (item) {
          if (item != members.name) {
            return item;
          }
        });
      }

      state.joinedMembers = joinCurrent;
      state.invitedMembers = newInvitedMem;
    },
    onUpdateJoinedMembers: function onUpdateJoinedMembers(state, removed) {
      var joinCurrent = state.joinedMembers.filter(function (item) {
        console.log("item>>", item);

        if (item.name != removed.name) {
          return item;
        }
      });
      state.joinedMembers = joinCurrent;
    },
    onSetInvitedMembers: function onSetInvitedMembers(state, members) {
      state.invitedMembers = members;
    }
  },
  actions: {
    updateConfr: function updateConfr(context, payload) {
      context.commit("updateAgoraConfr", payload);
    },
    // caller 主叫
    confirmRing: function confirmRing(context, payload) {
      console.log("confirmRing...context>>", context, "payload>>", payload);
      var msg = payload.msg,
          deviceId = payload.deviceId,
          callerDevId = payload.callerDevId,
          callId = payload.callId;
      var from = msg.from;
      var confr = context.state.confr;
      console.log("confr>>>", confr);
      var currentCallId = confr.callId;
      var status = true;

      if (callId !== currentCallId) {
        console.warn("callId 不相同");
        status = false;
      }

      if (context.state.callStatus > 4) {
        //已经在通话中
        status = false;
      }

      if (callerDevId !== WebIM.conn.context.jid.clientResource) {
        console.warn("callerDevId 设备不相同");
        return;
      }

      var id = WebIM.conn.getUniqueId(); //生成本地消息id

      var msgObj = new WebIM.message("cmd", id); //创建命令消息

      msgObj.set({
        to: from,
        action: "rtcCall",
        ext: {
          action: "confirmRing",
          status: status,
          // TRUE为有效，FALSE为无效（miss）
          callerDevId: WebIM.conn.context.jid.clientResource,
          calleeDevId: deviceId,
          callId: callId,
          ts: Date.now(),
          msgType: "rtcCallWithAgora"
        },
        success: function success(id, serverMsgId) {
          if (status) {
            console.log("status>>", status);
            context.commit("onSetCallStatus", CALLSTATUS.confirmRing);
          }
        },
        fail: function fail(e) {
          console.log("Fail");
        }
      });
      console.log("msgObj.body>>", msgObj.body);
      WebIM.conn.send(msgObj.body);
    },
    // callee 被叫
    sendAlerting: function sendAlerting(context, payload) {
      var to = payload.to,
          calleeDevId = payload.calleeDevId,
          callId = payload.callId;
      console.log("to>>", payload);
      var id = WebIM.conn.getUniqueId(); //生成本地消息id

      var msgObj = new WebIM.message("cmd", id); //创建命令消息

      msgObj.set({
        to: to,
        action: "rtcCall",
        ext: {
          action: "alert",
          calleeDevId: WebIM.conn.context.jid.clientResource,
          callerDevId: calleeDevId,
          callId: callId,
          ts: Date.now(),
          msgType: "rtcCallWithAgora"
        },
        success: function success(id, serverMsgId) {
          console.log("sendAlerting>>>");
          context.commit("onSetCallStatus", CALLSTATUS.alerting);
        },
        fail: function fail(e) {
          console.log("Fail");
        }
      });
      console.log("被叫发出的alert: ", msgObj.body);
      WebIM.conn.send(msgObj.body);
      rtc.timer = setTimeout(function () {
        console.log("定时器到期");
        context.commit("onHangup");
        context.commit("onSetCallStatus", CALLSTATUS.idle);
      }, 30000);
      console.log("设置定时器");
    },
    answerCall: function answerCall(context, payload) {
      console.log("payload>>>", payload);
      var confr = context.state.confr;
      console.log("confr>>>", context);
      var result = payload.result;
      var id = WebIM.conn.getUniqueId(); //生成本地消息id

      var msgObj = new WebIM.message("cmd", id); //创建命令消息

      var currentCallId = payload.currentCallId || confr.callId;
      var callerDevId = payload.callerDevId || confr.callerDevId;
      var to = payload.to || confr.callerIMName;
      msgObj.set({
        to: to,
        action: "rtcCall",
        ext: {
          action: "answerCall",
          result: result,
          // busy/accept/refuse
          callerDevId: callerDevId,
          calleeDevId: WebIM.conn.context.jid.clientResource,
          callId: currentCallId,
          ts: Date.now(),
          msgType: "rtcCallWithAgora"
        },
        success: function success(id, serverMsgId) {
          console.log("成功发送answerCall");
        },
        fail: function fail(e) {
          console.log("Fail"); //如禁言、拉黑后发送消息会失败
        }
      });
      console.log("发送answerCall", msgObj);
      WebIM.conn.send(msgObj.body);
    },
    confirmCallee: function confirmCallee(context, payload) {
      console.log("confirmCallee>>>>>>", payload);
      var to = payload.to,
          calleeDevId = payload.calleeDevId;
      var result = payload.result;
      var id = WebIM.conn.getUniqueId(); //生成本地消息id

      var msgObj = new WebIM.message("cmd", id); //创建命令消息

      var confr = context.state.confr;
      var currentCallId = confr.callId;
      console.log("confr.calleeDevId>>", confr.calleeDevId, "confr.type>>", confr.type);

      if (!confr.calleeDevId && confr.type != 2) {
        console.log("进来了updateAgoraConfr");
        var obj = {
          to: confr.confrName,
          ext: {
            channelName: confr.channel,
            token: confr.token,
            type: confr.type,
            callerDevId: confr.callerDevId,
            calleeDevId: calleeDevId,
            callId: confr.callId
          },
          calleeIMName: confr.calleeIMName,
          callerIMName: confr.callerIMName
        };
        context.commit("updateAgoraConfr", obj);
      } else if (confr.calleeDevId != calleeDevId && confr.type != 2) {
        result = "refuse";
      }

      msgObj.set({
        to: to,
        action: "rtcCall",
        ext: {
          action: "confirmCallee",
          result: result || "accept",
          // busy/accept/refuse
          callerDevId: WebIM.conn.context.jid.clientResource,
          calleeDevId: calleeDevId,
          callId: currentCallId,
          ts: Date.now(),
          msgType: "rtcCallWithAgora"
        },
        success: function success(id, serverMsgId) {
          context.commit("onSetCallStatus", CALLSTATUS.confirmCallee);
        },
        fail: function fail(e) {
          console.log("Fail");
        }
      });
      console.log("发送confirmCallee", msgObj);
      WebIM.conn.send(msgObj.body);
    },
    cancelCall: function cancelCall(context, payload) {
      var confr = context.state.confr;
      var id = WebIM.conn.getUniqueId();
      var msgObj = new WebIM.message("cmd", id);
      var callerDevId = confr.callerDevId;
      var user = payload && payload.to || confr.calleeIMName;
      var currentCallId = confr.callId;

      if (!user) {
        console.log("-- to is undefined --");
        return;
      }

      msgObj.set({
        to: user,
        action: "rtcCall",
        ext: {
          action: "cancelCall",
          callerDevId: callerDevId,
          callId: currentCallId,
          ts: Date.now(),
          msgType: "rtcCallWithAgora"
        },
        success: function success(id, serverMsgId) {
          context.commit("onSetCallStatus", CALLSTATUS.idle);
        },
        fail: function fail(e) {
          console.log("Fail");
        }
      });
      console.log("发送取消消息", msgObj);
      WebIM.conn.send(msgObj.body);
    },
    // 更改会议状态
    setCallStatus: function setCallStatus(context, payload) {
      context.commit("onSetCallStatus", payload);
    },
    hangup: function hangup(context, payload) {
      //重置所有state
      context.commit("onHangup");
    },
    setCallDuration: function setCallDuration(context, payload) {
      context.commit("onSetCallDuration", payload);
    },
    setJoinedMembers: function setJoinedMembers(context, payload) {
      context.commit("onSetJoinedMembers", payload);
    },
    updateJoinedMembers: function updateJoinedMembers(context, payload) {
      context.commit("onUpdateJoinedMembers", payload);
    },
    getRtctoken: function getRtctoken(context, payload) {
      _axios["default"].defaults.headers.common["Authorization"] = "Bearer " + WebIM.conn.context.accessToken;
      var username = payload.username,
          channelName = payload.channelName,
          appkey = payload.appkey;
      return _axios["default"].get("//a1-hsb.easemob.com/token/rtcToken?userAccount=".concat(username, "&channelName=").concat(channelName, "&appkey=").concat(encodeURIComponent(appkey))).then(function (response) {
        return response.data;
      })["catch"](function (error) {
        console.log(error);
      });
    },
    setInvitedMembers: function setInvitedMembers(context, payload) {
      context.commit("onSetInvitedMembers", payload);
    }
  },
  getters: {
    getAgora: function getAgora(state) {
      return state;
    }
  }
};
var _default = Agora;
exports["default"] = _default;