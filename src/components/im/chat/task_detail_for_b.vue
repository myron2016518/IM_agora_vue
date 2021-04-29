<template>
  <div class="wrap">
    <v-popup
      closeable
      v-model="showPop"
      close-icon="arrow-left"
      close-icon-position="top-left"
      position="right"
      class="popup-wrap"
      @close="closePopup"
      @opened="onOpenedPopup"
    >
      <!-- <h3 class="title">需求详情</h3> -->

      <!-- 我服务的详情 -->
      <div class="detail-wrap">
        <div class="inner-wrap">
          <template v-if="detail">
            <div v-if="detail.status == 1" class="top-tip text-center">
              <div>请尽快确认是否提供远程诊断服务？</div>
              <!-- <div class="text-small">超过30分钟未确认将自动失效</div> -->
            </div>
            <div v-else-if="detail.status == 2" class="top-tip text-center">
              <div v-if="detail.pay_status == 1 && Number(detail.price) > 0">
                已支付，请尽快完成服务
              </div>
              <div v-else-if="!detail.price || Number(detail.price) == 0">
                该订单免费
              </div>
              <div v-else>待支付</div>
            </div>
            <div v-else-if="detail.status == 8" class="top-tip text-center">
              已完成服务，请通知对方及时确认
            </div>
            <div v-if="detail.order_id">
              <v-cell
                is-link
                :arrow-direction="showMoreOrderInfo ? 'up' : 'down'"
                size="large"
                title="订单号"
                :value="detail.order_id"
                title-style="flex:none;"
                @click="showMoreOrderInfo = !showMoreOrderInfo"
              />
              <template v-if="showMoreOrderInfo">
                <v-cell
                  size=""
                  title="生成时间"
                  :value="detail.accept_time"
                  title-style="flex:none;"
                />
                <v-cell
                  v-if="detail.pay_time"
                  size=""
                  title="支付时间"
                  :value="detail.pay_time"
                  title-style="flex:none;"
                />
                <v-cell
                  v-if="detail.pay_type"
                  size=""
                  title="支付方式"
                  :value="detail.pay_type | transformPayType"
                />
              </template>
            </div>
          </template>
          <div class="user-wrap">
            <div class="flex-box item-title">
              <div class="left">远程诊断需求方</div>
              <div v-if="detail" class="right text-small">
                <!-- <span v-if="detail.status == 2 && detail.order_id && detail.pay_status" class="link">
                  {{detail.pay_status | transformPayStatus}}
                </span> -->
                <v-status-badge :status="detail.status" />
              </div>
            </div>
            <div v-if="detail" class="flex-box info-wrap">
              <div class="thumb">
                <img
                  onerror="this.src='https://thinklink.mythinkcar.cn/static/img/user.jpeg';this.onerror=null"
                  :src="detail.customer_info.headimgurl || ''"
                  alt="头像"
                />
              </div>
              <div class="info">
                <div>{{ detail.customer_info.nickname || "未知昵称" }}</div>
                <div>
                  SN:{{ detail.serial_number
                  }}{{ detail.serial_number | getSnTxt }}
                </div>
                <div class="text-muted text-small">
                  {{ detail.create_time }} 发布
                </div>
              </div>
              <div
                class="city"
                v-if="
                  detail.customer_info.city &&
                    detail.customer_info.city != 'null'
                "
              >
                <v-icon name="location-o" />
                {{ detail.customer_info.city || "" }}
              </div>
            </div>
            <div v-else-if="customer" class="flex-box info-wrap">
              <div class="thumb">
                <img
                  :src="customer.user_info.avatar || ''"
                  alt="头像"
                  onerror="this.src='https://thinklink.mythinkcar.cn/static/img/user.jpeg';this.onerror=null"
                />
              </div>
              <div class="info">
                <div>{{ customer.user_info.user_name || "未知昵称" }}</div>
                <!-- <div @click="onSelectCDevice">
                  SN:{{ this.selectCDevice }} {{ this.selectCDevice | getSnTxt
                  }}<v-icon name="arrow-down" />
                </div> -->
                SN:
                <el-select
                  v-model="selectCDevice"
                  placeholder="请选择"
                  class="im_sn_select"
                >
                  <el-option
                    v-for="item in transformCDeviceList"
                    :key="item.name"
                    :value="item.name"
                  >
                    <span style="float: left">{{ item.name }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.name | getSnTxt }}</span
                    >
                  </el-option>
                </el-select>
                {{ selectCDevice | getSnTxt }}
              </div>

              <div class="city" v-if="customer.user_info.location">
                <v-icon name="location-o" /> {{ customer.user_info.location }}
              </div>
            </div>
            <div v-if="showIM && detail" class="links">
              <div class="link-consulting">
                <v-icon name="chat-o" />
                <a @click="handleConsultingOnline">在线咨询</a>
              </div>
              <!-- <div class="link-phone">
                <v-icon name="phone-o" />
                <a
                  :href="
                    'tel:' + (detail.telephone || detail.customer_info.phone)
                  "
                  >拨打电话</a
                >
              </div> -->
            </div>
          </div>
          <v-cell
            :class="{ disabled: detail && detail.status != 1 }"
            :value="service"
            is-link
            title="服务项目"
            size="large"
            @click="showSelectServiceTpl = true"
          />
          <v-field
            v-model="price"
            type="number"
            name="price"
            label="价格"
            placeholder="请输入价格"
            :formatter="priceFormatter"
            format-trigger="onBlur"
            input-align="right"
            size="large"
          />
          <!-- <v-cell
            title="我的设备"
            size="large"
            is-link
            :value="selectDevice"
            @click="onSelectBDevice"
          /> -->

          <v-cell
            size="large"
            :class="{ disabled: detail && detail.status != 1 }"
            style="display: flex;align-items: center;"
          >
            <template #title>
              <span style="vertical-align: middle">我的设备</span>
            </template>
            <template #right-icon>
              <span v-if="freeDeviceList.includes(selectDevice)"> 空闲：</span>
              <el-select
                v-model="selectDevice"
                placeholder="请选择"
                class="im_sn_select"
              >
                <el-option
                  v-for="item in bDeviceList"
                  :key="item.device_id"
                  :value="item.serial_number"
                >
                  <span style="float: left">
                    <span v-if="freeDeviceList.includes(item.serial_number)">
                      空闲：</span
                    >{{ item.serial_number }}</span
                  >
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.serial_number | getSnTxt
                  }}</span>
                </el-option>
              </el-select>
              {{ selectDevice | getSnTxt }}
            </template>
          </v-cell>

          <v-cell
            size="large"
            :class="{ disabled: detail && detail.status != 1 }"
          >
            <template #title>
              <v-popover
                trigger="click"
                v-model="showModeDesc"
                placement="top-start"
                theme="dark"
              >
                <div style="padding:10px;">
                  在智能模式下，接头可以自动识别CANBUS协议车辆，<br />如非CANBUS协议车辆，请不要勾选。
                  <!-- 智能模式选项下，设备可以自动识别车辆。<br />非智能模式下，可手动录入车辆信息。 -->
                </div>
                <template #reference>
                  <span style="vertical-align: middle">诊断模式</span>
                  <v-icon
                    name="question-o"
                    size="large"
                    class="link"
                    style="vertical-align: middle"
                  />
                </template>
              </v-popover>
            </template>
            <template #right-icon>
              <!-- <v-checkbox
                v-model="checked"
                shape="square"
                @change="onCheckedChange"
                >智能模式</v-checkbox
              > -->
              <a-checkbox
                v-model="checked"
                shape="square"
                @change="onCheckedChange"
              >
                智能模式
              </a-checkbox>
            </template>
          </v-cell>
          <v-cell
            v-show="!checked"
            title="选择车辆"
            is-link
            size="large"
            value-class="cell-value"
            :value="car"
            @click="showSelectCarTpl = true"
          />
          <!-- <v-cell 
            title="车辆故障描述" 
            size="large"
            :label="faultDesc || '无'"
          /> -->
          <v-field
            v-model="faultDesc"
            rows="1"
            autosize
            label="故障描述"
            type="textarea"
            placeholder="请输入故障描述"
            size="large"
            maxlength="200"
            show-word-limit
          />
          <!-- 图片 -->
          <div style="padding:15px 0">
            <v-image
              v-for="(pic, _idx) in picList"
              :src="pic"
              :key="_idx"
              width="100"
              height="100"
              style="padding-left:15px;"
            />
          </div>
          <template v-if="detail">
            <v-cell
              v-if="detail.advice"
              title="维修建议"
              size="large"
              :label="detail.advice"
            />
            <v-cell
              v-if="detail.is_comment == 1"
              size="large"
              :label="detail.content"
            >
              <template #title>
                <span>服务评价</span>
                <div class="star-wrap">
                  <rate-com label="技术能力" :value.sync="scores[0]" readonly />
                  <rate-com label="服务态度" :value.sync="scores[1]" readonly />
                  <rate-com label="响应速度" :value.sync="scores[2]" readonly />
                </div>
              </template>
            </v-cell>
            <v-cell
              v-if="detail.status == 2 && detail.pay_status == 0"
              title="系统说明"
              size="large"
              label="为保证双方利益，支付费用将会先支付到专门账号托管，双方确认服务完成后，服务费用会自动转账到服务商家账号"
            />
          </template>
        </div>
        <div class="btn-group">
          <!-- <div class="btn-cell">
            <a class="weui-btn weui-btn_primary" @click="closePopup">返回</a>
          </div> -->
          <template v-if="detail">
            <div v-if="detail.status == 1" class="btn-cell">
              <!-- <a class="weui-btn weui-btn_primary" @click="onAcceptTask"
                >提供服务</a > -->
              <el-button
                type="primary"
                @click="onAcceptTask"
                class="flex-1"
                round
                >提供服务</el-button
              >
            </div>
            <template v-if="detail.status == 2">
              <div class="btn-cell">
                <!-- <a class="weui-btn weui-btn_primary" @click="onGiveUpTask"
                  >放弃</a
                > -->
                <el-button
                  type="primary"
                  class="flex-1"
                  round
                  @click="onGiveUpTask"
                  >放弃</el-button
                >
              </div>
              <!-- <div v-if="detail.pay_status" class="btn-cell">
                <a class="weui-btn weui-btn_primary" @click="onEditPrice">修改价格</a>
              </div> -->
              <div
                v-if="
                  Number(detail.price) == 0 ||
                    (detail.order_id && detail.pay_status == 1)
                "
                class="btn-cell"
              >
                <!-- <a class="weui-btn weui-btn_primary" @click="onFinishTask"
                  >完成</a
                > -->
                <el-button
                  type="primary"
                  class="flex-1"
                  round
                  @click="onFinishTask"
                  >完成</el-button
                >
              </div>
            </template>
            <div v-if="detail.status == 7" class="btn-cell">
              <!-- <a class="weui-btn weui-btn_primary">取消</a> -->
              <el-button type="primary" class="flex-1" round>取消</el-button>
            </div>
          </template>
          <template v-else>
            <div class="btn-cell flex">
              <!-- <a class="weui-btn weui-btn_primary" @click="onReleaseTask"
                >提交</a
              > -->
              <el-button
                type="primary"
                class="flex-1"
                round
                @click="onReleaseTask"
                >提交</el-button
              >
            </div>
          </template>
        </div>
      </div>
    </v-popup>

    <!-- 输入维修建议 -->
    <v-popup
      v-model="showInputAdvice"
      closeable
      close-icon="arrow-left"
      close-icon-position="top-left"
      position="right"
      class="popup-wrap popup-advice"
      @close="closeInputAdvice"
    >
      <h3 class="title">维修建议</h3>
      <div class="textarea-wrap">
        <!-- <v-text-area
          placeholder="请输入车辆维修建议（最多600字)"
          :max="600"
          :value="advice"
          @input="onAdviceInput"
        /> -->
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="advice"
          maxlength="600"
          show-word-limit
          class="tc_txt_main"
        >
        </el-input>
      </div>
      <div class="btn-wrap">
        <!-- <a
          class="weui-btn weui-btn_primary btn-block"
          @click="retuestFinishTask"
          >完成</a
        > -->
        <el-button
          type="primary"
          class="tc_txt_btn1"
          round
          @click="retuestFinishTask"
          >完成</el-button
        >
      </div>
    </v-popup>
    <!-- C选择远程诊断盒 -->
    <v-action-sheet
      title="请选择远程诊断盒"
      cancel-text="取消"
      v-model="showCDevice"
      :actions="transformCDeviceList"
      @select="onConfirmCDevice"
      close-on-click-action
    />
    <!-- B选择远程诊断盒 -->
    <v-action-sheet
      title="请选择远程诊断盒"
      cancel-text="取消"
      v-model="showDevice"
      :actions="transformDeviceList"
      @select="onConfirmBDevice"
      close-on-click-action
    />
    <!-- 选择服务项目 -->
    <v-select-service
      :show="showSelectServiceTpl"
      @close="closeSelectServiceTpl"
      @confirm="confirmSelectService"
    />

    <!-- 选择车系、车型、年款 -->
    <v-select-car
      :show="showSelectCarTpl"
      @close="closeSelectCarTpl"
      @confirm="confirmSelectCar"
    />
    <!-- 提供服务：选择B端设备、价格 -->
    <van-dialog
      v-model="showSetDeviceAndPrice"
      title="提供服务"
      show-cancel-button
      confirmButtonText="提交"
      :beforeClose="validateFields"
      @confirm="requestImEditTask"
    >
      <v-form>
        <v-field
          readonly
          clickable
          name="picker"
          :value="selectDevice"
          label="设备"
          placeholder="点击选择设备"
          @click="showDevice = true"
        />

        <v-field
          v-model="price"
          type="number"
          name="price"
          label="价格"
          placeholder="请输入价格"
          :formatter="priceFormatter"
          format-trigger="onBlur"
        />
      </v-form>
    </van-dialog>
  </div>
