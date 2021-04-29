<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb class="mt-8">
      <el-breadcrumb-item>商家管理</el-breadcrumb-item>
      <el-breadcrumb-item>技师详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 详情 -->
    <div class="mt-4 px-8">
      <div class="card">
        <!-- 基本信息 -->
        <div class="card-item">
          <div class="card-item__title">基本信息</div>
          <div class="card-item__content">
            <div class="flex flex-grow flex-shrink-0">
              微信昵称：{{ user.nickname }}
            </div>
            <div class="flex flex-grow flex-shrink-0">
              姓名：{{ user.user_name }}
            </div>
            <div class="flex flex-grow flex-shrink-0">
              所在地：{{ user.city }}
            </div>
            <div class="flex flex-grow flex-shrink-0">
              绑定手机：{{ user.phone }}
            </div>
            <div class="flex flex-grow flex-shrink-0">
              精修车型：{{ labels }}
            </div>
          </div>
        </div>
        <!-- 绑定设备 -->
        <div class="card-item">
          <div class="card-item__title">绑定设备</div>
          <div class="card-item__content">
            <div class="w-96">
              <el-table
                :data="deviceList"
                size="small"
                header-row-class-name="table-header-row"
                header-cell-class-name="table-header-cell"
                row-class-name="table-body-row"
                cell-class-name="table-body-cell"
                border
              >
                <el-table-column
                  prop="serial_number"
                  label="设备SN"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="createdAt"
                  label="绑定时间"
                  align="center"
                >
                  <template slot-scope="scope">
                    {{ formatDate(scope.row.created) }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!-- 服务评价 -->
        <div class="card-item">
          <div class="card-item__title">服务评价</div>
          <div class="card-item__content">
            <div class="h-24 flex">
              <!-- 绿色卡片 -->
              <div
                class="rounded-lg h-full px-6 space-x-6 flex items-center justify-around"
                style="background-color:#2A9B5A"
              >
                <div class="flex flex-col w-14 h-14 text-white items-center">
                  <span>评价记录</span>
                  <span class="mt-4">{{ total }}</span>
                </div>
                <div
                  class="flex flex-col w-14 h-14 text-white items-center"
                  v-for="(score, idx) in scores"
                  :key="idx"
                >
                  <span>{{ EScoreText[idx] }}</span>
                  <span class="mt-4">{{ score }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 服务评价列表 -->
        <div class="flex flex-col text-sm">
          <div
            class="flex flex-col border-t border-solid border-gray-200 p-4 space-y-4"
            v-for="(v, idx) in evaluateList"
            :key="idx"
          >
            <div class="font-bold">{{ v.nickname }}</div>
            <div class="pl-4 flex" style="color: #777777">
              <div
                class="flex items-center mr-8"
                v-for="(score, idx) in v.scores"
                :key="idx"
              >
                <span class="mr-2">{{ EScoreText[idx] }}</span>
                <el-rate
                  disabled
                  show-score
                  :value="score"
                  score-template="{value}分"
                ></el-rate>
              </div>
            </div>
            <div class="pl-4 flex" style="color: #777777">
              <div class="mr-8">
                服务项目：{{ getServiceItemName(v.item_id) }}
              </div>
              <div class="mr-8">{{ v.city }}</div>
              <div v-if="v.comment[0]">
                {{ formatDate(v.comment[0].created, "YYYY-MM-DD HH:mm:ss") }}
              </div>
            </div>
            <div
              class="pl-4 flex flex-col space-y-4"
              v-for="(item, idx) in v.comment"
              :key="idx"
            >
              <div class="flex">
                <span class="mr-4 font-bold" style="color:#e0a11b">
                  用户评论
                </span>
                <span style="color:#969696">
                  {{ formatDate(item.created) }}
                </span>
              </div>
              <div class=" flex font-bold">{{ item.content }}</div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <el-pagination
          class="mt-4"
          :total="total"
          :current-page.sync="page"
          :page-size="pageSize"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  getBindingDevice,
  getEvaluateList,
  getTechnicianLabelList
} from "@/api/api";
import { formatDate, getServiceItemName } from "@/utils/utils";
import Vue from "vue";
import { mapState } from "vuex";
import { EScoreText } from "@/utils/enum";

export default Vue.extend({
  name: "technician-detail",
  data() {
    return {
      deviceList: [] as any[],
      labelList: [] as any[],
      evaluateList: [] as any[],
      scores: [5, 5, 5],
      user: {
        nickname: "",
        user_name: "",
        city: "",
        phone: ""
      },
      total: 0,
      page: 1,
      pageSize: 10,
      EScoreText
    };
  },
  computed: {
    ...mapState("GlobalModule", {
      userInfo: "user",
      serviceList: "serviceList"
    }),
    /**
     * 精修车型
     */
    labels(): string {
      return this.labelList
        .map(v => {
          return v.car_brand;
        })
        .join("、");
    }
  },
  watch: {
    page() {
      const { user_id } = this.$route.params;
      this.requestGetEvaluateList(+user_id);
    }
  },
  beforeMount() {
    const { user_id, user_name, nickname, city, phone } = this.$route.params;
    this.user.nickname = nickname;
    this.user.user_name = user_name;
    this.user.city = city;
    this.user.phone = phone;
    this.requestGetBindingDevice(+user_id);
    this.requestGetTechnicianLabelList(+user_id);
    this.requestGetEvaluateList(+user_id);
  },
  methods: {
    requestGetBindingDevice(user_id: number) {
      return getBindingDevice({
        user_id
      }).then(rsp => {
        this.deviceList = rsp.data;
      });
    },
    requestGetTechnicianLabelList(user_id: number) {
      return getTechnicianLabelList({
        user_id
      }).then(rsp => {
        this.labelList = rsp.data;
      });
    },
    requestGetEvaluateList(user_id: number) {
      const { page, pageSize: pagesize } = this;
      return getEvaluateList({
        b_id: this.userInfo.b_id,
        user_id,
        page,
        pagesize
      }).then(rsp => {
        this.total = +rsp.data.count;
        const scoresArr = (rsp.data.composite_score as string).split("|");
        // ! 由于老版本字段为 小数点 字符串，兼容处理
        if (scoresArr.length > 1) {
          this.scores = scoresArr.map(score => +score);
        }
        this.evaluateList = rsp.data.list.map((v: any) => {
          const scores = (v.score as string).split(",").map(score => +score);
          v.scores = scores;
          return v;
        });
      });
    },
    formatDate,
    getServiceItemName
  }
});
</script>

<style lang="less" scoped>
.card {
  @apply w-full min-h-96 p-8;
}

/deep/.rate-icon {
  @apply text-xs mr-1;
}

// element-ui
/deep/.el-rate {
  @apply flex items-center;

  &__icon {
    @apply text-xs mr-1;
  }

  &__text {
    @apply text-xs;
  }
}
</style>
