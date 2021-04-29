<template>
  <Draggable
    v-show="emediaModalVisible"
    class="wrap"
    :class="{ minimize: minimize }"
  >
    <div class="full-call">
      <div class="top-section" v-if="callState">
        <v-icon
          class-prefix="el-icon"
          name="arrow-down"
          @click="onMinmizeModal"
        />
      </div>
      <div class="middle-section">
        <div v-show="inviteState || (callState && streamType == 'VOICE')">
          <!-- <img class="img" :src="userInfo.headimgurl" /> -->
          <img class="img" src="@/assets/user.jpeg" />
          <p class="text-large">{{ contact }}</p>
        </div>
        <p v-if="inviteState && role == 'caller'" class="text-small">
          正在等待对方接受邀请...
        </p>
        <p v-if="callState && streamType == 'VOICE'" class="text-small">
          通话中...
        </p>
        <p v-if="inviteState && role == 'callee'" class="mask">
          请求与您{{ streamType == "VOICE" ? "语音" : "视频" }}通话
        </p>
      </div>
      <div class="bottom-section">
        <!-- 已接通 -->
        <template v-if="callState">
          <!-- 对方视频镜像和旋转 -->
          <span v-show="streamType == 'VIDEO'" ref="video" isopen="true">
            <v-icon class-prefix="el-icon" name="refresh" @click="changeJTXZ" />
            <br />
            <span>旋转</span>
            <!-- <p class="tc_font_14" @click="changeJTXZ">
              镜头旋转
            </p> -->
            <!-- <p
              :class="isjxxz ? 'tc_font_14 tc_xuanz1' : 'tc_font_14'"
              @click="changeJXXZ"
            >
              水平翻转
            </p> -->
            <!-- <p
              :class="isxz ? 'tc_font_14 tc_xuanz2' : 'tc_font_14'"
              @click="changeXZ"
            >
              垂直翻转
            </p> -->
          </span>
          <span
            ref="audio"
            isopen="true"
            :class="{ 'is-active': !turnOnAudio }"
          >
            <v-icon
              class-prefix="el-icon"
              :name="turnOnAudio ? 'microphone' : 'turn-off-microphone'"
              @click="controlStream('audio')"
            />
            <br />
            <span>静音</span>
          </span>
          <!-- 视频时打开或关闭我的摄像头 -->
          <span
            v-show="streamType == 'VIDEO'"
            ref="video"
            isopen="true"
            :class="{ 'is-active': !turnOnVideo }"
          >
            <v-icon
              class-prefix="el-icon"
              name="video-camera"
              @click="controlStream('video')"
            />
            <br />
            <span>摄像头</span>
          </span>
          <!-- 拒绝或结束通话邀请 -->
          <span>
            <v-icon
              class-prefix="el-icon"
              name="switch-button"
              class="turn-off"
              @click="handleQuitMeeting"
            /><br />
            <span>挂断</span>
          </span>
        </template>
        <!-- 未接通 --><!-- 结束通话邀请 -->
        <span v-if="inviteState && role == 'caller'">
          <v-icon
            class-prefix="el-icon"
            name="switch-button"
            class="turn-off"
            @click="handleCancelCall"
          /><br />
          <span>取消</span>
        </span>

        <!-- 被呼叫者未接通时操作界面 -->
        <template v-if="inviteState && role == 'callee'">
          <span>
            <v-icon
              class="refuse-icon"
              class-prefix="el-icon"
              name="close"
              @click="handleRefuseCall"
            />
            <br />
            <span>拒绝</span>
          </span>
          <span>
            <v-icon
              class="accept-icon"
              class-prefix="el-icon"
              name="phone"
              @click="handleAcceptCall"
            />
            <br />
            <span>接受</span>
          </span>
        </template>
      </div>
    </div>
    <div v-show="streamType == 'VIDEO'">
      <!-- <div
        v-if="agora.localStream"
        class="player-container"
        :class="isLargeVideo ? 'large' : 'small'"
        @click="toggleClick"
      > -->
      <div
        v-if="agora.localStream"
        class="player-container"
        :class="!isLargeVideo ? 'large' : 'small'"
        @click="toggleClick"
      >
        <stream-player
          class="current-container"
          :stream="agora.localStream"
          :uid="agora.localStream.getId()"
          :domId="`stream-player-${agora.localStream.getId()}`"
        >
        </stream-player>
      </div>

      <!-- <div
        class="player-container"
        :class="!isLargeVideo ? 'large' : 'small'"
        @click="toggleClick"
      > -->
      <div
        class="player-container"
        :class="isLargeVideo ? 'large' : 'small'"
        @click="toggleClick"
      >
        <!-- :style="'transform: rotate(' + tcJtXz + 'deg)'" -->
        <stream-player
          v-for="(stream, index) in agora.otherStreams"
          :class="
            'stream-profile ' +
              (isjxxz ? ' tc_mirrorRotateLevel ' : '') +
              (isxz ? ' tc_mirrorRotateVertical ' : '') +
              (' ' + gettcJtXz() + ' ')
          "
          :key="`${index}${stream.getId()}`"
          :stream="stream"
          :isPlaying="stream.isPlaying()"
          :uid="stream.getId()"
          :domId="`stream-player-${stream.getId()}`"
          :showUid="true"
        ></stream-player>
      </div>
    </div>

    <div class="minimize-window" @click="onMaxmizeModal">通话中...</div>

    <audio ref="ring" class="ring" muted loop>
      <source src="./audio/ring.mp3" type="audio/mpeg" />
      <source src="./audio/ring.ogg" type="audio/ogg" />
      您的浏览器不支持 audio 元素。
    </audio>
  </Draggable>
