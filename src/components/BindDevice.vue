<template>
  <!-- 弹窗 -->
  <el-dialog title="绑定诊断盒" width="500px" :visible.sync="show">
    <div class="flex flex-col">
      <div class="flex items-center">
        <div class="w-24 mr-4 font-bold">序列号（S/N)</div>
        <div class="flex-grow">
          <el-input
            v-model="deviceForm.serialNumber"
            size="small"
            :maxlength="SN_MAX_LENGTH"
            placeholder="输入设备序列号"
          ></el-input>
        </div>
      </div>
      <div class="flex items-center mt-4">
        <div class="w-24 mr-4 font-bold">验证码（A/C)</div>
        <div class="flex-grow">
          <el-input
            v-model="deviceForm.verifyCode"
            size="small"
            :maxlength="VC_MAX_LENGTH"
            placeholder="输入设备背部二维码下方的A/C码"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="flex pl-28 mt-4">
      <el-button
        class="w-full"
        size="small"
        type="primary"
        round
        @click="handleBindDevice"
        >绑定</el-button
      >
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { bindingDevice } from "@/api/api";
import Vue from "vue";
import { mapState } from "vuex";
export default Vue.extend({
  name: "bind-device-component",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      deviceForm: {
        serialNumber: "",
        verifyCode: ""
      }
    };
  },
  computed: {
    ...mapState("GlobalModule", ["user"]),
    SN_MAX_LENGTH(): number {
      return 12;
    },
    VC_MAX_LENGTH(): number {
      return 8;
    }
  },
  watch: {
    value: {
      handler(n) {
        this.show = n;
      },
      immediate: true
    },
    show(n) {
      this.$emit("input", n);
    }
  },
  methods: {
    handleBindDevice() {
      this.requestBindDevice();
    },
    checkForm() {
      if (this.deviceForm.serialNumber.length !== this.SN_MAX_LENGTH) {
        this.$message.error("设备号输入不正确！");
        return false;
      }
      if (this.deviceForm.verifyCode.length !== this.VC_MAX_LENGTH) {
        this.$message.error("验证码输入不正确！");
        return false;
      }
      return true;
    },
    requestBindDevice() {
      if (this.checkForm()) {
        return bindingDevice({
          user_id: this.user.user_id,
          serial_number: this.deviceForm.serialNumber,
          verify_code: this.deviceForm.verifyCode
        }).then(rsp => {
          this.$message.success("绑定成功！");
          this.show = false;
          this.$emit("bindDevice", true);
        });
      }
      return Promise.reject();
    }
  }
});
</script>
