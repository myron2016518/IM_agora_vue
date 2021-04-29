<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb class="mt-8">
      <el-breadcrumb-item>商家管理</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <div class="mt-4 px-8">
      <!-- 搜索条件 -->
      <div class="flex mb-4 space-x-4">
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
        <div class="flex">
          <el-button type="primary" size="small" @click="show = true" round
            >绑定设备</el-button
          >
        </div>
      </div>
      <!-- 列表 -->
      <el-table
        v-loading="listLoading"
        size="small"
        :data="filterList"
        header-row-class-name="table-header-row"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serial_number"
          label="设备SN"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="nickname"
          label="昵称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="绑定手机"
          align="center"
        ></el-table-column>
        <el-table-column prop="created" label="绑定时间" align="center">
          <template slot-scope="scope">
            {{ formatDate(scope.row.created) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-popconfirm
              title="确定解除绑定设备？"
              @confirm="requestUnbindDevice(scope.row.serial_number)"
            >
              <a class="table__button" slot="reference">解绑</a>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 绑定弹窗 -->
    <bind-device v-model="show" @bindDevice="onBindDevice"></bind-device>
  </div>
</template>

<script lang="ts">
import { unbindDevice } from "@/api/api";
import Vue from "vue";
import { mapState, mapGetters, mapActions } from "vuex";
import { formatDate } from "@/utils/utils";

export default Vue.extend({
  name: "device-management",
  data() {
    return {
      show: false,
      serialNumber: "",
      listLoading: false
    };
  },
  components: {
    "bind-device": () => import("@/components/BindDevice.vue")
  },
  computed: {
    ...mapState("GlobalModule", ["user", "deviceList"]),
    ...mapGetters("GlobalModule", ["isBusiness"]),
    filterList(): any[] {
      return this.deviceList.filter((v: any) => {
        return (v.serial_number as string).search(this.serialNumber) > -1;
      });
    }
  },
  beforeMount() {
    this.requestList();
  },
  methods: {
    ...mapActions("GlobalModule", ["requestDeviceList"]),
    requestUnbindDevice(serialNumber: string) {
      return unbindDevice({
        user_id: this.user.user_id,
        serial_number: serialNumber
      })
        .then(rsp => {
          this.$message.success("解绑成功");
        })
        .finally(() => {
          this.requestList();
        });
    },
    requestList() {
      this.listLoading = true;
      return this.requestDeviceList().finally(() => {
        this.listLoading = false;
      });
    },
    onBindDevice() {
      this.requestList();
    },
    formatDate
  }
});
</script>

<style lang="less" scoped></style>
