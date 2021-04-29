<template>
  <a-row class="im_main">
    <a-row class="im_kx_d_row"
      >空闲设备：
      <span class="im_kx_d" v-for="_item in freeDeviceList" :key="_item"
        >{{ _item }}
      </span>
    </a-row>
    <a-col :span="18" class="im_main_1">
      <a-row class="im_main_1_1"
        >我的消息
        <!-- <span @click="addmoniSend">发送自定义消息</span> -->
      </a-row>
      <IMConter ref="myIMConterChild" />
    </a-col>
    <a-col :span="6" class="im_main_2">
      <a-row class="rm_1">
        <a-col :span="12" class="rm_cup" @click="gotoTodayList">
          <a-row class="rm_1_2 tc_pb_10">今日流水</a-row>
          <a-row class="rm_1_1">¥{{ runwater }}</a-row>
        </a-col>
        <a-col :span="12" class="rm_cup" @click="gotoUnpaidList">
          <a-row class="rm_1_2 tc_pb_10">未支付</a-row>
          <a-row class="rm_1_1">¥{{ nopay }}</a-row>
        </a-col>
      </a-row>

      <a-row class="rm_2" @click.native="showAllList()">
        <a-row class="rm_2_1">
          需求广场&nbsp;&nbsp;&nbsp;&nbsp;<a-badge
            class="rm_2_1_badge"
            :count="gctotal"
        /></a-row>
        <a-row class="rm_2_2">{{
          gctotal == 0
            ? "暂无需求！"
            : "有人发布新的远程诊断需求了，快去看看吧！"
        }}</a-row>
      </a-row>

      <a-row class="rm_3">
        <a-row class="rm_3_1"> 任务列表 ({{ curtotal }})</a-row>
        <a-row class="rm_3_2">
          <a-row v-for="_item in task_cur_list" :key="_item.task_id">
            <a-row
              class="rm_3_2_1"
              v-if="_item.status == 2 || _item.status == 7"
            >
              <a-row class="rm_3_2_2">
                <a-col :span="4">
                  <img
                    v-if="_item.headimgurl"
                    class="user_avatar"
                    onerror="this.src='https://thinklink.mythinkcar.cn/static/img/user.jpeg';this.onerror=null"
                    :src="_item.headimgurl"
                  />
                  <img v-else class="user_avatar" src="@/assets/user.jpeg" />
                </a-col>
                <a-col :span="14">
                  <a-row class="rm_3_2_3">{{
                    _item.nickname + "  " + onCheckEmpty(_item.city)
                  }}</a-row>
                  <a-row class="rm_3_2_4">{{ _item.create_time }}</a-row>
                </a-col>
                <a-col :span="6">
                  <a-icon
                    type="message"
                    class="rm_3_2_5 tc_cup"
                    @click="goToDetail(_item)"
                  /><span :style="getColorStatus(_item.status)"
                    >{{ transferStatus(_item.status) }}
                  </span>
                </a-col>
              </a-row>
              <!-- 内容 -->
              <a-row class="rm_3_2_6 rm_3_2_6_1"
                ><span class="rm_3_2_7">服务项目:</span>
                {{ _item.item_name }}</a-row
              >
              <a-row class="rm_3_2_6_1"
                ><span class="rm_3_2_7">车辆:</span> {{ _item.brand }}</a-row
              >
              <a-row class="rm_3_2_6_1"
                ><span class="rm_3_2_7">问题描述:</span>
                {{ _item.fault_description }}</a-row
              >
              <a-row class="rm_3_2_8"
                >接单设备: {{ _item.accept_serial_number }}</a-row
              >
              <!-- <a-row>网络延迟: {{ _item.serial_number }}</a-row> -->
            </a-row>
          </a-row>
          <a-row class="tc_rw_nodata" v-if="curtotal == 0">暂无数据</a-row>
        </a-row>
      </a-row>
    </a-col>
    <!-- <AgoraConter :imid="imId" /> -->

    <el-dialog
      title="需求广场"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      class="im_xq_dialog"
      :modal="false"
    >
      <a-row class="im_xqd_1">
        <a-row class="im_xqd_6">
          <el-input
            placeholder="手机号/服务项目"
            v-model="gcrwSearchTxt"
            @keyup.enter.native="SearchBusTask"
          >
            <i
              slot="suffix"
              @click="SearchBusTask"
              class="el-input__icon el-icon-search im_xqd_search"
            ></i>
          </el-input>
        </a-row>
        <a-row class="im_xqd_2" v-for="_item in task_list" :key="_item.task_id">
          <a-row class="im_xqd_3">
            <a-col :span="3">
              <img
                v-if="_item.headimgurl"
                class="user_avatar"
                onerror="this.src='https://thinklink.mythinkcar.cn/static/img/user.jpeg';this.onerror=null"
                :src="_item.headimgurl"
              />
              <img v-else class="user_avatar" src="@/assets/user.jpeg" />
            </a-col>
            <a-col :span="15">
              <a-row class="rm_3_2_3 tc_pb_10">{{ _item.nickname }}</a-row>
              <a-row class="rm_3_2_3 tc_pb_10">
                SN:{{ _item.serial_number }}</a-row
              >
              <a-row class="rm_3_2_4">{{ _item.create_time }}发布</a-row>
            </a-col>
            <a-col :span="6" class="im_xqd_4">
              <!-- <a-row>
                <span :style="getColorStatus(_item.status)"
                  >{{ transferStatus(_item.status) }}
                </span>
              </a-row> -->
              <a-row class="im_xqd_5">
                <el-button round @click="goToDetail(_item)"
                  >查看详情</el-button
                ></a-row
              >
            </a-col>
          </a-row>
          <!-- 内容 -->
          <!-- <a-row class="rm_3_2_6"
            ><span class="rm_3_2_7">服务项目:</span>
            {{ _item.item_name }}</a-row
          > -->
          <!-- <a-row><span class="rm_3_2_7">车辆:</span> {{ _item.brand }}</a-row> -->
          <a-row class="rm_3_2_7"
            ><span>故障描述：</span>
            <!-- {{ _item.brand }}
            {{ _item.fault_description && _item.brand && " , " }} -->
            {{ _item.fault_description }}
          </a-row>
          <!-- <a-row class="rm_3_2_8">接单设备: {{ _item.serial_number }}</a-row> -->
          <!-- <a-row>网络延迟: {{ _item.serial_number }}</a-row> -->
        </a-row>
        <div class="im_xqd_7" v-if="task_list.length == 0">暂无数据</div>
      </a-row>
      <el-dialog
        width="30%"
        title="详情"
        :visible.sync="innerVisible"
        append-to-body
        class="im_rw_detail_dialog"
      >
        <a-row class="im_rw_detail_1">
          <a-row class="im_rw_detail_2">
            <a-col :span="4">
              <img
                v-if="detailInfo.headimgurl"
                class="user_avatar im_rw_detail_img1"
                onerror="this.src='https://thinklink.mythinkcar.cn/static/img/user.jpeg';this.onerror=null"
                :src="detailInfo.headimgurl"
              />
              <img v-else class="user_avatar" src="@/assets/user.jpeg" />
            </a-col>
            <a-col :span="14">
              <a-row class="rm_3_2_3 tc_pb_10">{{ detailInfo.nickname }}</a-row>
              <a-row class="rm_3_2_4 tc_pb_10">{{
                detailInfo.create_time
              }}</a-row>
            </a-col>
            <a-col :span="6">
              <a-icon
                type="message"
                class="rm_3_2_5 rm_3_2_10"
                @click="gotoIM"
              /><span :style="getColorStatus(detailInfo.status)"
                >{{ transferStatus(detailInfo.status) }}
              </span>
            </a-col>
          </a-row>
          <!-- 内容 -->
          <a-row class="rm_3_2_6"
            ><span class="rm_3_2_7">电话:</span> {{ detailInfo.phone }}</a-row
          >
          <a-row class="rm_3_2_6"
            ><span class="rm_3_2_7">地址:</span> {{ detailInfo.city }}</a-row
          >
          <a-row class="rm_3_2_6"
            ><span class="rm_3_2_7">服务项目:</span>
            {{ detailInfo.item_name }}</a-row
          >
          <a-row class="rm_3_2_6"
            ><span class="rm_3_2_7">车辆:</span> {{ detailInfo.brand }}</a-row
          >
          <a-row class="rm_3_2_8 rm_3_2_6"
            >设备: {{ detailInfo.serial_number }}</a-row
          >
          <a-row class="rm_3_2_6"
            ><span class="rm_3_2_7">问题描述:</span>
            {{ detailInfo.fault_description }}</a-row
          >
          <!-- <a-row>网络延迟: {{ detailInfo.serial_number }}</a-row> -->
        </a-row>
      </el-dialog>
    </el-dialog>

    <!-- 今日流水 -->
    <el-dialog
      title="今日流水"
      :visible.sync="todyListShow"
      width="50%"
      :before-close="todyListClose"
      :close-on-click-modal="false"
      class="im_xq_dialog"
      :modal="false"
    >
      <a-row class="im_tody_list">
        <a-row
          class="im_tl_1"
          v-for="_item in today_money_list"
          :key="_item.task_id"
        >
          <a-row class="im_xqd_3">
            <a-col :span="12">
              <a-row class="rm_3_2_3 tc_pb_10"
                >姓名：{{ _item.nickname }}</a-row
              >
              <a-row class="rm_3_2_3 tc_pb_10">
                SN：{{ _item.serial_number }}</a-row
              >
              <a-row class="rm_3_2_4">支付时间：{{ _item.pay_time }}</a-row>
            </a-col>
            <a-col :span="12">
              <a-row class="rm_3_2_3 tc_pb_10"
                >服务项目：{{ _item.item_name }}</a-row
              >
              <a-row class="rm_3_2_3 tc_pb_10">金额：{{ _item.price }}</a-row>
              <a-row>车辆：{{ _item.brand }}</a-row>
            </a-col>
          </a-row>
        </a-row>
      </a-row>
    </el-dialog>
    <!-- 未支付列表 -->
    <el-dialog
      title="未支付"
      :visible.sync="unpaidListShow"
      width="50%"
      :before-close="unpaidListClose"
      :close-on-click-modal="false"
      class="im_xq_dialog"
      :modal="false"
    >
      <a-row class="im_tody_list">
        <a-row
          class="im_tl_1"
          v-for="_item in unpaid_money_list"
          :key="_item.task_id"
        >
          <a-row class="im_xqd_3">
            <a-col :span="12">
              <a-row class="rm_3_2_3 tc_pb_10"
                >姓名：{{ _item.nickname }}</a-row
              >
              <a-row class="rm_3_2_3 tc_pb_10">
                SN：{{ _item.serial_number }}</a-row
              >
              <a-row class="rm_3_2_4">支付时间：{{ _item.pay_time }}</a-row>
            </a-col>
            <a-col :span="12">
              <a-row class="rm_3_2_3 tc_pb_10"
                >服务项目：{{ _item.item_name }}</a-row
              >
              <a-row class="rm_3_2_3 tc_pb_10">金额：{{ _item.price }}</a-row>
              <a-row>车辆：{{ _item.brand }}</a-row>
            </a-col>
          </a-row>
        </a-row>
      </a-row>
    </el-dialog>

    <!-- 订单详情 -->
    <task-detail-for-b
      class="im_task_dfb"
      :show="showDetail"
      :showIM="true"
      :taskId="taskId"
      @gotoim="gotoIM"
      @close="showDetail = false"
    />
  </a-row>
