<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb class="mt-8">
      <el-breadcrumb-item>商家管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的评价</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <div class="mt-4 px-8">
      <!-- 好评信息 -->
      <div class="flex flex-col items-center">
        <!-- <div
          class="w-28 h-28 rounded-full border-solid border-4 border-white flex justify-center items-center relative text-white"
          style="background-color: #0083d2;"
        >
          <span class="relative text-2xl -top-2">95%</span>
          <span class="absolute text-xs bottom-6">好评率</span>
        </div> -->
        <div class="flex">
          <div class="flex items-center mt-4">
            <div class="flex items-center mr-8">
              <span class="mr-2">技术能力</span>
              <el-rate
                disabled
                show-score
                :value="customerRating.technology"
                score-template="{value}分"
              ></el-rate>
            </div>
            <div class="flex items-center mr-8">
              <span class="mr-2">服务态度</span>
              <el-rate
                disabled
                show-score
                :value="customerRating.service"
                score-template="{value}分"
              ></el-rate>
            </div>
            <div class="flex items-center">
              <span class="mr-2">响应速度</span>
              <el-rate
                disabled
                show-score
                :value="customerRating.response"
                score-template="{value}分"
              ></el-rate>
            </div>
          </div>
        </div>
      </div>
      <!-- 评论tabs  -->
      <!-- <div class="flex mt-4 px-2">
        <div
          v-for="(tab, idx) in tabs"
          :key="tab"
          class="tab mr-4"
          :class="{ actived: curTabIdx === idx }"
          @click="curTabIdx = idx"
        >
          {{ tab }} (0)
        </div>
      </div> -->
      <!-- 评价列表 -->
      <Box v-for="(v, idx) in list" :key="idx" class="mt-4">
        <template #title>订单号：{{ v.order_id }}</template>
        <div class="p-4 flex">
          <!-- 左侧 -->
          <div class="mr-4">
            <el-avatar
              :src="v.headimgurl"
              fit="fill"
              icon="el-icon-user-solid"
            ></el-avatar>
          </div>
          <!-- 右侧 -->
          <div class="flex-grow flex flex-col">
            <div class="flex">
              <span class="mr-4 font-bold">{{ v.nickname }}</span>
              <span class="font-bold">{{ v.city }}</span>
            </div>
            <div class="mt-4 flex">
              服务项目：{{ getServiceItemName(v.item_id) }}
            </div>
            <div class="mt-4 flex">服务技师：{{ v.name }}</div>
            <div class="mt-4 flex">
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
            <div
              class="mt-4 flex flex-col"
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
              <div class="mt-4 flex font-bold">{{ item.content }}</div>
            </div>
          </div>
        </div>
      </Box>
      <!-- 分页 -->
      <el-pagination
        class="mt-4"
        :total="total"
        :current-page.sync="page"
        :page-size="pageSize"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getEvaluateList, GetEvaluateListParams } from "@/api/api";
import { mapState, mapGetters } from "vuex";
import { formatDate, getServiceItemName } from "@/utils/utils";
import { EScoreText } from "@/utils/enum";

export default Vue.extend({
  name: "praised-me",
  components: {
    Box: () => import("@/components/Box.vue")
  },
  data() {
    return {
      curTabIdx: 0,
      tabs: ["好评", "中评", "一般", "差评"],
      list: [] as any[],
      page: 1,
      pageSize: 10,
      total: 0,
      EScoreText
    };
  },
  watch: {
    page() {
      this.requestList();
    }
  },
  computed: {
    ...mapState("GlobalModule", ["user", "serviceList"]),
    ...mapGetters("GlobalModule", ["customerRating", "isTechnician"])
  },
  beforeMount() {
    this.requestList();
  },
  methods: {
    requestList() {
      const { page, pageSize: pagesize } = this;
      const params = {
        page,
        pagesize
      } as GetEvaluateListParams;
      
      if (this.isTechnician) {
        params.user_id = this.user.user_id;
      } else {
        params.b_id = this.user.b_id;
      }

      return getEvaluateList(params).then(rsp => {
        this.total = +rsp.data.count;
        this.list = rsp.data.list.map((v: any) => {
          v.scores = (v.score as string).split(",").map(score => +score);
          return v;
        });
      });
    },
    formatDate,
    getServiceItemName
  }
});
</script>

<style lang="less" scoped></style>
