<template>
  <div>
    <!-- 功能按钮 -->
    <div class="flex justify-around mt-6">
      <div class="card" @click="$router.push({ name: 'my-income' })">
        <img
          src="@/assets/overview_icon_1.png"
          alt=""
          class="card-icon card-icon__1"
        />
        <div class="card-text">我的收入</div>
      </div>
      <div class="card" @click="$router.push({ name: 'device-management' })">
        <img
          src="@/assets/overview_icon_2.png"
          alt=""
          class="card-icon card-icon__2"
        />
        <div class="card-text">设备管理</div>
      </div>
      <div
        class="card"
        @click="checkAuth({ to: { name: 'technician-management' } })"
      >
        <img
          src="@/assets/overview_icon_3.png"
          alt=""
          class="card-icon card-icon__3"
        />
        <div class="card-text">技师管理</div>
        <div class="absolute right-2 top-2 text-xs text-red-600">商家功能</div>
      </div>
      <div
        class="card"
        @click="checkAuth({ to: { name: 'business-information' } })"
      >
        <img
          src="@/assets/overview_icon_4.png"
          alt=""
          class="card-icon card-icon__4"
        />
        <div class="card-text">商家信息</div>
        <div class="absolute right-2 top-2 text-xs text-red-600">商家功能</div>
      </div>
    </div>
    <!-- 图表列表 -->
    <div class="flex mt-6">
      <!-- 左侧 -->
      <div class="flex flex-col flex-grow">
        <Box title="服务记录">
          <template #href
            ><router-link :to="{ name: 'service-history' }"
              >详情</router-link
            ></template
          >
          <div class="h-60 flex flex-col">
            <!-- 图表条件选择器 -->
            <div class="h-10 flex items-center px-6">
              <el-date-picker
                v-model="date"
                size="mini"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleDatePicker"
              ></el-date-picker>
            </div>
            <!-- 图表 -->
            <div ref="chart1" class="flex-grow"></div>
          </div>
        </Box>
        <Box class="mt-6" title="历史记录">
          <div class="min-h-60 flex">
            <el-table
              size="small"
              :data="filterRecordList"
              class="flex-grow"
              header-row-class-name="table-header-row"
              header-cell-class-name="table-header-cell"
            >
              <el-table-column
                prop="date"
                label="日期"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="total"
                label="接单总数"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="nickname"
                label="技师"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
          <template #footer>
            <el-pagination
              class="mt-4"
              :total="recordTotal"
              :current-page.sync="page"
              :page-size="pageSize"
            ></el-pagination>
          </template>
        </Box>
      </div>
      <!-- 右侧 -->
      <div class="flex flex-col w-64 ml-6 flex-shrink-0">
        <Box title="好评率">
          <template #href
            ><router-link :to="{ name: 'praised-me' }"
              >明细</router-link
            ></template
          >
          <div class="h-48 flex flex-col justify-center items-center">
            <div class="flex items-center">
              <span class="mr-2">技术能力</span>
              <el-rate
                disabled
                show-score
                :value="customerRating.technology"
                score-template="{value}分"
              ></el-rate>
            </div>
            <div class="flex items-center mt-4">
              <span class="mr-2">服务态度</span>
              <el-rate
                disabled
                show-score
                :value="customerRating.service"
                score-template="{value}分"
              ></el-rate>
            </div>
            <div class="flex items-center mt-4">
              <span class="mr-2">响应速度</span>
              <el-rate
                disabled
                show-score
                :value="customerRating.response"
                score-template="{value}分"
              ></el-rate>
            </div>
          </div>
        </Box>
        <Box class="mt-6" title="完成车辆品牌/功能TOP10">
          <div class="min-h-96 overflow-auto">
            <el-table
              size="small"
              :data="rankingList"
              class="flex-grow"
              header-row-class-name="table-header-row"
              header-cell-class-name="table-header-cell"
            >
              <el-table-column width="40px">
                <template slot-scope="scope">
                  <div
                    class="border border-solid rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    style="background:#f3f3f3;border-color:#b8b8b8"
                  >
                    {{ scope.$index + 1 }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="brand"
                label="品牌"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="item"
                label="功能"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
        </Box>
      </div>
    </div>
    <!-- 引导商家弹窗 -->
    <el-dialog
      :visible.sync="showDialog"
      width="500px"
      title="完善商家信息 ,激活商家功能"
    >
      <div class="flex flex-col">
        <div>
          商家功能适用于多技师团队，管理员将会有更多的管理权限，如商家技师管理、在线服务收入管理、商家信息维护等。
        </div>
        <div class="mt-4">
          <el-button
            class="w-full"
            size="small"
            round
            type="primary"
            @click="$router.push({ name: 'perfect-business-information' })"
            >完善商家</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RawLocation } from "vue-router";
import * as echarts from "echarts";
import { mapGetters, mapState } from "vuex";
import { getAcceptRecordCount, getTop10Data } from "@/api/api";
import moment from "moment";