</template>

<script>
// @ts-nocheck
/* eslint-disable */
import Vue from "vue";
import IMConter from "./chat/index.vue";

import {
  getBusTaskList,
  getTodayFlow,
  getDeviceList,
  getHistoryTaskList,
  getFreeDevice,
} from "@/api/api";
import { DEVICE_TYPE_B, checkEmpty } from "@/utils/im/public";
import { mapActions, mapState } from "vuex";
import TaskDetailForB from "@/components/im/chat/task_detail_for_b";

// import RTCClient from "@/utils/im/agora-rtc-client";

// import WebIM from "@/utils/im/WebIM";
// const rtc = WebIM.rtc;
// const AgoraRTM = WebIM.AgoraRTM;
// const AgoraRTC = WebIM.AgoraRTC;

export default Vue.extend({
  name: "contact",

  components: {
    IMConter,
    TaskDetailForB,
  },
  data() {
    return {
      runwater: 0,
      nopay: 0,
      gctotal: 0,
      // curtotal: 0,
      task_list: [],
      // task_cur_list: [],
      dialogVisible: false,
      gcrwSearchTxt: "",
      innerVisible: false,
      detailInfo: {},
      today_money_list: [], // 今日流水列表
      unpaid_money_list: [], //未支付列表
      todyListShow: false,
      unpaidListShow: false,
      imId: "2015422",
      taskId: "",
      showDetail: false,
    };
  },
  // beforeMount() {
  //   this.imLogin({
  //     // username: "liuyu",
  //     // password: "111111",
  //     // username: "hx_2208686",
  //     // username: "hx_1468029",
  //     // username: "hx_2271375",
  //     // username: "hx_3219076",
  //     // username: "hx_3263930",
  //     username: this.imId,
  //     password: "699b2f6ffeaaffdb7e6b8d52facc42b3",
  //   });
  // },
  mounted() {
    const UserJSON = localStorage.getItem("user");
    // this.$store.commit("setUser", JSON.parse(UserJSON));
    this.onGetTodayFlow(JSON.parse(UserJSON));
  },

  created() {
    //this.getTaskDetail(this.taskId)
    this.getBindDeviceList().then((data) => {
      console.log("===data=====", data);
      if (data.data && data.data.length > 0) {
        this.$store.commit("setImDList", data.data || []);
        // this.$store.commit("setSDevice", data.data[0].serial_number);
        this.onGetBusTaskList();
        this.onGetHistoryTaskList();
        this.getFreeDevice().then((data2) => {
          console.log("===data=====", data2);
          if (data2.data && data2.data.length > 0) {
            this.$store.commit("setFreeDeviceList", data2.data || []);
            this.$store.commit("setSDevice", data2.data[0] || "");
            // this.onGetBusTaskList();
            // this.onGetHistoryTaskList();
          }
        });
      }
    });
  },
  computed: {
    ...mapState({
      userList: (state) => state.chat.userList,
      imDeviceList: (state) => state.chat.imDeviceList,
      freeDeviceList: (state) => state.chat.freeDeviceList,
      imSelecgDevice: (state) => state.chat.imSelecgDevice,
      task_cur_list: (state) => state.chat.taskCurList,
      agora: (state) => state.agora,
    }),
    curtotal() {
      let _num = 0;
      this.$store.state.chat.taskCurList.map((_it) => {
        (_it.status == 2 || _it.status == 7) && _num++;
      });
      return _num || 0;
    },
  },
  methods: {
    ...mapActions({
      imLogin: "onLogin",
      onSendCustomMsg: "onSendCustomMsg",
      updatePeerCode: "updatePeerCode",
      updateIncomingCode: "updateIncomingCode",
      onGetHistoryTaskList: "onGetHistoryTaskList",
    }),
    onCheckEmpty(_txt) {
      return checkEmpty(_txt);
    },
    gotoTodayList() {
      this.today_money_list.length > 0 && (this.todyListShow = true);
      // this.todyListShow = true;
    },
    gotoUnpaidList() {
      this.unpaid_money_list.length > 0 && (this.unpaidListShow = true);
      // this.unpaidListShow = true;
    },
    todyListClose() {
      this.todyListShow = false;
    },
    unpaidListClose() {
      this.unpaidListShow = false;
    },

    goToDetail(_item) {
      console.log("=========sss===", _item);
      this.detailInfo = _item;
      this.taskId = _item.task_id;
      this.showDetail = true;
      // this.innerVisible = true;
    },
    gotoIM(_item) {
      this.$refs.myIMConterChild.selectUser(_item);
      this.showDetail = false;
      this.dialogVisible = false;
    },
    SearchBusTask() {
      console.log(this.gcrwSearchTxt);
      this.onGetBusTaskList(this.gcrwSearchTxt.trim() || "", "search");
    },
    // 用户查询任务列表（需求广场调用）
    onGetBusTaskList(_stxt, _type) {
      try {
        let UserJSON = localStorage.getItem("user");
        UserJSON && (UserJSON = JSON.parse(UserJSON));
        const _p = { user_id: UserJSON.user_id, size: 999 };
        _type && (_p.serviceSearch = _stxt);
        getBusTaskList(_p).then((data) => {
          console.log("=======onGetBusTaskList========", data);
          if (data.code == 0) {
            if (!_type) {
              this.gctotal = data.data.total || 0;
            }
            this.task_list = data.data.task_list || [];
          }
        });
      } catch (e) {
        console.log("error", e);
      }
    },
    //获取指定给我的任务列表（B用户调用）
    // onGetHistoryTaskList() {
    //   try {
    //     let UserJSON = localStorage.getItem("user");
    //     UserJSON && (UserJSON = JSON.parse(UserJSON));

    //     getHistoryTaskList({
    //       user_id: UserJSON.user_id,
    //       size: 999,
    //     }).then((data) => {
    //       if (data.code == 0) {
    //         let _num = 0;
    //         data.data.list.map((_it) => {
    //           (_it.status == 2 || _it.status == 7) && _num++;
    //         });

    //         console.log("=======getHistoryTaskList========", _num, data);
    //         this.curtotal = _num || 0;
    //         this.task_cur_list = data.data.list || [];
    //       }
    //     });
    //   } catch (e) {
    //     console.log("error", e);
    //   }
    // },
    onGetTodayFlow(_user) {
      console.log("=======user========", _user);
      try {
        getTodayFlow({ user_id: _user.user_id || "" }).then((data) => {
          if (data.code == 0) {
            this.runwater = data.data.today_money || 0;
            this.nopay = data.data.unpaid_money || 0;
            this.today_money_list = data.data.today_money_list || [];
            this.unpaid_money_list = data.data.unpaid_money_list || [];
          }
        });
      } catch (e) {
        console.log("error", e);
      }
    },
    transferStatus(val = 0) {
      let status = "";
      switch (parseInt(val)) {
        case 1:
          status = "未开始";
          break;
        case 2:
          status = "进行中";
          break;
        case 3:
          status = "已失效";
          break;
        case 4:
          status = "已完成";
          break;
        case 5:
          status = "已超时";
          break;
        case 6:
          status = "放弃";
          break;
        case 7:
          status = "待接单确认";
          break;
        case 8:
          status = "确认完成";
          break;
        case 9:
          status = "退款中";
          break;
        default:
          status = "";
      }
      return status;
    },
    getColorStatus(val = 0) {
      let status = "";
      switch (parseInt(val)) {
        case 1:
          status = "#1890ff";
          break;
        case 2:
          status = "#27D16F";
          break;
        case 3:
          status = "rgb(245 33 45)";
          break;
        case 4:
          status = "#409eff";
          break;
        case 5:
          status = "rgb(250 172 20)";
          break;
        case 6:
          status = "#f5212d";
          break;
        case 7:
          status = "#F38713";
          break;
        case 8:
          status = "#909399";
          break;
        case 9:
          status = "rgb(25 144 255)";
          break;
        default:
          status = "";
      }
      return "color:" + status;
    },
    showAllList() {
      console.log("======");
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    getBindDeviceList() {
      this.$showLoading();
      return getDeviceList(DEVICE_TYPE_B)
        .then((data) => Promise.resolve(data))
        .finally(() => {
          this.$hideLoading();
        });
    },
    getFreeDevice() {
      this.$showLoading();
      return getFreeDevice()
        .then((data) => Promise.resolve(data))
        .finally(() => {
          this.$hideLoading();
        });
    },
    addmoniSend() {
      //模拟创建订单
      this.onSendCustomMsg({
        chatId: { name: "liuyu" },
        chatType: "contact",
        message: {
          order_state: "order_help",
          task_id: 1,
          brand: "宝马",
          models: "Q7",
          year: 2018,
          vin: "abc1234567899",
        },
      });
    },
  },
});
</script>

<style lang="less" scoped>
.im_main {
  width: 100%;
  height: 90%;
  padding: 1%;
  line-height: inherit;
  // min-height: 500px;

  .im_kx_d_row {
    padding: 0px 5px 5px 5px;
    .im_kx_d {
      padding: 0 10px;
    }
  }

  .im_main_1 {
    height: 100%;
    background-color: #fff;
    border-radius: 10px;
    // overflow: auto;
    min-height: 500px;
    .im_main_1_1 {
      padding: 1% 3%;
      border-bottom: 1px solid rgb(238, 238, 238);
      font-size: 16px;
      background-color: #b6d3f1;
      border-radius: 10px 10px 0px 0px;
    }
  }
  .im_main_2 {
    padding-left: 1%;
    .rm_cup {
      cursor: pointer;
    }
    .rm_1 {
      background-color: #2dbd2d;
      border-radius: 10px;
      padding: 8% 5%;
      text-align: center;
      color: #fff;
      .rm_1_1 {
        font-weight: bold;
        font-size: 18px;
      }
      .rm_1_2 {
        font-size: 18px;
      }
    }
    .rm_2 {
      cursor: pointer;
      background-color: #1890ff;
      border-radius: 10px;
      padding: 8% 5%;
      text-align: left;
      color: #fff;
      margin-top: 5%;
      .rm_2_1 {
        font-size: 18px;
        padding-bottom: 5%;
        display: flex;
        align-items: center;
      }
      .rm_2_1_badge {
        margin-left: 4%;
      }
    }
    .rm_3 {
      background-color: #fff;
      border-radius: 10px;
      margin-top: 5%;
      .rm_3_1 {
        background-color: #b7d3f1;
        padding: 3% 5%;
        border-radius: 10px 10px 0px 0px;
        font-weight: bold;
      }
      .rm_3_2 {
        max-height: 500px;
        overflow: auto;
      }
      .rm_3_2_1 {
        padding: 3% 5%;
        border-bottom: 1px solid rgb(238, 238, 238);
      }
      .rm_3_2_2 {
        display: flex;
        align-items: center;
      }
      .rm_3_2_3 {
        font-weight: 500;
        padding-bottom: 10px;
      }
      .rm_3_2_4 {
        color: #9ca3af;
      }
      .rm_3_2_5 {
        font-size: 18px;
        vertical-align: text-bottom;
        padding-right: 5%;
      }
      .rm_3_2_6 {
        padding-top: 5%;
      }
      .rm_3_2_6_1 {
        padding-bottom: 5px;
      }
      .rm_3_2_7 {
        color: #9ca3af;
      }
      .rm_3_2_8 {
        padding: 2% 0;
        color: #1890ff;
        text-align: center;
      }

      .user_avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
  }
  .im_xq_dialog {
    z-index: 1800 !important;
    .im_xqd_1 {
      max-height: 400px;
      overflow: auto;
      padding: 0 40px;
      .im_xqd_2 {
        padding: 3%;
        border-top: 1px solid #e6e6e6;
      }
      .im_xqd_3 {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .im_xqd_4 {
        text-align: center;
      }
      .im_xqd_5 {
        padding-top: 10px;
      }
      .im_xqd_6 {
        padding: 0% 10% 3% 10%;
      }
      .im_xqd_7 {
        text-align: center;
        padding: 5% 0;
        color: #ccc;
      }
      .im_xqd_search {
        cursor: pointer;
      }
      .rm_3_2_7 {
        padding-top: 10px;
      }
      .rm_3_2_4 {
        color: #969696;
      }
      .rm_3_2_3 {
        font-size: 16px;
        padding-bottom: 10px;
      }
      .user_avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .im_tody_list {
      max-height: 400px;
      overflow: auto;
      .im_tl_1 {
        background-color: #409eff;
        border-radius: 15px;
        color: #fff;
        padding: 2% 5%;
        margin-bottom: 10px;
      }
    }
  }
}
.im_rw_detail_dialog {
  .im_rw_detail_1 {
    padding: 2% 5%;
    .im_rw_detail_2 {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 20px;
    }
    .im_rw_detail_img1 {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .rm_3_2_6 {
      padding-bottom: 10px;
    }
  }
  .rm_3_2_3 {
    padding-bottom: 10px;
  }
  .rm_3_2_10 {
    cursor: pointer;
    padding-right: 10px;
  }
}
.tc_rw_nodata {
  text-align: center;
  padding: 5% 0;
  color: #ccc;
}
.tc_cup {
  cursor: pointer;
}
.tc_pb_10 {
  padding-bottom: 10px;
}
</style>
