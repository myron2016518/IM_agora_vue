<template>
  <el-drawer :visible.sync="show" :withHeader="false">
    <div v-loading="loading">
      <!-- 内容 -->
      <div class="flex flex-col p-4 space-y-2" v-if="detail.customer_info">
        <!-- 远程诊断需求方 -->
        <div class="flex flex-col space-y-1">
          <div class="text-base font-bold">远程诊断需求方</div>
          <div class="flex space-x-4">
            <el-avatar
              class="self-center"
              :size="36"
              :src="detail.customer_info.headimgurl"
              fit="contain"
              icon="el-icon-user-solid"
            ></el-avatar>
            <div class="flex flex-col justify-between space-y-1">
              <div>昵称：{{ detail.customer_info.nickname }}</div>
              <div>序列号：{{ detail.accept_serial_number }}</div>
            </div>
          </div>
          <div class="flex flex-col space-y-1">
            <div>地理位置：{{ detail.customer_info.city }}</div>
            <div>价格：{{ detail.price }}</div>
            <div class="flex">
              订单状态：<el-tag
                size="mini"
                effect="plain"
                :type="getOrderTagType(detail.status)"
                >{{ EOrderStatus[detail.status] }}</el-tag
              >
            </div>
            <div>发布时间：{{ detail.create_time }}</div>
            <div v-if="detail.accept_time">
              领取时间：{{ detail.accept_time }}
            </div>
          </div>
        </div>
        <!-- 服务项目 -->
        <div class="flex flex-col space-y-1">
          <div class="text-base font-bold">服务项目</div>
          <div class="flex flex-col space-x-2">
            {{ detail.item_name }}
          </div>
        </div>
        <!-- 车辆信息 -->
        <div class="flex flex-col space-y-1">
          <div class="text-base font-bold">车辆信息</div>
          <div class="flex flex-col space-y-1">
            <div>vin：{{ detail.vin }}</div>
            <div>品牌：{{ detail.brand }}</div>
            <div>车型：{{ detail.models }}</div>
            <div>年款：{{ detail.year }}</div>
            <div>排量：{{ detail.displacement }}</div>
          </div>
        </div>
        <!-- 车辆故障描述 -->
        <div class="flex flex-col space-y-1" v-if="detail.fault_description">
          <div class="text-base font-bold">车辆故障描述</div>
          <div class="flex space-x-4">
            {{ detail.fault_description }}
          </div>
        </div>
        <!-- 维修建议 -->
        <div
          class="flex flex-col space-y-1"
          v-if="
            detail.advice &&
              (detail.status === EOrderStatus.已完成 ||
                detail.status === EOrderStatus.确认完成)
          "
        >
          <div class="text-base font-bold">维修建议</div>
          <div class="flex space-x-4">
            {{ detail.advice }}
          </div>
        </div>
        <!-- 服务评价 -->
        <div v-if="+detail.is_comment === 1" class="flex flex-col space-y-1">
          <div class="text-base font-bold">服务评价</div>
          <div class="flex flex-col space-y-1">
            <div
              class="flex items-center space-x-2"
              v-for="(score, idx) in scores"
              :key="idx"
            >
              <span>{{ EScoreText[idx] }}</span>
              <el-rate
                disabled
                show-score
                :value="score"
                score-template="{value}分"
              ></el-rate>
            </div>
            <div>{{ detail.content }}</div>
          </div>
        </div>
      </div>
      <!-- 按钮 -->
      <div
        class="flex px-4"
        v-if="user.user_id === detail.accept_technician_id"
      >
        <template v-if="detail.status === EOrderStatus.进行中">
          <el-button size="small" type="primary" @click="handleGiveUp"
            >放弃</el-button
          >
          <el-button
            v-if="
              +detail.price === 0 ||
                (detail.order_id && detail.pay_status === EPayStatus.已支付)
            "
            size="small"
            type="primary"
            @click="showRepair = true"
            >完成</el-button
          >
          <el-button
            v-if="detail.status === EOrderStatus.待接单确认"
            size="small"
            type="primary"
            >取消</el-button
          >
        </template>
      </div>
    </div>
    <!-- 维修建议 -->
    <RepairAdvice
      v-model="showRepair"
      @repairSubmit="onRepairSubmit"
    ></RepairAdvice>
  </el-drawer>
</template>

<script lang="ts">
import { getTaskDetail, GetTaskDetailParams, IMModifyTask } from "@/api/api";
import Vue from "vue";
import { mapState } from "vuex";
import { getOrderTagType } from "@/utils/utils";
import { EOrderStatus, EPayStatus, EScoreText } from "@/utils/enum";
export default Vue.extend({
  name: "task-detail",
  components: {
    RepairAdvice: () => import("@/components/RepairAdvice.vue")
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      show: false,
      showRepair: false,
      detail: {} as any,
      loading: false,
      EOrderStatus,
      EPayStatus,
      EScoreText
    };
  },
  computed: {
    ...mapState("GlobalModule", ["user"]),
    scores(): number[] {
      const { score } = this.detail;
      return score ? (score as string).split("|").map(v => +v) : [5, 5, 5];
    }
  },
  watch: {
    value: {
      handler(n) {
        this.show = n;
      },
      immediate: true
    },
    taskId(n) {
      this.fetchDetail({
        golo_user_id: this.user.golo_user_id,
        task_id: n
      });
    },
    show(n) {
      this.$emit("input", n);
    }
  },
  methods: {
    fetchDetail(params: GetTaskDetailParams) {
      this.loading = true;
      return getTaskDetail(params).then(rsp => {
        const detail = rsp.data;
        detail.status = +detail.status;
        detail.pay_status = +detail.pay_status;
        this.detail = detail;
        this.loading = false;
      });
    },
    onRepairSubmit(repairContent: string) {
      const { taskId, detail, user } = this;
      this.showRepair = false;

      IMModifyTask({
        golo_user_id: user.golo_user_id,
        task_id: taskId as number,
        serial_number: detail.accept_serial_number,
        advice: repairContent,
        status: EOrderStatus.确认完成
      }).then(rsp => {
        // todo: 发送IM消息

        this.$emit("change");
        this.fetchDetail({
          golo_user_id: user.golo_user_id,
          task_id: taskId as string
        });
      });
    },
    handleGiveUp() {
      const { taskId, detail, user } = this;
      IMModifyTask({
        golo_user_id: user.golo_user_id,
        task_id: taskId as number,
        serial_number: detail.accept_serial_number,
        status: EOrderStatus.放弃
      }).then(rsp => {
        // todo: 发送IM消息

        this.$emit("change");
        this.fetchDetail({
          golo_user_id: user.golo_user_id,
          task_id: taskId as string
        });
      });
    },
    getOrderTagType
  }
});
</script>
<style lang="less" scoped></style>
