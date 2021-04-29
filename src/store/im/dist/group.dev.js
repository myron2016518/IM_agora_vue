"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

const _fs = require("fs");

const _elementUi = require("element-ui");

// @ts-nocheck

/* eslint-disable */
var Group = {
  state: {
    publicGroupList: [],
    groupInviteNotifications: [],
    groupNotifications: [],
    groupInfo: {
      gid: "",
      name: "",
      admin: "",
      desc: "",
      membersonly: "",
      members: []
    },
    groupBlack: [],
    adminList: [],
    muteList: []
  },
  mutations: {
    updatePublicGroup: function updatePublicGroup(state, publicGroup) {
      state.publicGroupList = publicGroup;
    },
    updateGroupInviteNotifications: function updateGroupInviteNotifications(
      state,
      data
    ) {
      state.groupInviteNotifications = data;
    },
    updateGroupNotifications: function updateGroupNotifications(state, data) {
      state.groupNotifications = data;
    },
    getInfo: function getInfo(state, payload) {
      var gid = payload.gid,
        name = payload.name,
        admin = payload.admin,
        desc = payload.desc,
        membersonly = payload.membersonly,
        members = payload.members;
      state.groupInfo.gid = gid;
      state.groupInfo.name = name;
      state.groupInfo.admin = admin;
      state.groupInfo.desc = desc;
      state.groupInfo.membersonly = membersonly;
      state.groupInfo.members = members;
    },
    updateGroupBlack: function updateGroupBlack(state, payload) {
      state.groupBlack = payload;
    },
    updateAdminList: function updateAdminList(state, payload) {
      state.adminList = payload;
    },
    updateMuteList: function updateMuteList(state, payload) {
      state.muteList = payload;
    }
  },
  actions: {
    //获取公开群组
    onGetPublicGroup: function onGetPublicGroup(context, payload) {
      var limit = 50;
      var options = {
        limit: limit,
        // 预期每页获取的记录数
        success: function success(resp) {
          var publicGroup = resp.data; // console.log("Response: ", publicGroup);
          // let globalCursor = resp.cursor;

          context.commit("updatePublicGroup", publicGroup);
        },
        error: function error(e) {
          console.log("获取群组失败", e);
        }
      };
      WebIM.conn.listGroups(options);
    },
    //获取群组详情
    onGetGroupinfo: function onGetGroupinfo(context, payload) {
      // console.log("onGetGroupinfo", payload)
      // TODO
      var gid = payload.selectId || payload.select_groupid;
      var options = {
        groupId: gid,
        //群组id
        success: function success(resp) {
          var name = resp.data[0].name;
          var admin = resp.data[0].owner;
          var desc = resp.data[0].description;
          var membersonly = resp.data[0].membersonly;
          var members = resp.data[0].affiliations;
          context.commit("getInfo", {
            gid: gid,
            name: name,
            admin: admin,
            desc: desc,
            membersonly: membersonly,
            members: members
          }),
            payload.callback && payload.callback();
        },
        error: function error() {}
      };
      WebIM.conn.getGroupInfo(options);
    },
    //申请加入群组
    onJoinGroup: function onJoinGroup(context, payload) {
      var options = {
        groupId: payload.select_groupid,
        // 群组ID
        success: function success(resp) {
          if (this._vm.state.group.groupInfo.membersonly != true) {
            (0, _elementUi.Message)({
              type: "success",
              message: "已成功加入群组：" + this._vm.state.group.groupInfo.gid
            });
          } else {
            (0, _elementUi.Message)({
              type: "success",
              message:
                "已申请加入群组：" +
                this._vm.state.group.groupInfo.gid +
                "，等待管理员同意"
            });
          }
        },
        error: function error(e) {
          if (e.type == 17) {
            _elementUi.Message.error("您已经在这个群组里了");
          }
        }
      };
      WebIM.conn.joinGroup(options);
    },
    //创建群组
    onCreateGroup: function onCreateGroup(context, payload) {
      var groupname = payload.groupname,
        desc = payload.desc,
        members = payload.members,
        pub = payload.pub,
        approval = payload.approval;
      var options = {
        data: {
          groupname: groupname,
          // 群组名
          desc: desc,
          // 群组描述
          members: members,
          // 用户名组成的数组
          public: pub,
          // pub等于true时，创建为公开群
          approval: approval // approval为true，加群需审批，为false时加群无需审批
        },
        success: function success(resp) {
          this._vm.dispatch("onGetGroupUserList");
        },
        error: function error() {}
      };
      WebIM.conn.createGroupNew(options);
    },
    //将好友加入群组
    onInviteGroup: function onInviteGroup(context, payload) {
      var selectId = payload.selectId,
        selectName = payload.selectName;
      var option = {
        users: [selectName],
        groupId: selectId,
        success: function success(res) {
          _elementUi.Message.success("邀请成功，等待用户同意");
        },
        error: function error(err) {
          if (JSON.parse(err.data).error == "forbidden_op") {
            _elementUi.Message.error(JSON.parse(err.data).error_description);
          }
        }
      };
      WebIM.conn.inviteToGroup(option);
    },
    //收到群组申请,同意进群
    onAgreeJoinGroup: function onAgreeJoinGroup(context, payload) {
      var joinName = payload.joinName,
        joinGroupId = payload.joinGroupId;
      var options = {
        applicant: joinName,
        // 申请加群的用户名
        groupId: joinGroupId,
        // 群组ID
        success: function success(resp) {
          this._vm.dispatch("onGetGroupUserList");
          (0, _elementUi.Message)({
            type: "success",
            message: "已同意！"
          });
        },
        error: function error(e) {}
      };
      WebIM.conn.agreeJoinGroup(options);
    },
    //收到群组申请，拒绝进群
    onRejectJoinGroup: function onRejectJoinGroup(context, payload) {
      var joinName = payload.joinName,
        joinGroupId = payload.joinGroupId;
      var options = {
        applicant: joinName,
        // 申请加群的用户名
        groupId: joinGroupId,
        // 群组ID
        success: function success(resp) {
          (0, _elementUi.Message)({
            type: "success",
            message: "已拒绝！"
          });
        },
        error: function error(e) {}
      };
      WebIM.conn.rejectJoinGroup(options);
    },
    //收到邀请进群通知，同意
    onAgreeInviteGroup: function onAgreeInviteGroup(context, payload) {
      var inviteGroupId = payload.inviteGroupId,
        username = payload.username;
      var options = {
        groupId: inviteGroupId,
        invitee: username,
        success: function success(resp) {
          (0, _elementUi.Message)({
            type: "success",
            message: "已同意加入群组！"
          });
          this._vm.dispatch("onGetGroupUserList");
          this.$forceUpdate();
        },
        error: function error(e) {}
      };
      WebIM.conn.agreeInviteIntoGroup(options);
    },
    //收到邀请进群通知，拒绝
    onRejectInviteGroup: function onRejectInviteGroup(context, payload) {
      var inviteGroupId = payload.inviteGroupId,
        username = payload.username;
      var options = {
        invitee: username,
        groupId: inviteGroupId,
        success: function success(resp) {
          (0, _elementUi.Message)({
            type: "success",
            message: "已拒绝加入群组！"
          });
        },
        error: function error(e) {}
      };
      WebIM.conn.rejectInviteIntoGroup(options);
    },
    //修改群组详情
    onUpdataGroupInfo: function onUpdataGroupInfo(context, payload) {
      var selectId = payload.selectId,
        updateName = payload.updateName,
        updateDesc = payload.updateDesc;
      var option = {
        groupId: selectId,
        groupName: updateName,
        // 群组名称
        description: updateDesc,
        // 群组简介
        success: function success(resp) {
          this._vm.dispatch("onGetGroupUserList");
          this._vm.dispatch("onGetGroupinfo", {
            selectId: selectId
          });
          this.$forceUpdate();
        }
      };
      WebIM.conn.modifyGroup(option);
    },
    //设置管理员
    onSetAdmin: function onSetAdmin(context, payload) {
      var selectId = payload.selectId,
        selectName = payload.selectName;
      var options = {
        groupId: selectId,
        // 群组id
        username: selectName,
        // 用户名
        success: function success(resp) {
          payload.success && payload.success();
        },
        error: function error(e) {}
      };
      WebIM.conn.setAdmin(options);
    },
    //取消管理员
    onRemoveAdmin: function onRemoveAdmin(context, payload) {
      var selectId = payload.selectId,
        selectName = payload.selectName;
      var options = {
        groupId: selectId,
        // 群组id
        username: selectName,
        // 用户名
        success: function success(resp) {
          payload.success && payload.success();
        },
        error: function error(e) {}
      };
      WebIM.conn.removeAdmin(options);
    },
    //获取管理员列表
    getGroupAdmin: function getGroupAdmin(context, payload) {
      var selectId = payload.selectId,
        selectName = payload.selectName;
      var options = {
        groupId: selectId,
        // 群组id
        success: function success(resp) {
          context.commit("updateAdminList", resp.data);
        },
        error: function error(e) {}
      };
      WebIM.conn.getGroupAdmin(options);
    },
    //添加群组禁言
    onAddMute: function onAddMute(context, payload) {
      var selectId = payload.selectId,
        selectName = payload.selectName;
      var options = {
        username: selectName,
        // 成员用户名
        muteDuration: 886400000,
        // 禁言的时长，单位是毫秒
        groupId: selectId,
        success: function success(resp) {
          context.commit("updateMuteList", resp.data);
          payload.success && payload.success();
        },
        error: function error(e) {}
      };
      WebIM.conn.mute(options);
    },
    //移除禁言
    onRemoveMute: function onRemoveMute(context, payload) {
      var selectId = payload.selectId,
        selectName = payload.selectName;
      var options = {
        groupId: selectId,
        // 群组ID
        username: selectName,
        // 成员用户名
        success: function success(resp) {
          context.commit("updateMuteList", resp.data);
          payload.success && payload.success();
        },
        error: function error(e) {}
      };
      WebIM.conn.removeMute(options);
    },
    //获取禁言列表
    getMuted: function getMuted(context, payload) {
      var selectId = payload.selectId,
        selectName = payload.selectName;
      var options = {
        groupId: selectId,
        // 群组ID
        success: function success(resp) {
          console.log("禁言列表", resp);
          context.commit("updateMuteList", resp.data);
        },
        error: function error(e) {}
      };
      WebIM.conn.getMuted(options);
    },
    //添加群组黑名单
    onAddGroupBlack: function onAddGroupBlack(context, payload) {
      var selectId = payload.selectId,
        selectName = payload.selectName;
      var options = {
        groupId: selectId,
        // 群组ID
        username: selectName,
        // 将要被加入黑名单的用户名
        success: function success(resp) {
          this._vm.dispatch("onGetGroupinfo", {
            selectId: selectId
          });
          this.$forceUpdate();
          console.log("添加群组黑名单成功");
        },
        error: function error(e) {}
      };
      WebIM.conn.groupBlockSingle(options);
    },
    //移除群组黑名单
    onRemoveGroupBlack: function onRemoveGroupBlack(context, payload) {
      var selectId = payload.selectId,
        removeGroupName = payload.removeGroupName;
      var options = {
        groupId: selectId,
        // 群组ID
        username: removeGroupName,
        // 需要移除的用户名
        success: function success(resp) {
          console.log("移除成功Response: ", resp);
          this._vm.dispatch("onGetGroupBlack", {
            selectId: selectId
          });
          this.$forceUpdate();
        },
        error: function error(e) {}
      };
      WebIM.conn.removeGroupBlockSingle(options);
    },
    //获取群组黑名单
    onGetGroupBlack: function onGetGroupBlack(context, payload) {
      var selectId = payload.groupid || payload.selectId;
      var option = {
        groupId: selectId,
        success: function success(list) {
          var blackName = list.data;
          context.commit("updateGroupBlack", blackName);
        },
        error: function error() {
          console.log("Get group black list error.");
        }
      };
      WebIM.conn.getGroupBlacklistNew(option);
    },
    //移除群组成员
    onRemoveGroupUser: function onRemoveGroupUser(context, payload) {
      var selectId = payload.selectId,
        selectName = payload.selectName;
      var options = {
        groupId: selectId,
        username: selectName,
        success: function success(resp) {},
        error: {}
      };
      WebIM.conn.removeSingleGroupMember(options);
    },
    //退出群组
    onQuitGroup: function onQuitGroup(context, payload) {
      var option = {
        groupId: payload.selectId,
        success: function success() {
          this._vm.dispatch("onGetGroupUserList");
          payload.callback();
          this.$forceUpdate();
        },
        error: function error() {
          console.log("Leave room faild");
        }
      };
      WebIM.conn.quitGroup(option);
    },
    //解散群组
    onDissolveGroup: function onDissolveGroup(context, payload) {
      var option = {
        groupId: payload.selectId,
        success: function success() {
          this._vm.dispatch("onGetGroupUserList");
          payload.callback();
          this.$forceUpdate();
        }
      };
      WebIM.conn.dissolveGroup(option);
    }
  },
  getters: {
    onGetPublicGroup: function onGetPublicGroup(state) {
      return state.publicGroupList;
    },
    onGetGroupinfo: function onGetGroupinfo(state) {
      return state.groupInfo[item];
    }
  }
};
var _default = Group;
exports["default"] = _default;
