<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb class="mt-8">
      <el-breadcrumb-item>商家管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的收入</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <div class="mt-4 px-8">
      <!-- 卡片栏 -->
      <div class="flex h-40 ">
        <div
          class="flex-grow rounded-md relative flex justify-center items-center"
          style="background-color: #2a9b5a"
        >
          <img
            class="absolute left-8"
            src="@/assets/income_icon_1.png"
            alt=""
          />
          <div class="flex flex-col items-center">
            <div class="text-white text-xs mb-8">可提现（元）</div>
            <div class="text-white text-3xl">
              ¥{{ formatPrice(withdrawable) }}
            </div>
          </div>
          <button
            v-if="!isBusinessTechnician"
            class="absolute right-8 text-white border border-solid border-white rounded-full py-2 px-4 w-16 box-content bg-transparent cursor-pointer"
            @click="showDialog = true"
          >
            提现
          </button>
        </div>
        <div
          class="flex-grow rounded-md relative flex justify-center items-center ml-4"
          style="background-color: #0083d2"
        >
          <img
            class="absolute left-8"
            src="@/assets/income_icon_2.png"
            alt=""
          />
          <div class="flex flex-col items-center">
            <div class="text-white text-xs mb-8">总收益（元）</div>
            <div class="text-white text-3xl">
              ¥{{ formatPrice(totalMoney) }}
            </div>
          </div>
        </div>
      </div>
      <!-- tabs -->
      <div class="flex mt-4 p2-8">
        <div
          v-for="(tab, idx) in tabs"
          :key="tab"
          class="tab mr-4"
          :class="{ actived: curTabIdx === idx }"
          @click="curTabIdx = idx"
        >
          {{ tab }}
        </div>
      </div>
      <!-- 内容 -->
      <div class="card mt-4 px-4 divide-y divide-gray-300 divide-solid ">
        <template v-if="curTabIdx === 0">
          <div class="py-4" v-for="(v, idx) in filterIncomeList" :key="idx">
            <div>服务项目：{{ v.item_name }}</div>
            <div>服务费用：¥{{ formatPrice(v.price) }}</div>
            <div>{{ v.pay_time }}</div>
          </div>
        </template>
        <template v-else>
          <div class="py-4" v-for="(v, idx) in filterOutList" :key="idx">
            <div>提现金额：¥{{ formatPrice(v.price) }}</div>
            <div>提现时间：{{ v.createtime }}</div>
            <div>转入账号：{{ v.nickname }}</div>
            <div>提现状态：{{ EWithdrawStatus[+v.status] }}</div>
          </div>
        </template>
      </div>
      <!-- 分页 -->
      <el-pagination
        class="mt-4"
        :total="total"
        :current-page.sync="page"
        :page-size="pageSize"
      ></el-pagination>
    </div>
    <!-- 提现弹窗 -->
    <el-dialog :visible.sync="showDialog" width="500px" title="提交申请">
      <div class="flex flex-col">
        <el-input-number
          class="input-number"
          :controls="false"
          controls-position="right"
          placeholder="输入提现金额"
          size="small"
          v-model="withdrawalAmount"
          :max="maxLimit"
          :precision="2"
          :min="1"
        ></el-input-number>

        <div class="mt-4 text-sm">
          提交申请后，提现金额将会自动在24小时以内将钱自动转入至管理员绑定微信红包账号。最小提现金额为1元，个人技师每次提现金额不得超过3000元，商家管理员每次提现金额不得超过5000元。
        </div>
        <el-input
          class="mt-4"
          placeholder="输入管理员绑定手机号"
          size="small"
          v-model="phone"
        ></el-input>
        <el-input
          class="mt-4"
          placeholder="验证码"
          size="small"
          v-model="verifyCode"
          maxlength="6"
        >
          <template slot="append" class="cursor-pointer">
            <el-button @click="handleSendCode">{{ sendCodeText }}</el-button>
          </template>
        </el-input>
        <div class="flex mt-4">
          <el-button
            class="flex-1"
            type="primary"
            round
            size="small"
            @click="handleSubmit"
            >提交</el-button
          >
          <el-button
            class="flex-1"
            round
            size="small"
            plain
            @click="showDialog = false"
            >取消</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { cashOut, myIncome, sendCode, withdrawRecord } from "@/api/api";
import Vue from "vue";
import { mapGetters, mapState } from "vuex";
import numeral from "numeral";
const MAX_COUNTDOWN = 5;

enum EWithdrawStatus {
  未付款,
  已付款,
  付款失败
}

export default Vue.extend({
  name: "my-income",
  data() {
    return {
      tabs: ["收益明细", "提现记录"],
      curTabIdx: 0,
      incomeList: [] as any[],
      outList: [] as any[],
      totalMoney: 0,
      withdrawable: 0,
      page: 1,
      pageSize: 6,
      showDialog: false,
      withdrawalAmount: 0,
      phone: "",
      verifyCode: "",
      countdown: 0,
      interval: -1,
      EWithdrawStatus
    };
  },
  computed: {
    ...mapState("GlobalModule", ["user"]),
    ...mapGetters("GlobalModule", ["isBusiness", "isBusinessTechnician"]),
    total(): number {
      return this.curTabIdx === 0
        ? this.incomeList.length
        : this.outList.length;
    },
    filterIncomeList(): any[] {
      return this.incomeList.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page
      );
    },
    filterOutList(): any[] {
      return this.outList.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page
      );
    },
    sendCodeText(): string {
      return this.countdown ? `${this.countdown}s` : "发送验证码";
    },
    maxLimit(): number {
      return this.isBusiness ? 5000 : 3000;
    }
  },
  beforeMount() {
    this.requestMyIncome();
    this.requestWithdrawRecord();
  },
  methods: {
    requestMyIncome() {
      return myIncome({
        user_id: this.user.user_id,
        s_user_id: this.user.user_id
      }).then(rsp => {
        this.totalMoney = +rsp.data.total_money;
        this.withdrawable = +rsp.data.withdrawable;
        this.incomeList = rsp.data.flow_list;
      });
    },
    requestWithdrawRecord() {
      return withdrawRecord({
        user_id: this.user.user_id
      }).then(rsp => {
        this.outList = rsp.data;
      });
    },
    requestCashOut() {
      return cashOut({
        user_id: this.user.user_id,
        verify_code: this.verifyCode,
        money: this.withdrawalAmount
      });
    },
    requestSendCode() {
      return sendCode({
        req_info: this.phone,
        isres: 1,
        is_check: 0
      });
    },
    formatPrice(number: number | string) {
      return numeral(number).format("0,0.00");
    },
    handleSendCode() {
      if (this.interval > -1) return;
      this.requestSendCode();
      this.countdown = MAX_COUNTDOWN;
      this.interval = setInterval(() => {
        if (--this.countdown === 0) {
          clearInterval(this.interval);
          this.interval = -1;
        }
      }, 1000);
    },
    handleSubmit() {
      this.requestCashOut().then(rsp => {
        this.withdrawalAmount = 0;
        this.showDialog = false;
        this.$message.success("成功提交申请！");
        this.requestWithdrawRecord();
      });
    }
  }
});
</script>

<style lang="less" scoped>
.input-number {
  /deep/.el-input-number {
    @apply w-full;
  }
  /deep/.el-input__inner {
    @apply text-left;
  }
}
</style>
