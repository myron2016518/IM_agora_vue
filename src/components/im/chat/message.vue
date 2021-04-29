<template>
  <div class="messagebox" v-show="activedKey[type] != ''">
    <div class="messagebox-header">
      <!-- <div>{{type}}</div> -->
      <span class="im_user_action_1">{{
        activedKey[type].imName || activedKey[type].name
      }}</span>
      <div class="im_user_action">
        <a-icon
          type="left"
          class="user-goback"
          v-show="broken"
          @click="showUserList"
        />
        <!-- v-show="isHttps" -->
        <span
          class="im_user_action_2"
          v-show="isHttps"
          @click="callVideo"
          :style="nowIsVideo ? 'pointer-events: none' : 'cursor: pointer'"
        >
          <i class="el-icon-video-camera icon im_user_action_3"></i>
          &nbsp;&nbsp;&nbsp;&nbsp;视频通话
        </span>
        <span
          class="im_user_action_2"
          v-show="isHttps"
          @click="callVoice"
          :style="nowIsVideo ? 'pointer-events: none' : 'cursor: pointer'"
        >
          <i
            v-if="type === 'contact'"
            class="el-icon-microphone icon im_user_action_3"
          ></i>
          &nbsp;&nbsp;&nbsp;&nbsp;语言通话
        </span>
        <span
          class="im_user_action_2"
          @click="onCreateTask"
          :style="nowIsVideo ? 'pointer-events: none' : 'cursor: pointer'"
        >
          <i
            v-if="type === 'contact'"
            class="el-icon-document-add icon im_user_action_3"
          ></i>
          &nbsp;&nbsp;&nbsp;&nbsp;发起远程
        </span>

        <a-icon
          v-if="type == 'group'"
          type="ellipsis"
          class="user-ellipsis"
          @click="changeMenus"
        />
        <!-- <a-dropdown v-else-if="type == 'contact'">
          <a
            class="ant-dropdown-link user-ellipsis"
            href="#"
            @click="changeMenus"
          >
            <a-icon type="ellipsis" />
            <span class="im_user_action_1">{{
              `${activedKey[type].name} &nbsp;&nbsp; ${activedKey[type]
                .groupid || ""}`
            }}</span>
          </a>
          <a-menu slot="overlay">
            <a-menu-item @click="menuClick('1')">
              <a href="javascript:;">加入黑名单</a>
            </a-menu-item>
            <a-menu-item @click="menuClick('2')">
              <a href="javascript:;">删除好友</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown> -->
      </div>
    </div>

    <div class="messagebox-content" ref="msgContent">
      <div class="moreMsgs" @click="loadMoreMsgs">{{ loadText }}</div>
      <div
        v-for="(item, i) in msgList"
        :key="i"
        class="message-group"
        :style="{ float: item.bySelf ? 'right' : 'left' }"
      >
        <!-- <img
          v-if="!item.bySelf"
          :src="curUserInfo.headimgurl || ''"
          class="tc_header_img"
          alt="头像"
          onerror="this.src='https://thinklink.mythinkcar.cn/static/img/user.jpeg';this.onerror=null"
        /> -->
        <img
          v-if="!item.bySelf"
          :src="activedKey[type].logo_url || ''"
          class="tc_header_img"
          alt="头像"
          onerror="this.src='https://thinklink.mythinkcar.cn/static/img/user.jpeg';this.onerror=null"
        />
        <!-- <h4 style="text-align: left;margin:0">{{ item.from }}</h4> -->
        <!-- 撤回消息 -->
        <div v-if="item.status == 'recall'" class="recallMsg">
          {{ item.msg }}
        </div>
        <div v-if="item.status == 'recall'" class="recallMsg">
          {{ renderTime(item.time) }}
        </div>
        <!-- 撤回消息 end -->
        <a-dropdown
          v-else
          :trigger="['contextmenu']"
          :style="{ float: item.bySelf ? 'right' : 'left' }"
          :disabled="!item.bySelf"
        >
          <span style="user-select: none">
            <!-- <el-dropdown v-else @command="handleCommand(item)" trigger="click" :style="{'float':item.bySelf ? 'right':'left'}">
            <span class="el-dropdown-link">-->
            <!-- 图片消息 -->
            <img
              :key="item.msg"
              :src="item.msg ? item.msg : ''"
              v-if="item.type === 'img'"
              class="img-style"
              name="referrer"
              content="no-referrer"
            />
            <!-- 文件card -->
            <div
              v-else-if="item.type === 'file'"
              class="file-style"
              :style="{ float: item.bySelf ? 'right' : 'left' }"
            >
              <el-card :body-style="{ padding: '0px' }">
                <div style="padding: 14px;">
                  <h2>文件</h2>
                  <span>
                    <h3>{{ item.filename }}</h3>
                  </span>
                  <div class="bottom clearfix">
                    <span>{{ readablizeBytes(item.file_length) }}</span>
                    <a :href="item.msg" :download="item.filename">点击下载</a>
                  </div>
                </div>
              </el-card>
            </div>
            <!-- 音频消息 -->
            <div
              v-else-if="item.type === 'audio'"
              :style="{ float: item.bySelf ? 'right' : 'left' }"
            >
              <audio :src="item.msg" controls></audio>
            </div>
            <!-- 视频消息 -->
            <div v-else-if="item.type === 'video'">
              <video :src="item.msg" width="100%" controls></video>
            </div>
            <!-- 自定义消息 -->
            <div v-else-if="item.type === 'custom'" class="custom-style">
              <div
                v-if="item.msg.order_state == customMsgState[0]"
                class="custom-item"
                @click="onCustomMsgClick(item)"
              >
                <div class="title bold">您好，请帮我维修一下车辆</div>
                <div class="content">
                  <div v-if="item.msg.service">
                    <span class="text-muted">服务项目：</span
                    >{{ item.msg.service }}
                  </div>
                  <div>
                    <span class="text-muted">车辆信息：</span>
                    {{ item.msg.task_type == 1 ? "智能诊断" : formatCar(item) }}
                  </div>
                </div>
                <div class="im_msg_i_f">点击查看订单详情</div>
              </div>
              <div
                v-if="item.msg.order_state == customMsgState[1]"
                class="custom-item im_msg_main"
                @click="onCustomMsgClick(item)"
              >
                <div class="title bold">
                  {{
                    item.msg.price_image
                      ? "我已创建了服务订单，请尽快确认和支付吧！"
                      : "我已接受订单，该订单免费。"
                  }}
                </div>
                <div class="content">
                  <div v-if="item.msg.service">
                    <span class="text-muted">服务项目：</span
                    >{{ item.msg.service }}
                  </div>
                  <div>
                    <span class="text-muted">车辆信息：</span>
                    {{ item.msg.task_type == 1 ? "智能诊断" : formatCar(item) }}
                  </div>
                  <div>
                    <span class="text-muted">服务价格：</span
                    ><span class="gold">￥{{ item.msg.price }}</span>
                  </div>
                  <template v-if="item.msg.price_image">
                    <div class="im_msg_1">
                      <img
                        class="qrcode_price im_msg_img1"
                        :src="item.msg.price_image"
                        name="referrer"
                        content="no-referrer"
                      />
                    </div>
                    <div class="text-muted im_msg_2">微信扫码支付</div>
                  </template>
                </div>
                <div class="im_msg_i_f">点击查看订单详情</div>
              </div>
              <div
                v-if="item.msg.order_state == customMsgState[2]"
                class="custom-item"
                @click="onCustomMsgClick(item)"
              >
                <div class="title bold">费用已支付，请您尽快安排远程诊断</div>
                <div class="content">
                  <div>
                    <span class="text-muted">设备SN：</span
                    >{{ item.msg.serial_number }}
                  </div>
                  <div>
                    <span class="text-muted">车辆信息：</span>
                    {{ item.msg.task_type == 1 ? "智能诊断" : formatCar(item) }}
                  </div>
                </div>
                <div class="im_msg_i_f">点击查看订单详情</div>
              </div>
              <div
                v-if="item.msg.order_state == customMsgState[3]"
                class="custom-item"
                @click="onCustomMsgClick(item)"
              >
                <div class="title bold">
                  我已帮您完成完成远程诊断，请确认诊断结果，并给予评价
                </div>
                <div class="content">
                  <div v-if="item.msg.service">
                    <span class="text-muted">服务项目：</span
                    >{{ item.msg.service }}
                  </div>
                  <div>
                    <span class="text-muted">车辆信息：</span>
                    {{ item.msg.task_type == 1 ? "智能诊断" : formatCar(item) }}
                  </div>
                  <!-- <a
                    style="margin:10px 0"
                    class="weui-btn weui-btn_primary weui-btn_block"
                    block
                    >确认订单</a
                  > -->
                  <div clas="text-muted text-small">
                    若未进行确认，系统将在三天后自动默认确定并且五星好评。
                  </div>
                </div>
                <div class="im_msg_i_f">点击查看订单详情</div>
              </div>
              <div
                v-if="item.msg.order_state == customMsgState[4]"
                class="custom-item"
                @click="onCustomMsgClick(item)"
              >
                <div class="title bold">十分抱歉，我已放弃了该订单。</div>
                <div class="content">
                  <div v-if="item.msg.service">
                    <span class="text-muted">服务项目：</span
                    >{{ item.msg.service }}
                  </div>
                  <div>
                    <span class="text-muted">车辆信息：</span>
                    {{ item.msg.task_type == 1 ? "智能诊断" : formatCar(item) }}
                  </div>
                  <!-- 金额大于0，且已支付 -->
                  <div v-if="item.msg.price && item.msg.pay_status == 1">
                    <span class="text-muted">退款金额：</span>
                    <span class="gold">￥ {{ item.msg.price }}</span>
                  </div>
                </div>
                <div class="im_msg_i_f">点击查看订单详情</div>
              </div>
              <!-- 诊断报告 -->
              <div
                v-if="item.msg.order_state == 'diagnose_file'"
                class="custom-item"
                @click="onViewReport(item.msg.report_url)"
              >
                <div class="title bold">全系统诊断报告</div>
                <div class="content">
                  <div>
                    <span class="text-muted">车辆信息：</span>
                    {{ formatCar(item) }}
                  </div>
                  <div>
                    <span class="text-muted">VIN：</span>
                    {{ item.msg.vin }}
                  </div>
                  <!-- <v-icon name="newspaper-o" class="link" size="40px" /> -->
                  <!-- <div class="text-muted">点击查看</div> -->
                </div>
                <div class="im_msg_i_f">点击查看订单详情</div>
              </div>
            </div>
            <!-- 聊天消息 -->
            <p
              style="user-select: text"
              v-else-if="item.msg"
              v-html="renderTxt(item.msg, item)"
              :class="{ byself: item.bySelf }"
            />

            <!-- <div v-if="item.bySelf?true:false" class="status">{{status[item.status]}}</div> -->
          </span>
          <!-- <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item command="a" :disabled="!item.bySelf">撤回</el-dropdown-item>
          </el-dropdown-menu>
          </el-dropdown>-->

          <a-menu slot="overlay">
            <a-menu-item key="1" @click="handleCommand(item)">撤回</a-menu-item>
          </a-menu>
        </a-dropdown>

        <!-- 聊天时间 -->
        <div
          v-if="item.status !== 'recall' && item.msg"
          class="time-style"
          :style="{ 'text-align': item.bySelf ? 'right' : 'left' }"
        >
          {{ renderTime(item.time) }}
          {{ item.bySelf ? status[item.status] : "" }}
        </div>
      </div>
    </div>
    <div class="messagebox-footer">
      <div class="footer-icon">
        <!-- 表情组件 -->
        <ChatEmoji v-on:selectEmoji="selectEmoji" :inpMessage="message" />
        <!-- 上传图片组件 -->
        <UpLoadImage :type="this.type" :chatId="activedKey[type]" />
        <!-- 上传文件组件 -->
        <UpLoadFile :type="this.type" :chatId="activedKey[type]" />

        <!-- 发送语音 -->
        <RecordAudio v-show="isHttps" />

        <!-- <i
          class="el-icon-video-camera icon"
          @click="callVideo"
          v-show="isHttps && type != 'chatroom'"
          :style="nowIsVideo ? 'pointer-events: none' : 'cursor: pointer'"
        ></i>
        <i
          v-if="type === 'contact'"
          class="el-icon-microphone icon"
          @click="callVoice"
          v-show="isHttps && type != 'chatroom'"
          :style="nowIsVideo ? 'pointer-events: none' : 'cursor: pointer'"
        ></i> -->
        <el-dropdown @command="changyongyuChange">
          <span class="el-dropdown-link">
            常用语<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(_item, _idx) in usefulExpressions"
              :command="_item.name"
              :key="_idx"
              >{{ _item.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="fotter-send">
        <a-input
          v-model="message"
          equired
          placeholder="消息"
          class="sengTxt"
          @pressEnter="onSendTextMsg"
          style="resize:none"
          ref="txtDom"
        />
        <el-button type="primary" @click="onSendTextMsg">发送</el-button>
        <template />
      </div>
    </div>

    <!-- fix 移动到全局 -->
    <!-- <AddAVMemberModal ref="addAvMembertModal" :to="activedKey[type]" @start="start_multi"/> -->
    <!-- <EmediaModal ref="emediaModal" @changeIsVideoState="changeIsVideoState" /> -->
    <!-- <MultiAVModal :to="activedKey[type]" /> -->

    <!-- 订单详情 -->
    <task-detail-for-b
      class="im_task_dfb"
      :show="showTaskDetailForB"
      :taskId="taskId"
      :showIM="false"
      :customer="customer"
      @close="showTaskDetailForB = false"
    />

    <!-- 诊断报告 -->
    <v-popup v-model="showReport" :style="{ width: '80%', height: '90%' }">
      <iframe :src="reportUrl" class="iframe"></iframe>
    </v-popup>
  </div>
</template>

<script>
// @ts-nocheck
/* eslint-disable */
// @ts-ignore
import ChatEmoji from "../chatEmoji/index.vue";
import emoji from "../config/emoji";
import UpLoadImage from "../upLoadImage/index.vue";
import UpLoadFile from "../upLoadFile/index.vue";
import RecordAudio from "../recorder/index.vue";
import TaskDetailForB from "./task_detail_for_b";
import "./index.less";
import { mapActions, mapGetters } from "vuex";
import { getUserInfoByHxId } from "@/api/api";
import { isObject } from "@/utils/utils";
import { Popup } from "vant";

import moment from "moment";
import _ from "lodash";
moment.locale("zh-cn");
// import MultiAVModal from "../emediaModal/multiAVModal";
// import EmediaModal from "../emediaModal/index";

export default {
  data() {
    return {
      activedKey: {
        contact: "",
        group: "",
        chatroom: "",
      },
      message: "",
      isHttps: window.location.protocol === "https:",
      loadText: "加载更多",
      status: {
        sending: "发送中",
        sent: "已发送",
        read: "已读",
      },
      nowIsVideo: false,
      customMsgState: [
        //im自定义消息状态
        "order_help", //发起订单
        "received_order_help", //接受订单
        "order_payed", //订单已付款
        "diagnose_finish", //诊断完成
        "giveup_order", //放弃订单
      ],
      howUsefulExpressions: false, //是否显示常用语
      usefulExpressions: [
        { name: "您好，在吗？帮忙做个远程。" },
        { name: "点火开关已打开。" },
        { name: "点火开关已关闭。" },
        { name: "设备已经连好了，网络也连好了，可以开始了。" },
        { name: "我已经支付好了。" },
      ],
      showTaskDetailForB: false,
      taskId: "",
      customer: null, //c端用户
      showReport: false, //是否展示诊断报告
      reportUrl: "", //诊断报告地址
      curUserInfo:
        localStorage.getItem("userInfo") &&
        JSON.parse(localStorage.getItem("userInfo")),
    };
  },

  beforeMount() {
    if (this.type === "contact") {
      this.onGetContactUserList();
    } else if (this.type === "group") {
      this.onGetGroupUserList();
    } else if (this.type === "chatroom") {
      this.onGetChatroomUserList();
    }
  },
  updated() {
    // console.log("数据", this.$store);
    this.scollBottom();
  },
  computed: {
    ...mapGetters({
      contact: "onGetContactUserList",
      group: "onGetGroupUserList",
      chatroom: "onGetChatroomUserList",
      msgList: "onGetCurrentChatObjMsg",
    }),
    userList() {
      return {
        contact: this.contact,
        group: this.group,
        chatroom: this.chatroom,
      };
    },
    selectedKeys() {
      return [this.getKey(this.activedKey[this.type]) || ""];
    },
  },
  props: [
    "type", // 聊天类型 contact, group, chatroom
    "username", // 选中的聊天对象
    "broken", // 是否适应移动端
    "showUserList",
    "hideUserList",
  ],
  methods: {
    ...mapActions([
      "onGetContactUserList",
      "onGetGroupUserList",
      "onGetChatroomUserList",
      "onGetCurrentChatObjMsg",
      "onSendText",
      "onCallVideo",
      "onCallVoice",
      "getGroupMembers",
      "getHistoryMessage",
      "onAddBlack",
      "onDelteFirend",
      "recallMessage",
      "onGetGroupBlack",
    ]),
    changyongyuChange(command) {
      // this.$message("click on item " + command);
      //选择常用语
      this.message = command;
      this.onSendTextMsg();
    },
    getKey(item, type) {
      let key = "";
      switch (type) {
        case "contact":
          key = item.name;
          break;
        case "group":
          key = item.groupid;
          break;
        case "chatroom":
          key = item.id;
          break;
        default:
          break;
      }
      return key;
    },
    getCurrentMsg(props) {
      this.onGetCurrentChatObjMsg({
        type: props,
        id: this.getKey(this.activedKey[props], props),
      });
    },
    select(key) {
      this.$data.activedKey[this.type] = key;
      const me = this;
      me.$data.loadText = "加载更多";
      // if( me.roomId){
      //     WebIM.conn.quitChatRoom({
      //         roomId: me.roomId // 聊天室id
      //     });
      //     me.roomId = ''
      //   }

      if (this.type === "group") {
        this.$router.push({ name: this.type, params: { id: key.groupid } });
        this.onGetCurrentChatObjMsg({ type: this.type, id: key.groupid });

        setTimeout(() => {
          this.$store.commit("updateMessageStatus", {
            action: "oneUserReadMsgs",
            readUser: key.groupid,
          });
          this.$forceUpdate();
        }, 100);

        if (!this.msgList) {
          this.getHistoryMessage({ name: key.groupid, isGroup: true });
        }
      } else if (this.type === "contact") {
        // this.$router.push({ name: this.type, params: { id: key.name } });
        this.onGetCurrentChatObjMsg({ type: this.type, id: key.name });
        setTimeout(() => {
          this.$store.commit("updateMessageStatus", {
            action: "oneUserReadMsgs",
            readUser: key.name,
          });
          this.$forceUpdate();
        }, 100);

        if (!this.msgList) {
          this.getHistoryMessage({ name: key.name, isGroup: false });
        }
      } else if (this.type === "chatroom") {
        const me = this;
        // me.roomId = key.id

        this.$router.push({ name: this.type, params: { id: key.id } });
        this.onGetCurrentChatObjMsg({ type: this.type, id: key.id });

        WebIM.conn.joinChatRoom({
          roomId: key.id, // 聊天室id
          success: function() {
            // console.log("加入聊天室成功");
            if (!me.msgList) {
              me.getHistoryMessage({ name: key.id, isGroup: true });
              setTimeout(() => {
                me.$forceUpdate();
              }, 100);
            }
          },
        });
      }
    },

    loadMoreMsgs() {
      const me = this;
      const success = function(msgs) {
        if (msgs.length === 0) {
          me.$data.loadText = "已无更多数据";
        }
      };
      let name = "";
      let isGroup = false;
      if (this.type === "contact") {
        name = this.$data.activedKey[this.type].name;
      } else if (this.type === "group") {
        name = this.$data.activedKey[this.type].groupid;
        isGroup = true;
      } else if (this.type === "chatroom") {
        name = this.$data.activedKey[this.type].id;
        isGroup = true;
      }
      this.getHistoryMessage({
        name,
        isGroup,
        success,
      });
    },

    changeMenus() {
      if (this.type === "contact") {
      } else if (this.type === "group") {
        this.$refs.groupInfoModel.chengeInfoModel();
      }
    },
    menuClick(i) {
      this.changeMenus();
      switch (i) {
        case "1":
          // console.log("加入黑名单");
          this.onAddBlack({
            userId: this.$data.activedKey[this.type],
          });
          this.$data.activedKey.contact = "";
          this.$router.push({
            // 核心语句
            path: "/contact", // 跳转的路径
          });
          break;
        case "2":
          this.onDelteFirend({
            userId: this.$data.activedKey[this.type],
            callback: () => {
              this.closeContactMessage();
            },
          });
          break;
        default:
          break;
      }
    },

    onSendTextMsg() {
      if (this.$data.message == "" || this.$data.message == "\n") {
        this.$data.message = "";
        return;
      }
      this.onSendText({
        chatType: this.type,
        chatId: this.$data.activedKey[this.type],
        message: this.$data.message,
      });
      this.$data.message = "";
    },

    selectEmoji(v) {
      this.$data.message = v;
      this.$refs.txtDom.focus();
    },

    customEmoji(value) {
      return `<img src="https://im.mythinkcar.cn/static/faces/${value}" style="width:20px"/>`;
    },
    getImName(_im) {
      let _f = this.userList.contact.filter((_item) => _item.name == _im);
      let _name = _im;
      if (_f) {
        _name = _f.imName || _f.name;
      }
      return _name;
    },
    renderTxt(txt = "", _sd) {
      console.log("===msg====", txt, _sd, this.userList, this.activedKey);
      let rnTxt = [];
      let match = null;
      const regex = /(\[.*?\])/g;
      let start = 0;
      let index = 0;
      while ((match = regex.exec(txt))) {
        index = match.index;
        if (index > start) {
          rnTxt.push(txt.substring(start, index));
        }
        if (match[1] in emoji.obj) {
          const v = emoji.obj[match[1]];
          rnTxt.push(this.customEmoji(v));
        } else {
          rnTxt.push(match[1]);
        }
        start = index + match[1].length;
      }
      rnTxt.push(txt.substring(start, txt.length));
      return rnTxt.toString().replace(/,/g, "");
    },

    callVideo() {
      if (this.type == "contact") {
        const val = this.$data.activedKey[this.type].name;
        this.$emit("EmediaModalFun", [val], 1);
      } else if (this.type == "group") {
        this.getGroupMembers(this.$data.activedKey[this.type].groupid);
        let _this = this;
        this.$emit("show_add_member_modal");
      }
    },
    callVoice() {
      const val = this.$data.activedKey[this.type].name;
      this.$emit("EmediaModalFun", [val], 0);
    },

    readablizeBytes(value) {
      let s = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
      let e = Math.floor(Math.log(value) / Math.log(1024));
      return (value / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    },

    // TODO 可以抽离到utils
    renderTime(time) {
      time = parseInt(time);
      const nowStr = new Date();
      const localStr = time ? new Date(time) : nowStr;
      const localMoment = moment(localStr);
      // const localFormat = localMoment.format("MM-DD hh:mm A");
      const localFormat = localMoment.fromNow();
      return localFormat;
    },
    getLastMsg(item) {
      const { name, params } = this.$route;
      const chatList = this.$store.state.chat.msgList[name];
      let userId = "";
      if (name == "contact") {
        userId = item.name;
      } else if (name == "group") {
        userId = item.groupid;
      } else {
        userId = item.id;
      }
      const currentMsgs = chatList[userId] || [];
      const lastMsg = currentMsgs.length
        ? currentMsgs[currentMsgs.length - 1].msg
        : "";
      const msgTime = currentMsgs.length
        ? this.renderTime(currentMsgs[currentMsgs.length - 1].time)
        : "";
      return { lastMsg, msgTime };
    },
    scollBottom() {
      setTimeout(() => {
        const dom = this.$refs.msgContent;
        if (!dom) return;
        dom.scrollTop = dom.scrollHeight;
      }, 0);
    },
    handleCommand(item) {
      let name = "";
      if (this.type === "contact") {
        name = this.$data.activedKey[this.type].name;
      } else if (this.type === "group") {
        name = this.$data.activedKey[this.type].groupid;
      } else if (this.type === "chatroom") {
        name = this.$data.activedKey[this.type].id;
      }
      this.recallMessage({ to: name, message: item });
    },
    closeGroupMessage() {
      //退出群组或解散群组时关闭聊天框
      this.$data.activedKey["group"] = "";
    },
    closeContactMessage() {
      //删除好友时关闭当前聊天框
      this.$data.activedKey["contact"] = "";
    },
    // changeIsVideoState(v) {
    //   v ? (this.$data.nowIsVideo = true) : (this.$data.nowIsVideo = false);
    // }
    formatCar(item) {
      let msg = item.msg || {};
      let arr = [msg.brand, msg.models, msg.year].filter(
        (item) => item && item !== "不限"
      );
      return arr.join("/");
    },
    onCustomMsgClick(item) {
      let { task_id } = item.msg;
      console.log("onCustomMsgClick", item);
      if (task_id) {
        this.taskId = task_id;
        this.showTaskDetailForB = true;
      } else {
        this.$message("缺少参数：task_id");
      }
    },
    onSendMsgAboutTask(item) {
      //发送自定义消息
      console.log("发送自定义消息", item);
      this.onSendCustomMsg({
        chatType: this.type,
        chatId: item.to_hx_id
          ? { name: item.to_hx_id }
          : this.$data.activedKey[this.type],
        message: item,
      });
    },
    onViewReport(url) {
      //查看报告
      // this.reportUrl = url;
      // if (this.reportUrl) {
      //   this.showReport = true;
      // }
      window.open(url);
    },

    onCreateTask() {
      //创建任务

      /*let item = {
              order_state:'diagnose_file',
              task_type:1,
              brand:'',
              models:'',
              year:'',
              task_id: "",
              report_url:'http://www.baidu.com'

            }
            this.onSendMsgAboutTask(item)
            return*/
      //通过im账号获取用户信息及设备序列号
      console.log("===", this.$data.activedKey[this.type]);
      let hx_id = this.$data.activedKey[this.type].name;
      this.getUserInfoByHxId(hx_id).then((data) => {
        console.log("获取im：", data);
        this.taskId = "";
        this.customer = data;
        this.showTaskDetailForB = true;
      });
    },
    getUserInfoByHxId(hx_id = "") {
      this.$showLoading();
      let params = {
        hx_id,
      };
      return getUserInfoByHxId(params)
        .then((data) => {
          this.$hideLoading();
          if (data.data && isObject(data.data)) {
            if (data.data.sn_info && data.data.sn_info.length == 0) {
              return Promise.reject("对方没有C端设备，无法远程诊断");
            } else {
              return Promise.resolve(data.data);
            }
          } else {
            return Promise.reject("未获取到对方用户信息及设备");
          }
        })
        .catch((err) => {
          // this.$toast(err);
          console.log("==err=", err);
          this.$message.error(err);
          return Promise.reject();
        });
    },
  },
  components: {
    ChatEmoji,
    UpLoadImage,
    UpLoadFile,
    RecordAudio,
    // AddAVMemberModal,
    // MultiAVModal,
    // EmediaModal,
    TaskDetailForB,
    vPopup: Popup,
  },
};
</script>

<style scoped lang="less">
.byself {
  float: right;
}
.recallMsg {
  font-size: 12px;
  color: #aaa;
  width: 100%;
  text-align: center;
}
.custom-title {
  font-weight: 500;
}
.moreMsgs {
  background: #e8e8e8 !important;
  border-radius: 8px;
  cursor: pointer;
  padding: 1% 2%;
  text-align: center;
}
.status {
  display: inline;
  position: relative;
  top: 20px;
  font-size: 12px;
  left: -6px;
  color: #736c6c;
  float: left;
}
.unreadNum {
  float: left;
  width: 100%;
}
.icon-style {
  display: inline-block;
  background-color: #f04134;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: white;
  line-height: 1.5;
  text-align: center;
}
.emoji-style {
  width: 22px;
  float: left;
}
.img-style {
  max-width: 350px;
}
.time-style {
  clear: both;
  margin-left: 2px;
  margin-top: 3px;
  font-size: 12px;
  color: #888c98;
}
.file-style {
  width: 240px;
  margin: 2px 2px 2px 0;
  font-size: 13px;
  h2 {
    border-bottom: 1px solid #e0e0e0;
    font-weight: 300;
    text-align: left;
  }
  h3 {
    max-width: 100%;
    font-size: 15px;
    height: 20px;
    line-height: 20px;
    font-weight: 600;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    margin-bottom: 20px;
  }
  .bottom {
    span {
      color: #999999;
      text-align: left;
    }
  }
  a {
    color: #999999;
    float: right;
    text-decoration: none;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
.im_user_action_1 {
  float: left;
}
.im_user_action {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .im_user_action_2 {
    margin-right: 6%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .im_user_action_3 {
    font-size: 20px;
    padding-right: 5px;
  }
}
.custom-style {
  .custom-item {
    cursor: pointer;
    display: inline-block;
    padding: 10px 20px;
    background-color: #e5e7eb;
    border: 1px solid #ddd;
    text-align: left;
    border-radius: 10px;
    .title {
      font-size: 14px;
      font-weight: 600;
      padding: 0;
    }

    .content {
      // margin-top: 5px;
      padding: 5px 0;
      // background-color: #efefef;
      border-radius: 5px;
    }
    .im_msg_i_f {
      border-top: 1px solid #ccc;
      padding-top: 10px;
      color: #888c98;
      font-size: 12px;
    }
  }
  .text-muted {
    color: #888c98;
  }
  .im_msg_main {
    background-color: #1890ff;
    border: 1px solid #1890ff;
    color: #fff;
    .title,
    .text-muted,
    .im_msg_i_f {
      color: #fff;
    }
    .im_msg_img1 {
      width: 100px;
      height: 100px;
    }
    .im_msg_1 {
      padding: 5px;
    }
    .im_msg_2 {
      font-size: 12px;
    }
  }
}
.im_task_dfb {
  // position: fixed;
  // top: 0;
  // background: #fff;
  // width: 100%;
  // height: 100%;
  // z-index: 10;
  // display: none;
}
.tc_header_img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  float: left;
  margin-right: 5px;
}
.tc_header_img2 {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  float: left;
  margin-left: 5px;
}
</style>
