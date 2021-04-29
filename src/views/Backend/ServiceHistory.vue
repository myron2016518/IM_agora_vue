<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb class="mt-8">
      <el-breadcrumb-item>商家管理</el-breadcrumb-item>
      <el-breadcrumb-item>服务记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 服务记录 -->
    <div class="mt-4 px-8">
      <!-- 搜索条件 -->
      <!-- <div class="flex">
        <div class="flex items-center text-sm">
          <div class="flex-shrink-0">
            设备序列号：
          </div>
          <el-input
            size="small"
            v-model="serialNumber"
            placeholder="请填写设备序列号"
            clearable
          ></el-input>
        </div>
      </div> -->
      <!-- tabs -->
      <div class="flex mt-2">
        <div
          v-for="(tab, idx) in tabs"
          :key="idx"
          class="tab mr-4"
          :class="{ actived: curTabIdx === idx }"
          @click="curTabIdx = idx"
        >
          {{ tab.label }} ({{ tab.count }})
        </div>
      </div>
      <!-- 列表 -->
      <Box v-for="(v, idx) in list" :key="idx" class="mt-4">
        <template #title>
          订单号：<el-link :underline="false" @click="handleClickOrder(v)"
            >{{ v.order_id }}
          </el-link></template
        >
        <div class="flex flex-col p-4 space-y-4">
          <div class="flex space-x-4">
            <!-- 左侧 -->
            <div class="flex">
              <el-avatar
                :src="v.headimgurl"
                fit="fill"
                icon="el-icon-user-solid"
              ></el-avatar>
            </div>
            <!-- 右侧 -->
            <div class="flex flex-col justify-between">
              <div class="flex space-x-4">
                <span class="font-bold">{{ v.nickname }}</span>
                <span class="font-bold">{{ v.city }}</span>
              </div>
              <div class="text-xs">
                <span style="color:#969696">{{
                  formatDate(v.created, "YYYY-MM-DD HH:mm")
                }}</span>
              </div>
            </div>
          </div>
          <div class="flex">
            订单状态：<el-tag
              size="mini"
              effect="plain"
              :type="getOrderTagType(+v.status)"
              >{{ EOrderStatus[+v.status] }}</el-tag
            >
          </div>
          <div class="flex">服务项目：{{ v.item_name }}</div>
          <div class="flex">
            车辆：{{ v.brand }}/{{ v.models }}/{{ v.year }}
          </div>
          <div class="flex">
            {{ v.fault_description }}
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
    <!-- 任务详情 -->
    <TaskDetail
      v-model="showDrawer"
      :taskId="curTaskId"
      @change="onOrderChange"
    ></TaskDetail>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { getServiceList, EServiceStatus, TServiceStatusText } from "@/api/api";
import _ from "lodash";
import { formatDate, getServiceItemName, getOrderTagType } from "@/utils/utils";
import { EOrderStatus } from "@/utils/enum";

export default Vue.extend({
  name: "service-history",
  components: {
    Box: () => import("@/components/Box.vue"),
    TaskDetail: () => import("@/components/TaskDetail.vue")
  },
  data() {
    return {
      EserviceStatus: EServiceStatus,
      list: [] as any[],
      page: 1,
      pageSize: 6,
      curTabIdx: 0,
      showDrawer: false,
      curTaskId: 0,
      tabs: [
        { label: "全部", count: 0 },
        { label: "待支付", count: 0 },
        { label: "待诊断", count: 0 },
        { label: "待确认", count: 0 },
        { label: "退款", count: 0 },
        { label: "完成", count: 0 }
      ] as {
        label: TServiceStatusText;
        count: number;
      }[],
      serialNumber: "",
      EOrderStatus
    };
  },
  computed: {
    ...mapState("GlobalModule", ["user"]),
    total(): number {
      const { curTabIdx, tabs } = this;
      console.log("total", curTabIdx, tabs);
      return tabs[curTabIdx].count;
    }
  },
  watch: {
    curTabIdx() {
      this.fetchList();
    },
    page() {
      this.fetchList();
    }
  },
  created() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      const { page, pageSize: size, tabs, curTabIdx } = this;
      return getServiceList({
        golo_user_id: this.user.golo_user_id,
        type: EServiceStatus[tabs[curTabIdx].label],
        page,
        size
      }).then(rsp => {
        this.list = rsp.data.list;
        _.values(rsp.data.count).map((v, idx) => {
          console.log(idx, v);
          tabs[idx].count = +v;
        });
      });
    },
    handleClickOrder(item: any) {
      this.curTaskId = item.task_id;
      this.showDrawer = true;
    },
    onOrderChange() {
      this.fetchList();
    },
    formatDate,
    getServiceItemName,
    getOrderTagType
  }
});
</script>

<style lang="less" scoped></style>