</template>

<script>
// @ts-nocheck
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import { Icon, Notify } from "vant";
import { getToken, rtcTokenBuilderClient } from "@/api/api";
import { log, getRoomCode, getQueryStringArgs } from "@/utils/im/index";
import RTCClient from "@/utils/im/agora-rtc-client";
import StreamPlayer from "./stream_player";
const WAIT_TIME = 20 * 1000; //拨打电话倒计时，30秒未接通自动挂断
import Draggable from "@/components/im/draggable";
export default {
  components: {
    vIcon: Icon,
    StreamPlayer,
    Draggable,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      emediaModalVisible: false,
      contact: "",
      streamType: "VIDEO",
      //toggle: true,
      serverStyle: {
        width: "360px",
        height: "360px",
      },
      isLargeVideo: true,
      minimize: false, //最小化窗口
      shouldPlay: false, //是否播放铃音
      inviteState: false, //邀请状态标志
      callState: false, //通话状态标志
      role: "caller", //当前角色：caller主叫，callee被叫
      localClient: null,
      turnOnAudio: true,
      turnOnVideo: true,
      config: {
        uid: 0,
        host: true,
        channelName: "",
        token: "",
        resolution: "480p",
        microphoneId: "",
        cameraId: "",
      },
      timer: null, //呼叫定时器
      userName:
        localStorage.getItem("userInfo") &&
        JSON.parse(localStorage.getItem("userInfo")).userId,
      isjxxz: false, // 对方视频镜像旋转
      isxz: false, // 对方视频旋转
      tcJtXz: 1, //镜头旋转
    };
  },
  created() {
    if (this.agora.rtmClient.status === "offLine") {
      //登录rtm
      //let uid = this.agora.userCode
      let uid = this.userName ? Number(this.userName.replace("hx_", "1")) : 0;
      if (!uid) {
        console.log("未获取到正确的账号，无法进行视频通话");
        return;
      }
      this.updateUserCode(uid);
      const _p = { user_id: uid };
      getToken(_p).then((data) => {
        let token = data.data.token;
        this.loginRtmClient(uid, token).then((data) => {
          this.getMediaDevices();
          //.then(data => this.rtmClientListner())
          this.rtmClientListner();
        });
      });
    }
  },
  mounted: function() {
    //解决铃声必须用户操作后才可播放问题
    var handler = () => {
      if (this.$refs.ring) {
        this.$refs.ring.muted = false;
      }
      document.removeEventListener("mousedown", handler);
    };
    document.addEventListener("mousedown", handler);
  },
  computed: {
    ...mapState(
      {
        userList: (state) => state.chat.userList,
        agora: (state) => state.agora,
        chat: (state) => state.chat,
      },
      ["loginIM"]
    ),
  },
  methods: {
    ...mapActions([
      "updateUserCode",
      "updatePeerCode",
      "updateIncomingCode",
      //'updateConfig',
      "connectionStateChanged",
      "addLocal",
      "addStream",
      "removeStream",
      "removeStreamById",
      "setAudio",
      "setVideo",
      "clearAllStream",
      "onSendText",
    ]),
    changeJTXZ() {
      if (this.tcJtXz == 4) {
        this.tcJtXz = 1;
      } else {
        this.tcJtXz = this.tcJtXz + 1;
      }
    },
    gettcJtXz() {
      let _tccss = "tc_video_rotate1";
      this.tcJtXz == 2 && (_tccss = "tc_video_rotate2");
      this.tcJtXz == 3 && (_tccss = "tc_video_rotate3");
      this.tcJtXz == 4 && (_tccss = "tc_video_rotate4");
      return _tccss;
    },
    changeJXXZ() {
      this.isjxxz = !this.isjxxz;
    },
    changeXZ() {
      this.isxz = !this.isxz;
    },
    loginRtmClient(uid, token) {
      return this.agora.rtmClient
        .login(uid, token)
        .then(() => {
          console.log("声网登录成功");
          return Promise.resolve();
        })
        .catch((err) => {
          console.log("声网登录出错");
          this.$message.error("声网登录出错");
          return Promise.reject();
        });
    },
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
    },
    rtmClientListner() {
      /*事件含义参考：https://docs.agora.io/cn/Real-time-Messaging/rtm_invite_web?platform=Web
			在一个完整的呼叫邀请过程中，主叫和被叫的呼叫邀请状态分别由 LocalInvitation 和 RemoteInvitation 来定义。*/
      //收到呼叫邀请
      this.agora.rtmClient.on(
        "RemoteInvitationReceived",
        (remoteInvitation) => {
          console.info("收到呼叫邀请", remoteInvitation);
          let _ct = remoteInvitation._content;
          let callerId = remoteInvitation.callerId;
          if (_ct == "voice_mode") {
            this.streamType = "VOICE";
          } else {
            this.streamType = "VIDEO";
          }

          this.emediaModalVisible = true;
          this.role = "callee";
          this.inviteState = true;
          this.callState = false;
          this.shouldPlay = true;
          this.contact = this.getNickname(callerId);
          this.updatePeerCode(callerId);
          this.updateIncomingCode(callerId);
          this.updateConfig({
            channelName: remoteInvitation._channelId,
            token: remoteInvitation.token,
          });
        }
      );
      //呼叫邀请已被主叫取消
      this.agora.rtmClient.on("RemoteInvitationCanceled", () => {
        this.inviteState = false;
        this.callState = false;
        this.shouldPlay = false;
        this.close();
      });
      //呼叫邀请过程失败。
      this.agora.rtmClient.on("RemoteInvitationFailure", () => {
        Notify({ type: "danger", message: "呼叫失败" });
        this.inviteState = false;
        this.callState = false;
        this.shouldPlay = false;
        this.clearTimer();
        this.close();
      });
      //接受呼叫邀请
      this.agora.rtmClient.on("RemoteInvitationAccepted", () => {
        log("Accept success");
        let channel = this.config.channelName;
        this.inviteState = false;
        this.callState = true;
        this.shouldPlay = false;
        log("Accept success=====", this.config);

        rtcTokenBuilderClient(this.agora.userCode, channel)
          .then((data) => {
            this.updateConfig({
              channelName: channel,
              token: data.data.token,
            });
            const client = new RTCClient();
            if (!client._created) {
              client.createClient({
                codec: this.agora.codec,
                mode: this.agora.mode,
              });
              client._created = true;
            }
            this.localClient = client;
            this.rtcClientListner(this.localClient);
            this.joinEvent(this.localClient);
          })
          .catch((err) => {
            this.close();
          });

        // const client = new RTCClient();
        // if (!client._created) {
        //   client.createClient({
        //     codec: this.agora.codec,
        //     mode: this.agora.mode,
        //   });
        //   client._created = true;
        // }
        // this.localClient = client;
        // this.rtcClientListner(this.localClient);
        // this.joinEvent(this.localClient);
      });
      //拒绝呼叫邀请
      this.agora.rtmClient.on("RemoteInvitationRefused", () => {
        this.inviteState = false;
        this.callState = false;
        this.shouldPlay = false;
        this.close();
      });

      //取消呼叫邀请
      this.agora.rtmClient.on("LocalInvitationCanceled", (invitation) => {
        console.log("LocalInvitationCanceled", this.chat);
        let _ct = "";
        invitation && (_ct = invitation._content || "");
        this.inviteState = false;
        this.callState = false;
        this.shouldPlay = false;
        //发送文字提示
        this.onSendText({
          chatType: this.chat.chatType,
          chatId: { name: this.chat.selectedUser.name }, //this.chat.selectedUser,
          message: _ct == "voice_mode" ? "已取消语音通话" : "已取消视频通话",
        });
        this.clearTimer();
        this.close();
      });
      //被叫已收到呼叫邀请
      this.agora.rtmClient.on("LocalInvitationReceivedByPeer", () => {
        //this.callState = true
        //this.inviteState = false
        console.log("被叫已收到呼叫邀请");
        //拨打电话倒计时，30秒未接通自动挂断
        this.timer = setTimeout(() => {
          this.handleCancelCall();
        }, WAIT_TIME);
      });
      //被叫已接受呼叫邀请
      this.agora.rtmClient.on("LocalInvitationAccepted", () => {
        console.log("对方接听啦");
        this.inviteState = false;
        this.callState = true;
        this.shouldPlay = false;
        const client = new RTCClient();
        if (!client._created) {
          client.createClient({
            codec: this.agora.codec,
            mode: this.agora.mode,
          });
          client._created = true;
        }
        this.localClient = client;
        this.rtcClientListner(this.localClient);
        this.joinEvent(this.localClient);
        this.clearTimer();
      });
      //被叫已拒绝呼叫邀请
      this.agora.rtmClient.on("LocalInvitationRefused", () => {
        console.log("对方已拒绝接听");
        this.inviteState = false;
        this.callState = false;
        this.shouldPlay = false;
        this.close();
        Notify({ type: "danger", message: "对方正忙" });
        this.clearTimer();
      });
      //呼叫邀请过程失败
      this.agora.rtmClient.on("LocalInvitationFailure", () => {
        this.inviteState = false;
        this.callState = false;
        this.shouldPlay = false;
        this.close();
        Notify({ type: "danger", message: "呼叫失败" });
        this.clearTimer();
      });
    },
    rtcClientListner(client) {
      client.on("connection-state-change", this.connectionStateChanged);
      client.on("localStream-added", (evt) => {
        console.error("localStream-added:创建本地音视频流", evt.stream);
        client.setRemoteVideoStreamType(evt.stream, 0);
        this.addLocal(evt);
      });
      client.on("stream-published", (evt) => {
        console.error("stream-published:发布本地音视频流");
        //this.addStream(evt)
      });
      client.on("stream-added", (evt) => {
        console.error("stream-added：接收到远端发布的音视频流", evt.stream);
        const { stream } = evt;
        //订阅远端音视频流.订阅远端音视频流之后，本地会触发 Client.on("stream-subscribed") 回调
        /// 可添加参数，选择仅接收视频数据。client.subscribe(stream, {video: true, audio: false});
        client.subscribe(stream, (err) => {
          console.log(`订阅 ${evt.stream.getId()} 音视频流失败: ${err}`);
        });
      });
      client.on("stream-subscribed", (evt) => {
        console.error("stream-subscribed:订阅远端发布的音视频流", evt.stream);
        client.setStreamFallbackOption(evt.stream, 2);
        //setRemoteVideoStreamType(stream,streamType)
        //设置视频质量.streamType:0高码率、高分辨率视频，1低码率、低分辨率视频。
        client.setRemoteVideoStreamType(evt.stream, 0);
        this.addStream(evt);
      });
      client.on("stream-removed", (evt) => {
        console.error("stream-removed:", evt.stream);
        this.removeStream(evt);
      });
      client.on("peer-leave", (evt) => {
        console.error("peer-leave:对方离开", evt);
        let reason = evt.reason.toLowerCase();
        let msg = "通话中断";
        this.removeStreamById(evt);
        this.handleQuitMeeting();

        if (reason == "servertimeout") {
          // 超时掉线
          msg = "对方掉线";
        } else if (reason == "quit") {
          // 对方挂断电话
          msg = "对方已结束通话";
        }
        Notify({ type: "danger", message: msg });
      });
    },
    getMediaDevices() {
      //获取多媒体设备
      const client = new RTCClient();
      return client.getDevices().then((devices) => {
        let cameraList = devices
          .filter((item) => item.kind === "videoinput")
          .map((item, idx) => ({
            value: item.deviceId,
            label: item.label ? item.label : `Video Input ${idx}`,
          }));
        let microphoneList = devices
          .filter((item) => item.kind === "audioinput")
          .map((item, idx) => ({
            value: item.deviceId,
            label: item.label ? item.label : `Audio Input ${idx}`,
          }));
        if (cameraList[0] && microphoneList[0]) {
          this.updateConfig({
            cameraId: cameraList[0].value,
            microphoneId: microphoneList[0].value,
          });
        } else {
          console.log("未检测到多媒体设备");
          this.$message.error("未检测到多媒体设备");
        }
        client.destroy();
        return Promise.resolve(true);
      });
    },
    close() {
      this.shouldPlay = false;
      this.inviteState = false;
      this.callState = false;
      this.emediaModalVisible = false;
    },
    toggleClick() {
      console.log(this.isLargeVideo);
      this.isLargeVideo = !this.isLargeVideo;
    },
    controlStream(type) {
      //通话中音视频控制
      if (type === "audio") {
        this.turnOnAudio = !this.turnOnAudio;
        this.turnOnAudio
          ? this.agora.localStream.unmuteAudio()
          : this.agora.localStream.muteAudio();
      } else {
        this.turnOnVideo = !this.turnOnVideo;
        this.turnOnVideo
          ? this.agora.localStream.unmuteVideo()
          : this.agora.localStream.muteVideo();
      }
    },
    showEmediaModal() {
      this.emediaModalVisible = true;
    },
    handleCalling(peerId, _type) {
      //拨打电话
      this.inviteState = true;
      this.role = "caller";
      this.contact = this.getNickname(peerId); //peerId
      this.shouldPlay = true;
      this.streamType = _type;
      peerId = peerId.replace("hx_", "1");
      this.agora.rtmClient
        .inquire([peerId])
        .then((res) => {
          if (peerId === this.agora.userCode) {
            this.close();
            Notify({ type: "danger", message: "不可拨打自己的号码" });
            return;
          }
          if (res[peerId]) {
            this.updatePeerCode(peerId);
            let roomCode = getRoomCode(this.agora.userCode, peerId);
            rtcTokenBuilderClient(this.agora.userCode, roomCode)
              .then((data) => {
                this.updateConfig({
                  channelName: roomCode,
                  token: data.data.token,
                });
                this.agora.rtmClient.localInvitation(peerId, roomCode, _type);
              })
              .catch((err) => {
                this.close();
              });
          } else {
            log("peer is not login");
            this.close();
            Notify({ type: "danger", message: "对方不在线" });
            return;
          }
        })
        .catch((err) => {
          log("The query failed:", err);
          this.close();
          Notify({ type: "danger", message: "查询对方是否在线失败" });
        });
    },
    handleCancelCall() {
      //取消呼叫
      this.agora.rtmClient.cancelCall();
    },
    handleAcceptCall() {
      //接受呼叫
      this.agora.rtmClient.acceptCall();
    },
    handleRefuseCall() {
      //拒绝接听
      this.agora.rtmClient.refuseCall();
    },
    handleQuitMeeting() {
      //结束通话
      this.localClient &&
        this.localClient.leave().then(() => {
          this.clearAllStream();
          this.agora.rtmClient.status = "onLine";
          this.close();
        });
    },

    onMinmizeModal() {
      this.minimize = true;
    },
    onMaxmizeModal() {
      this.minimize = false;
    },
    joinEvent(rtcClient) {
      if (this.callState == false) {
        return;
      }
      let config = {
        token: this.config.token,
        channel: this.config.channelName,
        microphoneId: this.config.microphoneId,
        cameraId: this.config.cameraId,
        resolution: this.config.resolution,
        muteVideo: this.turnOnVideo,
        muteAudio: this.turnOnAudio,
        uid: this.agora.userCode,
        host: this.config.host,
        type: this.streamType,
      };
      if (config.channel && rtcClient._created && rtcClient._joined === false) {
        //加入频道。
        rtcClient
          .join(config)
          .then((uid) => {
            if (config.host) {
              //发布本地音视频轨道。
              //发布音视频流之后，本地会触发 Client.on("stream-published") 回调；
              //远端会触发 Client.on("stream-added") 回调。
              rtcClient.publish();
            }
            this.updateConfig({ uid });
          })
          .catch((err) => {
            Notify({
              type: "danger",
              message: `加入频道失败：Media ${err.info}`,
            });
            console.error("加入频道失败：", err);
            this.close();
          });
      }
    },
    getNickname(hxId) {
      //要对环信id还原：1开头的id要替换为hx_开头
      let _hxId = hxId.replace(/^1/, "hx_");
      let res = this.userList.contactUserList.filter(
        (item) => item.name == _hxId
      );
      if (res.length > 0) {
        return res[0].info ? res[0].info.name : res[0].name;
      } else {
        return _hxId;
      }
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
  },
  watch: {
    emediaModalVisible: {
      deep: true,
      handler: function(newV, oldV) {
        if (newV) {
          this.$emit("changeIsVideoState", true);
        } else {
          this.$emit("changeIsVideoState", false);
        }
      },
    },
    shouldPlay: function(val) {
      console.log("播放铃音：", val);
      if (this.$refs.ring) {
        if (val) {
          this.$refs.ring.play();
        } else {
          this.$refs.ring.load();
        }
      }
    },
  },
  beforeDestroy() {
    this.clearTimer();
  },
};
</script>
<style lang="scss" scoped>
//@import './index.scss';
// @import "~IM/static/fonts/element-ui.css";
.pull-right {
  float: right;
}
.wrap {
  // position: absolute;
  width: 100%;
  height: 100%;
  // right: 0;
  // top: 0;
  // z-index: 9999;
  .minimize-window {
    display: none;
  }
  &.minimize {
    width: 80px;
    height: 40px;
    line-height: 40px;
    right: 5px;
    top: 5px;
    color: #fff;
    background-color: blue;
    text-align: center;

    .full-call,
    .player-container {
      display: none;
    }
    .minimize-window {
      display: block;
      padding: 0 10px;
    }
  }
}
span.is-active {
  position: relative;
  .el-icon {
    background-color: #fff;
    color: #333;
    border: none;
    &.el-icon-video-camera:after {
      content: "/";
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

.full-call {
  display: flex;
  flex-direction: column;
  // width: 100%;
  // height: 100%;
  width: 400px;
  height: 500px;
  top: 0;
  left: 0;
  color: #fff;
  font-size: 16px;
  box-sizing: border-box;
  background-color: rgb(204, 204, 204);
  background: url("https://thinklink.mythinkcar.cn/static/img/rtc-bg@2x.png")
    no-repeat;
  background-size: 100% auto;
  .el-icon {
    font-size: 30px;
  }
  .top-section,
  .bottom-section {
    z-index: 2;
  }
  .top-section {
    padding: 25px;
    height: 100%;
    .el-icon {
    }
  }
  .middle-section {
    flex: 1;
    text-align: center;
    img {
      width: 80px;
      max-width: 100%;
      height: auto;
      display: inline-block;
      border-radius: 50%;
      margin-top: 100px;
    }
  }
  .bottom-section {
    display: flex;
    padding-bottom: 25px;
    padding-top: 25px;
    align-items: flex-end;
    span {
      text-align: center;
      flex: 1;
    }
    .el-icon {
      border: 1px solid #fff;
      padding: 12px;
      border-radius: 50%;
      margin-bottom: 5px;
      &.turn-off {
        background-color: #a91919;
        border: none;
        padding: 15px;
      }
    }
    .accept-icon {
      background-color: #67c23a;
      border: none;
    }
    .refuse-icon {
      background-color: #a91919;
      border: none;
    }
  }
}

audio.ring {
  display: none;
  width: 100%;
  height: 100px;
}
.player-container {
  position: absolute;
  // background-color: #333;
  &.large {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  &.small {
    width: 80px;
    height: 120px;
    right: 5px;
    top: 5px;
    z-index: 2;
  }
}
.tc_font_14 {
  font-size: 14px;
  cursor: pointer;
}

.tc_mirrorRotateLevel {
  // transform: rotateY(180deg); /* 水平镜像翻转 */
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  transform: scaleX(-1);
}
.tc_mirrorRotateVertical {
  // transform: rotateX(180deg); /* 垂直镜像翻转 */
  -moz-transform: scaleY(-1);
  -webkit-transform: scaleY(-1);
  -o-transform: scaleY(-1);
  transform: scaleY(-1);
}
.tc_xuanz1,
.tc_xuanz2 {
  background-color: #409eff;
  border-radius: 25px;
}
</style>
