"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _WebIM = _interopRequireDefault(require("@/utils/im/WebIM"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import WebIM from "@/utils/im/WebIM";
// TODO 处理页面刷新无法获取到音频url
var res = function res(response) {
  var objectUrl = _WebIM["default"].utils.parseDownloadResponse.call(_WebIM["default"].conn, response);

  return objectUrl; //  'blob:http://localhost:8080/536070e2-b3a0-444a-b1cc-f0723cf95588'
};

function test(url, func) {
  var options = {
    url: url,
    headers: {
      Accept: "audio/mp3"
    },
    onFileDownloadComplete: func,
    onFileDownloadError: function onFileDownloadError() {
      console.log("音频下载失败");
    }
  };

  _WebIM["default"].utils.download.call(_WebIM["default"].conn, options);
}

var Chat = {
  state: {
    userList: {
      contactUserList: [],
      groupUserList: [],
      chatroomUserList: []
    },
    msgList: {
      contact: {},
      group: {},
      chatroom: {}
    },
    currentMsgs: [],
    noticeCallMsg: {}
  },
  mutations: {
    updateUserList: function updateUserList(state, payload) {
      var userList = payload.userList,
          type = payload.type; // 如果是添加黑名单，则从当前用户列表中删掉此人
      // if(payload.black && payload.black.type === "addBlack"){
      // 	const addName = payload.black.addName;
      // 	const userList = state.userList[type];
      // 	let newUserList = _.pullAllBy(userList, [{ name: addName }], "name");
      // 	state.userList[type] = newUserList;
      // }
      // else{
      // 	state.userList[type] = userList;
      // }

      state.userList[type] = userList;
    },
    updateMsgList: function updateMsgList(state, payload) {
      var chatType = payload.chatType,
          chatId = payload.chatId,
          msg = payload.msg,
          bySelf = payload.bySelf,
          type = payload.type,
          id = payload.id; // payload的消息为漫游历史消息的话，进入判断筛选出已存在msgList当中的消息，此类消息不再添加进msgList。

      if (payload.isHistory) {
        //拿到该key已经存在的消息。
        var nowKeyMsg = state.msgList[chatType][chatId]; //开始筛选，如果payload.mid 不等于item.id则说明msgList中没有存储。

        var newHistoryMsg = nowKeyMsg && nowKeyMsg.filter(function (item) {
          return item.mid != payload.mid;
        });
        state.msgList[chatType][chatId] = newHistoryMsg;
      }

      var params = Vue.$route.params;
      var status = "unread";

      if (payload.chatType == "contact") {
        if (params.id == payload.from) {
          status = "read";
        }
      } else if (payload.chatType == "group") {
        if (params.id == payload.chatId) {
          status = "read";
        }
      }

      if (!state.msgList[chatType][chatId]) {
        state.msgList[chatType][chatId] = [_objectSpread({
          msg: msg,
          bySelf: bySelf,
          type: type || "",
          mid: id,
          status: status
        }, payload)];
      } else {
        state.msgList[chatType][chatId].push(_objectSpread({
          msg: msg,
          bySelf: bySelf,
          type: type || "",
          mid: id,
          status: status
        }, payload));
        state.msgList[chatType][chatId] = state.msgList[chatType][chatId].sort(function (a, b) {
          return a.time - b.time;
        }); // state.msgList[chatType][chatId] = _unique(state.msgList[chatType][chatId])
      }

      if (chatType === "chatroom" && !bySelf) {
        // 聊天室消息去重处理
        state.currentMsgs = _.uniqBy(state.msgList[chatType][chatId], "mid");
      } else {
        state.currentMsgs = Object.assign({}, state.msgList[chatType][params.id || chatId]); // 这里params.id在路由跳转的时候会undefind，取chatId兼容
      }

      state.msgList = Object.assign({}, state.msgList);
    },
    updateCurrentMsgList: function updateCurrentMsgList(state, messages) {
      state.currentMsgs = messages;
    },
    updateMessageMid: function updateMessageMid(state, message) {
      var id = message.id,
          mid = message.mid;
      var _Vue$$route = Vue.$route,
          name = _Vue$$route.name,
          params = _Vue$$route.params; // state.currentMsgs.forEach((item) => {
      //     if(item.mid == id){
      //         item.mid = mid
      //     }
      // })

      Object.keys(state.msgList[name]).forEach(function (user) {
        if (state.msgList[name][user].length) {
          state.msgList[name][user].forEach(function (msg) {
            if (msg.mid == id) {
              msg.mid = mid;
            }
          });
        }
      });
    },
    updateMessageStatus: function updateMessageStatus(state, message) {
      var id = message.id,
          mid = message.mid,
          action = message.action,
          readUser = message.readUser;
      var _Vue$$route2 = Vue.$route,
          name = _Vue$$route2.name,
          params = _Vue$$route2.params;
      Object.keys(state.msgList[name]).forEach(function (user) {
        // console.log(state.msgList[name][user]);
        if (action == "oneUserReadMsgs") {
          if (state.msgList[name][readUser]) {
            state.msgList[name][readUser].forEach(function (msg) {
              if (msg.status != "recall") {
                msg.status = "read";
              }
            });
          }
        } else if (state.msgList[name][user].length) {
          state.msgList[name][user].forEach(function (msg) {
            if (action === "readMsgs" && !msg.bySelf) {
              if (msg.status != "recall") {
                msg.status = "read";
              }
            } else if (msg.mid == id || msg.mid == mid) {
              msg.status = message.status;

              if (message.msg) {
                msg.msg = message.msg;
              }
            }
          });
        }
      });
    },
    // 黑名单筛选用户列表
    changeUserList: function changeUserList(state, payload) {
      var ary = [];

      _.forIn(payload, function (value, key) {
        ary.push({
          name: key
        });
      });

      state.userList.contactUserList = _.pullAllBy(state.userList.contactUserList, ary, "name");
    },
    initChatState: function initChatState(state) {
      state.userList = {
        contactUserList: [],
        groupUserList: [],
        chatroomUserList: []
      };
      state.msgList = {
        contact: {},
        group: {},
        chatroom: {}
      };
      state.currentMsgs = [];
    },
    // 传递数据给 call 组件，是否收到通话邀请
    noticeCall: function noticeCall(state, payload) {
      console.log("store noticeCall msg", payload);
      state.noticeCallMsg = payload;
    }
  },
  actions: {
    onGetContactUserList: function onGetContactUserList(context, payload) {
      try {
        _WebIM["default"].conn.getRoster({
          success: function success(roster) {
            // console.log("roster", roster);
            var userList = roster.filter(function (user) {
              return ["both", "to"].includes(user.subscription);
            });
            context.commit("updateUserList", {
              userList: userList,
              type: "contactUserList",
              black: payload
            });
          }
        });
      } catch (e) {
        console.log("error", e);
      }
    },
    onGetGroupUserList: function onGetGroupUserList(context, payload) {
      var options = {
        success: function success(resp) {
          var userList = resp.data;
          userList.forEach(function (user, index) {
            userList[index].name = user.groupname;
          });
          context.commit("updateUserList", {
            userList: userList,
            type: "groupUserList"
          });
        },
        error: function error(e) {}
      };

      _WebIM["default"].conn.getGroup(options);
    },
    onGetChatroomUserList: function onGetChatroomUserList(context, payload) {
      var option = {
        pagenum: 1,
        // 页数
        pagesize: 20,
        // 每页个数
        success: function success(list) {
          context.commit("updateUserList", {
            userList: list.data,
            type: "chatroomUserList"
          });
        },
        error: function error() {
          console.log("List chat room error");
        }
      };

      _WebIM["default"].conn.getChatRooms(option);
    },
    // 获取当前聊天对象的记录 @payload： {key, type}
    onGetCurrentChatObjMsg: function onGetCurrentChatObjMsg(context, payload) {
      var id = payload.id,
          type = payload.type;
      context.commit("updateCurrentMsgList", context.state.msgList[type][id]);
    },
    onSendText: function onSendText(context, payload) {
      var chatType = payload.chatType,
          chatId = payload.chatId,
          message = payload.message;

      var id = _WebIM["default"].conn.getUniqueId();

      var time = +new Date();
      var chatroom = chatType === "chatroom";
      var type = chatType === "contact" ? "singleChat" : "groupChat";
      var jid = {
        contact: "name",
        group: "groupid",
        chatroom: "id"
      };
      var msgObj = new _WebIM["default"].message("txt", id);
      msgObj.set({
        msg: message,
        to: chatId[jid[chatType]],
        chatType: type,
        roomType: chatroom,
        success: function success() {
          context.commit("updateMsgList", {
            chatType: chatType,
            chatId: chatId[jid[chatType]],
            msg: message,
            bySelf: true,
            time: time,
            mid: id,
            status: "sending"
          });
        },
        fail: function fail(e) {
          console.log("Send private text error", e);
        }
      });

      if (chatType === "group" || chatType === "chatroom") {
        msgObj.setGroup("groupchat");
      }

      _WebIM["default"].conn.send(msgObj.body);
    },
    sendImgMessage: function sendImgMessage(context, payload) {
      var chatType = payload.chatType,
          chatId = payload.chatId,
          roomType = payload.roomType,
          file = payload.file,
          callback = payload.callback;

      var id = _WebIM["default"].conn.getUniqueId();

      var jid = {
        contact: "name",
        group: "groupid",
        chatroom: "id"
      };
      var msgObj = new _WebIM["default"].message("img", id);
      msgObj.set({
        file: file,
        to: chatId[jid[chatType]],
        chatType: chatType,
        roomType: roomType,
        onFileUploadError: function onFileUploadError(error) {
          console.log("图片上传失败", error);
          callback();
        },
        onFileUploadComplete: function onFileUploadComplete(data) {
          var url = data.uri + "/" + data.entities[0].uuid;
          context.commit("updateMsgList", {
            msg: url,
            chatType: chatType,
            chatId: chatId[jid[chatType]],
            bySelf: true,
            type: "img",
            time: data.timestamp,
            mid: id,
            status: "sending"
          });
          callback();
        },
        success: function success() {
          console.log("图片发送成功");
        }
      });

      if (chatType === "group" || chatType === "chatroom") {
        msgObj.setGroup("groupchat");
      }

      _WebIM["default"].conn.send(msgObj.body);
    },
    sendFileMessage: function sendFileMessage(context, payload) {
      var chatType = payload.chatType,
          chatId = payload.chatId,
          roomType = payload.roomType,
          file = payload.file,
          callback = payload.callback;

      var id = _WebIM["default"].conn.getUniqueId();

      var jid = {
        contact: "name",
        group: "groupid",
        chatroom: "id"
      };
      var msgObj = new _WebIM["default"].message("file", id);
      msgObj.set({
        file: file,
        ext: {
          file_length: file.data.size
        },
        to: chatId[jid[chatType]],
        chatType: chatType,
        roomType: roomType,
        onFileUploadError: function onFileUploadError(error) {
          console.log("文件上传失败", error);
          callback();
        },
        onFileUploadComplete: function onFileUploadComplete(data) {
          var url = data.uri + "/" + data.entities[0].uuid;
          context.commit("updateMsgList", {
            msg: url,
            chatType: chatType,
            chatId: chatId[jid[chatType]],
            bySelf: true,
            type: "file",
            filename: file.data.name,
            file_length: file.data.size,
            time: data.timestamp,
            mid: id,
            status: "sending"
          });
          callback();
        },
        success: function success() {
          console.log("文件发送成功");
        }
      });

      if (chatType === "group" || chatType === "chatroom") {
        msgObj.setGroup("groupchat");
      }

      _WebIM["default"].conn.send(msgObj.body);
    },
    sendRecorder: function sendRecorder(context, payload) {
      var useId = payload.useId,
          type = payload.type,
          file = payload.file;

      var id = _WebIM["default"].conn.getUniqueId();

      var msgObj = new _WebIM["default"].message("audio", id);
      var isRoom = type == "chatroom" || type == "groupchat";
      var jid = {
        contact: "name",
        group: "groupid",
        chatroom: "id"
      }; // console.log('bold>>>', bold);
      // console.log('newBold>>', WebIM.utils.parseDownloadResponse.call(WebIM.conn, bold));
      // let newBold = WebIM.utils.parseDownloadResponse.call(WebIM.conn, bold)
      // var file = WebIM.utils.getFileUrl(input);

      msgObj.set({
        file: file,
        to: useId,
        type: "audio",
        roomType: isRoom,
        onFileUploadError: function onFileUploadError(error) {
          console.log("语音上传失败", error);
        },
        onFileUploadComplete: function onFileUploadComplete(data) {
          console.log("上传成功", data);
          var url = data.uri + "/" + data.entities[0].uuid;
          context.commit("updateMsgList", {
            msg: url,
            chatType: type,
            chatId: useId,
            bySelf: true,
            type: "audio",
            filename: file.data.name,
            // file_length: file.data.size,
            // time: data.timestamp,
            mid: id,
            status: "sending"
          });
        },
        success: function success(data) {
          console.log("语音发送成功", data);
        },
        flashUpload: _WebIM["default"].flashUpload
      });

      if (type === "group" || type === "chatroom") {
        msgObj.setGroup("groupchat");
      }

      _WebIM["default"].conn.send(msgObj.body);
    },
    onCallVideo: function onCallVideo(context, payload) {
      var chatType = payload.chatType,
          to = payload.to;
      var type = chatType === "contact" ? "singleChat" : "groupChat";
      var userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (chatType === "contact") {
        // this.setState({
        //     showWebRTC: true
        // })
        _WebIM["default"].call.caller = userInfo.userId;

        _WebIM["default"].call.makeVideoCall(to, null, payload.rec, payload.recMerge);
      }
    },
    onCallVoice: function onCallVoice(context, payload) {
      var chatType = payload.chatType,
          to = payload.to;
      var type = chatType === "contact" ? "singleChat" : "groupChat";
      var userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (chatType === "contact") {
        _WebIM["default"].call.caller = userInfo.userId;

        _WebIM["default"].call.makeVoiceCall(to, null, payload.rec, payload.recMerge);
      }
    },
    getHistoryMessage: function getHistoryMessage(context, payload) {
      var options = {
        queue: payload.name,
        isGroup: payload.isGroup,
        count: 10,
        // 每次获取消息条数
        success: function success(msgs) {
          try {
            payload.success && payload.success(msgs);

            if (msgs.length) {
              var userInfo = JSON.parse(localStorage.getItem("userInfo"));
              var userId = userInfo && userInfo.userId;
              msgs.forEach(function (item) {
                var time = Number(item.time);
                var msg = {};
                var bySelf = item.from == userId;

                if (!item.filename) {
                  msg = {
                    chatType: payload.isGroup ? "group" : "contact",
                    chatId: bySelf ? item.to : item.from,
                    msg: item.data,
                    bySelf: bySelf,
                    time: time,
                    mid: item.id,
                    status: "read"
                  };

                  if (payload.isGroup) {
                    msg.chatId = item.to;
                  } else {
                    msg.chatId = bySelf ? item.to : item.from;
                  }
                } else if (!item.ext.file_length && item.filename !== "audio" && item.filename.substring(item.filename.length - 3) !== "mp4") {
                  // 为图片的情况
                  msg = {
                    msg: item.url,
                    chatType: payload.isGroup ? "group" : "contact",
                    chatId: bySelf ? item.to : item.from,
                    bySelf: bySelf,
                    type: "img",
                    time: time,
                    mid: item.id,
                    status: "read"
                  };

                  if (payload.isGroup) {
                    msg.chatId = item.to;
                  } else {
                    msg.chatId = bySelf ? item.to : item.from;
                  }
                } else if (item.filename === "audio") {
                  msg = {
                    msg: item.url,
                    chatType: payload.isGroup ? "group" : "contact",
                    chatId: bySelf ? item.to : item.from,
                    bySelf: bySelf,
                    type: "audio"
                  };

                  if (payload.isGroup) {
                    msg.chatId = item.to;
                  } else {
                    msg.chatId = bySelf ? item.to : item.from;
                  }
                } else if (item.filename.substring(item.filename.length - 3) === "mp4") {
                  msg = {
                    msg: item.url,
                    chatType: payload.isGroup ? "group" : "contact",
                    chatId: bySelf ? item.to : item.from,
                    bySelf: bySelf,
                    type: "video"
                  };

                  if (payload.isGroup) {
                    msg.chatId = item.to;
                  } else {
                    msg.chatId = bySelf ? item.to : item.from;
                  }
                } else {
                  msg = {
                    msg: item.url,
                    chatType: payload.isGroup ? "group" : "contact",
                    chatId: bySelf ? item.to : item.from,
                    bySelf: bySelf,
                    type: "file",
                    filename: item.filename,
                    file_length: item.file_length,
                    time: time,
                    mid: item.id,
                    status: "read"
                  };

                  if (payload.isGroup) {
                    msg.chatId = item.to;
                  } else {
                    msg.chatId = bySelf ? item.to : item.from;
                  }
                }

                msg.isHistory = true;
                context.commit("updateMsgList", msg);
              });
              context.commit("updateMessageStatus", {
                action: "readMsgs"
              });
            }
          } catch (e) {
            console.log("error", e);
          }
        },
        fail: function fail() {}
      };

      _WebIM["default"].conn.fetchHistoryMessages(options);
    },
    recallMessage: function recallMessage(context, payload) {
      var _payload$message = payload.message,
          chatType = _payload$message.chatType,
          mid = _payload$message.mid;
      var to = payload.to;
      var me = this;
      var chatTypeObj = {
        contact: "chat",
        group: "groupchat",
        chatroom: "chatroom"
      };
      var option = {
        mid: mid,
        to: to,
        type: chatTypeObj[chatType],
        success: function success() {
          payload.message.status = "recall";
          payload.message.msg = "消息已撤回";
          this._vm.commit("updateMessageStatus", payload.message);
        },
        fail: function fail() {// me.$message('消息撤回失败');
        }
      };

      _WebIM["default"].conn.recallMessage(option);
    },
    initChatState: function initChatState(context, payload) {
      context.commit("initChatState");
    }
  },
  getters: {
    onGetContactUserList: function onGetContactUserList(state) {
      return state.userList.contactUserList;
    },
    onGetGroupUserList: function onGetGroupUserList(state) {
      return state.userList.groupUserList;
    },
    onGetChatroomUserList: function onGetChatroomUserList(state) {
      return state.userList.chatroomUserList;
    },
    onGetCurrentChatObjMsg: function onGetCurrentChatObjMsg(state) {
      return state.currentMsgs;
    },
    fetchHistoryMessages: function fetchHistoryMessages(state) {
      return state.currentMsgs;
    }
  }
};
var _default = Chat;
exports["default"] = _default;