export default Vue.extend({
  name: "overview",
  components: {
    Box: () => import("@/components/Box.vue")
  },
  data() {
    return {
      date: [] as Date[],
      charts: [] as echarts.ECharts[],
      chartList: {} as Record<string, number>,
      recordList: [] as any[],
      page: 1,
      pageSize: 6,
      showDialog: false,
      top10BrandList: [] as any[],
      top10ItemList: [] as any[]
    };
  },
  computed: {
    ...mapState("GlobalModule", ["user"]),
    ...mapGetters("GlobalModule", ["isTechnician", "customerRating"]),
    recordTotal(): number {
      return this.recordList.length;
    },
    filterRecordList(): any[] {
      return this.recordList.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page
      );
    },
    rankingList(): any[] {
      const list = [] as any[];
      let idx = 0;
      while (this.top10BrandList[idx] || this.top10ItemList[idx]) {
        list.push({
          brand: this.top10BrandList[idx] ? this.top10BrandList[idx].brand : "",
          item: this.top10ItemList[idx] ? this.top10ItemList[idx].item_name : ""
        });
        idx++;
      }
      return list;
    }
  },
  mounted() {
    this.initData();

    this.requestAcceptRecord().then(() => {
      this.$nextTick(() => {
        this.initCharts();
      });
    });
    this.requestTop10();
  },
  destroyed() {
    this.disposeCharts();
  },
  methods: {
    initData() {
      this.date[0] = moment()
        .subtract(7, "d")
        .startOf("day")
        .toDate();
      this.date[1] = moment()
        .endOf("day")
        .toDate();
    },
    initCharts() {
      console.group("initCharts");
      // chart1
      const elChart1 = this.$refs.chart1 as HTMLElement;
      console.log("el", elChart1);
      const chart1 = echarts.init(elChart1);
      chart1.setOption({
        grid: {
          containLabel: true,
          left: "16px",
          right: "16px",
          top: "16px",
          bottom: "16px"
        },
        xAxis: this.createChartXAxis(),
        yAxis: {
          type: "value",
          minInterval: 1
        },
        tooltip: {
          trigger: "axis",
          padding: 0,
          borderWidth: 0,
          formatter: (params: any[]) => {
            return `<div class="chart-tooltip">${params[0].axisValue}<br/>接单数量：${params[0].value}</div>`;
          }
        },
        series: this.createChartSeries()
      });
      this.charts.push(chart1);

      // chart2
      // const elChart2 = this.$refs.chart2 as HTMLElement;
      // const chart2 = echarts.init(elChart2);
      // chart2.setOption({
      //   legend: {
      //     bottom: "6px",
      //     left: "center",
      //     icon: "circle"
      //   },
      //   series: [
      //     {
      //       name: "访问来源",
      //       type: "pie",
      //       bottom: 20,
      //       radius: ["40%", "70%"],
      //       avoidLabelOverlap: false,
      //       label: {
      //         show: false,
      //         position: "center"
      //       },
      //       emphasis: {
      //         label: {
      //           show: true,
      //           fontSize: "12",
      //           fontWeight: "bold",
      //           formatter: (params: any) => {
      //             return `${params.name}\n${params.value}`;
      //           }
      //         }
      //       },
      //       labelLine: {
      //         show: false
      //       },
      //       data: [
      //         { value: 1048, name: "好评" },
      //         { value: 735, name: "一般" },
      //         { value: 580, name: "中评" },
      //         { value: 484, name: "差评" }
      //       ]
      //     }
      //   ]
      // });
      // this.charts.push(chart2);
      console.groupEnd();
    },
    handleDatePicker() {
      this.requestAcceptRecord().then(() => {
        this.redrawChart();
      });
    },
    createChartXAxis() {
      return {
        type: "category",
        boundaryGap: false,
        data: Object.keys(this.chartList),
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      };
    },
    createChartSeries() {
      return [
        {
          data: Object.values(this.chartList),
          type: "line",
          symbolSize: 18,
          showSymbol: false,
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#8ED0F1" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ];
    },
    redrawChart() {
      this.charts[0].setOption({
        xAxis: this.createChartXAxis(),
        series: this.createChartSeries()
      });
    },
    checkAuth(options: { to?: RawLocation }) {
      console.log("checkAuth", this.isTechnician, options);
      if (this.isTechnician) {
        this.showDialog = true;
        return false;
      }

      if (options.to) {
        this.$router.push(options.to);
      }
    },
    disposeCharts() {
      let chart: echarts.ECharts;
      while ((chart = this.charts.pop() as echarts.ECharts)) {
        chart.dispose();
      }
    },
    requestAcceptRecord() {
      return getAcceptRecordCount({
        user_id: this.user.user_id,
        start_date: moment(this.date[0]).format("YYYY-MM-DD"),
        end_date: moment(this.date[1]).format("YYYY-MM-DD")
      }).then(rsp => {
        this.chartList = rsp.data.accept_count;
        // ! 接口返回null，则引发页面功能失效
        this.recordList = rsp.data.detail_accept_count ?? [];
      });
    },
    requestTop10() {
      return getTop10Data({
        user_id: this.user.user_id
      }).then(rsp => {
        this.top10BrandList = rsp.data.brand_list;
        this.top10ItemList = rsp.data.item_list;
      });
    }
  }
});
</script>

<style lang="less" scoped>
.card {
  @apply items-center justify-center cursor-pointer w-52 h-32;

  &-icon {
    @apply object-contain relative;
    top: -8px;

    &__1 {
      width: 30px;
    }
    &__2 {
      width: 42px;
    }
    &__3 {
      width: 40px;
    }
    &__4 {
      width: 45px;
    }
  }

  &-text {
    @apply absolute bottom-4 font-bold;
  }
}

/deep/.chart-tooltip {
  @apply rounded text-xs p-2 border border-solid;
  border-color: #0184d2;
  color: #0184d2;
  background: #dbedf9;
}
</style>