</template>

<script>
// @ts-nocheck
/* eslint-disable */
// @ts-ignore
import { mapState, mapActions } from "vuex";
import {
  Popup,
  List,
  Cell,
  Icon,
  ActionSheet,
  Checkbox,
  Popover,
  Form,
  Field,
  Picker,
  Collapse,
  CollapseItem,
  Image as VanImage,
} from "vant";
import StatusBadge from "./status-badge";
import RateCom from "./rate";
import {
  getDeviceList,
  bsReleaseTask,
  imGetTaskDetail,
  imEditTask,
  imModifyTask,
  getFreeDevice,
} from "@/api/api";
import {
  DEVICE_TYPE_B,
  IM_ACCEPT_TASK,
  IM_FINISH_TASK,
  IM_GIVEUP_TASK,
} from "@/utils/im/public";

import TextArea from "./text-area";
import SelectService from "./select-service";
import SelectCar from "./select-car";

export default {
  name: "TaskDetail",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    showIM: {
      //是否显示IM聊天窗口
      type: Boolean,
      default: false,
    },

    taskId: {
      type: [Number, String],
      default: 0,
    },
    customer: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      showPop: this.show,
      detail: null,
      // bDeviceList: [],
      selectCDevice: "", //选择的C端设备,
      selectDevice: "", //选择的B端设备
      roleType: this.roleId,
      //reasonList: ["用户已不需要远程诊断", "问题已经解决了", "其他"],
      showInputAdvice: false,
      advice: "", //维修建议
      showCDevice: false, //展示或隐藏c端设备列表
      showDevice: false, //展示或隐藏b端设备列表
      service: "", //服务项目
      serviceId: "",
      showSelectServiceTpl: false,
      checked: false, //是否智能模式
      showModeDesc: false, //诊断模式介绍
      showSelectCarTpl: false, //选择车辆
      //car:'',//车辆
      brand: "", //品牌
      models: "", //车型
      year: "", //年款
      displacement: "", //排量
      scores: [0, 0, 0], //评分：[技术能力,服务态度,响应速度]
      showSetDeviceAndPrice: false,
      price: 0, //价格,
      showMoreOrderInfo: false, //是否显示更多订单信息，
      faultDesc: "", //故障描述
      picList: [],
    };
  },
  computed: {
    ...mapState(
      {
        bDeviceList: (state) => state.chat.imDeviceList,
        freeDeviceList: (state) => state.chat.freeDeviceList,
        chat: (state) => state.chat,
        // selectDevice: (state) => state.chat.imSelecgDevice,
      },
      ["userInfo"]
    ),
    transformDeviceList() {
      let arr = this.bDeviceList.map((item) => {
        item.name = item.serial_number;
        return item;
      });
      return arr;
    },
    transformCDeviceList() {
      let arr =
        this.customer && this.customer.sn_info
          ? this.customer.sn_info.map((item) => {
              return { name: item };
            })
          : [];
      return arr;
    },
    car: {
      get: function() {
        let arr = [
          this.brand,
          this.models,
          this.year,
          this.displacement,
        ].filter((item) => item && item !== "不限");
        return arr.join("、");
      },
      set: function(newV, oldV) {
        let arr = newV.split("、"),
          option = "不限";
        this.brand = arr[0] || option;
        this.models = arr[1] || option;
        this.year = arr[2] || option;
        this.displacement = arr[3] || option;
      },
    },
  },
  filters: {
    transformPayStatus: function(value) {
      //支付状态
      let status = "";
      switch (parseInt(value)) {
        case 0:
          status = "未支付";
          break;
        case 1:
          status = "已支付";
          break;
        case 2:
          status = "支付失败";
          break;
        case 3:
          status = "退款中";
          break;
        case 4:
          status = "退款成功";
          break;
      }
      return status;
    },
    transformPayType: function(value) {
      //支付类型
      let type = "";
      switch (parseInt(value)) {
        case 1:
          type = "微信";
          break;
      }
      return type;
    },
  },
  methods: {
    ...mapActions(["onSendCustomMsg", "addfirend", "onGetHistoryTaskList"]),
    onOpenedPopup() {
      if (this.showPop) {
        if (this.taskId) {
          //编辑或查看订单
          this.getTaskDetail(this.taskId);
        } else {
          //创建订单
          this.selectCDevice = this.customer.sn_info[0];
        }
      }
    },
    resetData() {
      //初始化数据
      this.detail = null;
      this.serviceId = "";
      this.service = "";
      this.checked = false;
      this.brand = "";
      this.advice = "";
      this.models = "";
      this.year = "";
      this.displacement = "";
      this.price = 0;
      this.faultDesc = "";
      this.selectCDevice = ""; //选择的C端设备,
      this.selectDevice = this.freeDeviceList[0] || ""; //选择的B端设备
    },
    closePopup() {
      //关闭详情面板
      this.closeInputAdvice();
      this.resetData();
      this.$emit("close");

      //  this.getBindDeviceList().then((data) => {
      //   console.log("===data=====", data);
      //   if (data.data && data.data.length > 0) {
      //     this.$store.commit("setImDList", data.data || []);
      //     this.onGetHistoryTaskList();
      //     this.getFreeDevice().then((data2) => {
      //       console.log("===data=====", data2);
      //       if (data2.data && data2.data.length > 0) {
      //         this.$store.commit("setFreeDeviceList", data2.data || []);
      //         this.$store.commit("setSDevice", data2.data[0] || "");
      //       }
      //     });
      //   }
      // });
    },
    getTaskDetail(taskId) {
      //获取任务详情
      this.$showLoading();
      return imGetTaskDetail({ task_id: taskId })
        .then((data) => {
          if (data.data && data.data.task_id) {
            const _d = data.data;
            this.$hideLoading();
            this.detail = _d;
            this.service = _d.item_name || "";
            this.serviceId = _d.item_id || "";
            this.brand = _d.brand;
            this.models = _d.models;
            this.year = _d.year;
            this.displacement = _d.displacement;
            this.checked = _d.task_type == 1;
            this.price = _d.price || 0;
            this.selectDevice =
              _d.accept_serial_number || this.bDeviceList[0].serial_number;
            this.faultDesc = _d.fault_description;
            this.picList = _d.picture_list && _d.picture_list.split(",");
            if (this.detail.is_comment == 1) {
              let scores = this.detail.score
                ? this.detail.score.split("|")
                : [0, 0, 0];
              this.scores = scores.map((item) => parseInt(item));
            }
          } else {
            this.$message({
              type: "fail",
              message: "该任务已被取消或删除",
              onClose: () => {
                this.closePopup();
              },
            });
          }
        })
        .catch((err) => {
          this.closePopup();
        })
        .finally(() => {
          this.$hideLoading();
        });
    },
    priceFormatter(value) {
      // 过滤输入的数字
      return Math.abs(value).toFixed(2);
    },
    handleConsultingOnline() {
      console.log("在线咨询", this.detail, this.chat.userList);
      if (this.detail.customer_info && this.detail.customer_info.hx_id) {
        let selectedUser = this.detail.customer_info.hx_id;
        let friends = this.chat.userList.contactUserList;
        let res = friends.filter((item) => item.name == selectedUser); //判断是否为好友
        if (res.length) {
          //好友
          this.$emit("gotoim", res[0]);
          // this.$store.commit("updateChatVisibility", true);
          // this.$store.commit("updateSelectedUser", res[0]);
        } else {
          //非好友，先添加好友
          this.addfirend({
            id: selectedUser,
          });
          setTimeout(() => {
            this.$emit("gotoim", res[0]);
            // this.$store.commit("updateChatVisibility", true);
            // this.$store.commit("updateSelectedUser", { name: selectedUser });
          }, 500);
        }
      } else {
        this.$message("未获取到对方IM账号，无法在线咨询");
      }

      // console.log("在线咨询");
      // let selectedUser = this.detail.customer_info.hx_id;
      // let friends = this.chat.userList.contactUserList;
      // let res = friends.filter((item) => item.name == selectedUser); //判断是否为好友
      // if (res.length) {
      //   //好友
      //   this.$store.commit("updateChatVisibility", true);
      //   this.$store.commit("updateSelectedUser", res[0]);
      // } else {
      //   //非好友，先添加好友
      //   this.addfirend({
      //     id: selectedUser,
      //   });
      //   setTimeout(() => {
      //     this.$store.commit("updateChatVisibility", true);
      //     this.$store.commit("updateSelectedUser", { name: selectedUser });
      //   }, 500);
      // }
    },
    onGiveUpTask() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定放弃任务？",
          overlayClass: "im_tdfb_bg0",
        })
        .then(() => {
          let params = {
            serial_number: this.detail.accept_serial_number,
            task_id: this.detail.task_id,
            status: 6,
            //wx_type: 5,
          };
          this.requestModifyTask(params).then((data) => {
            this.onSendMsgAboutTask({
              order_state: IM_GIVEUP_TASK,
              task_id: this.taskId || "",
              price: this.price || 0,
              pay_status: this.detail.pay_status || "",
              task_type: this.detail.task_type,
              brand: this.detail.brand || "",
              models: this.detail.models || "",
              year: this.detail.year || "",
              service: this.detail.item_name || "",
              to_hx_id: this.detail.customer_info.hx_id,
            });
            this.onGetHistoryTaskList();
            this.closePopup();
          });
        })
        .catch(() => {});
    },
    requestModifyTask(params) {
      //修改任务状态
      this.$showLoading();
      return imModifyTask(params)
        .then((data) => {
          //成功
          this.$message({
            type: "success",
            message: "操作成功",
            onClose: () => {
              return Promise.resolve(true);
            },
          });
        })
        .catch((err) => {
          this.$message(err);
        })
        .finally(() => {
          this.$hideLoading();
        });
    },
    updateDetail(taskId, status) {
      this.$emit("updateStatus", taskId, status);
      this.getTaskDetail(taskId);
    },
    onFinishTask() {
      //B端完成任务
      this.$dialog
        .confirm({
          title: "提示",
          overlayClass: "im_tdfb_bg0",
          message:
            '确认需求已完成？<p class="text-muted">确认完成后，如需再次对此车辆进行远程诊断操作，需要对方重新发布新的需求。</p>',
        })
        .then(() => {
          this.showInputAdvice = true;
        })
        .catch(() => {});
    },
    closeInputAdvice() {
      this.showInputAdvice = false;
    },
    onAdviceInput(val) {
      this.advice = val;
    },
    retuestFinishTask() {
      let params = {
        serial_number: this.detail.accept_serial_number,
        task_id: this.detail.task_id,
        advice: this.advice,
        status: 8,
      };
      this.requestModifyTask(params).then((data) => {
        this.onSendMsgAboutTask({
          order_state: IM_FINISH_TASK,
          task_id: this.taskId,
          to_hx_id: this.detail.customer_info.hx_id,
          task_type: this.detail.task_type,
          brand: this.detail.brand || "",
          models: this.detail.models || "",
          year: this.detail.year || "",
          service: this.detail.item_name || "",
        });
        this.onGetHistoryTaskList();
        this.closePopup();
      });
    },
    onAcceptTask: async function() {
      try {
        if (!this.checked && !this.car) {
          this.$message("请选择车辆");
          return;
        }

        if (this.bDeviceList.length == 0) {
          let deviceList = await this.getBindDeviceList();
          this.bDeviceList = deviceList || [];
        }

        if (this.bDeviceList.length > 0) {
          //有B端设备方可领取任务
          //选择设备
          this.requestImEditTask();
        } else {
          //无B端设备：提示去绑定设备
          this.$dialog
            .confirm({
              overlayClass: "im_tdfb_bg0",
              title: "提示",
              message: "您还未绑定诊断盒，请先绑定诊断盒后再提供远程诊断服务",
            })
            .then(() => (location.href = "bind_box.html"))
            .catch(() => {});
        }
      } catch (err) {
        this.$message(err);
      }
    },
    getBindDeviceList() {
      this.$showLoading();
      return getDeviceList(DEVICE_TYPE_B)
        .then((data) => Promise.resolve(data))
        .finally(() => {
          this.$hideLoading();
        });
    },
    validateFields(action, done) {
      //验证设备及价格
      if (action == "confirm") {
        if (!this.selectDevice) {
          this.$message("请选择提供诊断服务的设备");
          done(false);
          return;
        }
        if (!this.price) {
          this.$message("请输入价格");
          done(false);
          return;
        }
        done();
      } else {
        done();
      }
    },
    requestImEditTask() {
      //领取任务
      this.$showLoading();
      let params = {
        task_id: this.taskId,
        accept_serial_number: this.selectDevice,
        price: this.price,
        task_type: this.checked ? 1 : 0,
        item_id: this.serviceId,
      };
      if (!params.task_type) {
        //非智能模式下需要车辆品牌、车型、年款
        let option = "不限";
        params.brand = this.brand || option;
        params.models = this.models || option;
        params.year = this.year || option;
        params.displacement = this.displacement || option;
      }
      return imEditTask(params)
        .then((data) => {
          //发布成功
          this.$message({
            type: "success",
            message: "操作成功",
            onClose: () => {
              this.onSendMsgAboutTask({
                order_state: IM_ACCEPT_TASK,
                task_id: this.taskId || "",
                brand: this.brand || "",
                models: this.models || "",
                year: this.year || "",
                service: this.service || "",
                price: this.price ? Number(this.price) : 0,
                price_image: data.qrcode_url || "",
                task_type: this.checked ? 1 : 0,
              });
              this.onGetHistoryTaskList();
              this.closePopup();
            },
          });
        })
        .catch((err) => {
          // this.$message(err);
        })
        .finally(() => {
          this.$hideLoading();
        });
    },
    getScore(score, index) {
      let _score = score || "";
      let arr = _score.split("|");
      return parseInt(arr[index] || 0);
    },
    closeSelectServiceTpl(service = "") {
      this.showSelectServiceTpl = false;
    },
    confirmSelectService(service = "", serviceId) {
      this.service = service;
      this.serviceId = serviceId;
    },
    closeSelectCarTpl(car) {
      this.showSelectCarTpl = false;
    },
    confirmSelectCar(car) {
      console.log("选择的车辆", car);
      this.car = car;
    },
    onEditPrice() {
      this.$message("待开发");
    },
    onSelectBDevice: async function() {
      if (this.bDeviceList.length == 0) {
        let deviceList = await this.getBindDeviceList();
        this.bDeviceList = deviceList || [];
        this.showDevice = true;
        //this.$emit("getDeviceList", deviceList);
      } else {
        this.showDevice = true;
      }
    },
    onSelectCDevice() {
      //选择c端的设备
      this.showCDevice = true;
    },
    onConfirmBDevice(action, index) {
      //确认选择的B端设备
      //选择设备
      this.selectDevice = action.serial_number;
    },
    onConfirmCDevice(action, index) {
      //确认选择的C端设备
      //选择设备
      this.selectCDevice = action.name;
    },
    onReleaseTask() {
      //商家发布任务
      let params = {
        c_golo_user_id: this.customer.user_info.cc,
        c_hx_id: this.chat.selectedUser.name,
        c_serial_number: this.selectCDevice,
        accept_serial_number: this.selectDevice,
        task_type: this.checked ? 1 : 0,
        price: this.price ? Number(this.price) : 0,
        fault_description: this.faultDesc,
        c_avatar: this.customer.user_info.avatar,
        c_nickname: this.customer.user_info.user_name,
        c_city: this.customer.user_info.location,
        //vin
      };
      if (!this.selectCDevice) {
        this.$message("请选择C端设备");
        return;
      }
      if (!this.selectDevice) {
        this.$message("请选择提供诊断服务的设备");
        return;
      }
      if (!this.checked && !this.car) {
        this.$message("请选择车辆");
        return;
      }
      if (this.serviceId) {
        params.item_id = this.serviceId;
      }
      if (!this.checked) {
        //非智能模式下需要车辆品牌、车型、年款
        let option = "不限";
        params.brand = this.brand || option;
        params.models = this.models || option;
        params.year = this.year || option;
        params.displacement = this.displacement || option;
      }

      this.$showLoading();
      return bsReleaseTask(params)
        .then((data) => {
          this.$hideLoading();
          this.$message({
            type: "success",
            message: "成功",
            onClose: () => {
              this.onSendMsgAboutTask({
                order_state: IM_ACCEPT_TASK,
                task_id: data.data.task_id || "",
                brand: this.brand || "",
                models: this.models || "",
                year: this.year || "",
                price: this.price ? Number(this.price) : 0,
                price_image: data.data.qrcode_url || "",
                task_type: this.checked ? 1 : 0,
                service: this.service || "",
                to_hx_id: this.chat.selectedUser.name,
              });
              this.getFreeDevice().then((data2) => {
                console.log("===data=====", data2);
                if (data2.data) {
                  this.$store.commit("setFreeDeviceList", data2.data || []);
                  // this.$store.commit("setSDevice", data2.data[0] || "");
                }
              });

              this.onGetHistoryTaskList();

              this.closePopup();
            },
          });
        })
        .catch((err) => {
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
    onCheckedChange(val) {
      if (val) {
        this.brand = "";
        this.models = "";
        this.year = "";
        this.displacement = "";
      }
    },
    onSendMsgAboutTask(item) {
      //发送自定义消息
      console.log("在任务详情中发送自定义消息", item);
      this.onSendCustomMsg({
        chatType: this.chat.chatType,
        chatId: item.to_hx_id
          ? { name: item.to_hx_id }
          : this.chat.selectedUser,
        message: item,
      });
    },
  },
  watch: {
    show: function(newValue) {
      this.showPop = newValue;
      /*if (this.showPop ) {
        if(this.taskId){//编辑或查看订单
          this.getTaskDetail(this.taskId);
        } else {//创建订单
            this.selectCDevice = this.customer.sn_info[0]
        }

      }*/
    },
  },
  created() {
    //this.getTaskDetail(this.taskId)
    // this.getBindDeviceList().then((data) => {
    //   console.log("===data=====", data);
    //   this.bDeviceList = data.data || [];
    //   this.selectDevice = data.data[0].serial_number;
    // });
    this.selectDevice = this.$store.state.chat.imSelecgDevice;
    // console.log(this.$store.state, "======this.$store.state====");
  },
  components: {
    vPopup: Popup,
    //vStep: Step,
    vIcon: Icon,
    vStatusBadge: StatusBadge,
    vActionSheet: ActionSheet,
    vTextArea: TextArea,
    vCell: Cell,
    vSelectService: SelectService,
    vSelectCar: SelectCar,
    vCheckbox: Checkbox,
    vPopover: Popover,
    vForm: Form,
    vField: Field,
    vPicker: Picker,
    vCollapse: Collapse,
    vCollapseItem: CollapseItem,
    RateCom,
    VImage: VanImage,
  },
};
</script>

<style lang="less" scoped>
// 主色
@color-primary: #007cc3;

.padding {
  padding: 32px;
}
.van-field__label {
  color: red;
}
.popup-wrap {
  display: flex;
  flex-direction: column;
  width: 30%;
  height: 100%;
  .title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    color: @color-primary;
    border-bottom: 1px solid #dbdbdb;
    font-size: 18px;
  }
}
.detail-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  /* padding: 0 25px; */
  box-sizing: border-box;
  overflow: auto;
  padding-top: 40px;
  .item {
    font-size: 30px;
  }

  /* .title {
      height: 54PX;
      line-height: 54PX;
      text-align: center;
      color: @color-primary;
      border-bottom: 1PX solid #dbdbdb;
    } */
  .inner-wrap {
    flex: 1;
    height: 100%;
    overflow: auto;
  }
  .user-wrap {
    padding: 5px 25px;
    .flex-box {
      display: flex;
    }
    .item-title {
      padding-bottom: 10px;
      border-bottom: 1px solid #dbdbdb;
      align-items: center;
      .left {
        flex: 2;
      }
      .right {
        flex: 1;
        text-align: right;
        padding: 5px 10px;
      }
    }
    .info-wrap {
      padding: 8px 0;
      align-items: center;
      .thumb {
        flex: 1;
        padding-right: 5px;
        display: flex;
        justify-content: center;
        img {
          // max-width: 100%;
          height: 50px;
          width: 50px;
          border-radius: 25px;
        }
      }
      .info {
        flex: 3;
        padding-left: 5px;
      }
      .city {
        flex: 1;
        text-align: right;
      }
    }
    .phone {
      height: 40px;
      line-height: 40px;
      margin: 20px 0;
      border: 1px solid @color-primary;
      text-align: center;
      font-size: 1.1em;
      color: @color-primary;
      border-radius: 4px;
    }
    .links {
      display: flex;
      height: 75px;

      > div + div {
        border-left: 1px solid #dbdbdb;
      }

      .link-consulting,
      .link-phone {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        > a {
          margin-left: 16px;
        }
      }
    }
  }
  .car-wrap {
    .item-title {
      font-weight: bold;
      font-size: 1.1em;
      margin-top: 5px;
    }
    .item-content {
      line-height: 1.8;
    }
  }
}
.btn-group {
  box-sizing: border-box;
  padding: 30px 0;
  border-top: 1px solid #f5f5f5;
  display: flex;
  /* margin-left: -25px;
    margin-right: -25px; */
  .btn-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    // display: inline-block;
    padding: 0 25px;
    box-sizing: border-box;
    .weui-btn {
      width: 100%;
    }
  }
}
.icon {
  color: @color-primary;
}
.popup-advice {
  .textarea-wrap {
    padding: 15px;
    border-bottom: 1px solid #eee;
    margin-bottom: 30px;
  }
}
.popup-evaluate {
  background-color: #eee;
  .star-wrap {
    padding: 30px;
    line-height: 2;
  }
  .text-area {
    padding: 30px;
    background-color: #fff;
    margin-bottom: 50px;
    font-size: 16px;
  }
}
.btn-wrap {
  padding: 0 15px;
}
.btn-block {
  width: 100%;
}
.top-tip {
  padding: 10px;
  background-color: orange;
}
.disabled {
  pointer-events: none;
}
.flex-1 {
  flex: 1 1 0%;
}
.tc_txt_btn1 {
  width: 100%;
}
</style>
