<template>
  <div id="app">
    <router-view class="container"></router-view>
    <el-dialog title="绑定信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="numberValidateForm"
        ref="numberValidateForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="电话"
          prop="phone"
          :rules="[
            { required: true, message: '电话不能为空' },
            { type: 'number', message: '电话必须为数字值' },
          ]"
        >
          <el-input
            type="tel"
            v-model.number="numberValidateForm.phone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('numberValidateForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('numberValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { getUserInfo, boundPhone } from "@/api/api";
import { mapActions } from "vuex";
import { Form } from "element-ui";

export default Vue.extend({
  name: "App",
  data() {
    return {
      dialogFormVisible: false,
      numberValidateForm: {
        phone: "",
      },
      openid: "",
    };
  },
  created() {
    this.initState();
  },
  beforeMount() {
    if (this.$route.query.code) {
      // this.requestUserInfo(this.$route.query.code as string).then(rsp => {
      //   const userInfo = rsp.data;
      //   this.login(userInfo);
      // });

      this.requestUserInfo(this.$route.query.code as string).then((rsp) => {
        const userInfo = rsp.data;
        console.log("===requestUserInfo====", userInfo);
        if (userInfo?.user_id) {
          this.login(userInfo);
        } else {
          console.log("===nouser====", userInfo);
          this.dialogFormVisible = true;
          this.openid = userInfo.weixin_openid;
        }
      });
    }
  },
  methods: {
    ...mapActions("GlobalModule", ["login", "initState"]),
    requestUserInfo(code: string) {
      return getUserInfo({
        code,
      });
    },
    submitForm(formName: string) {
      (this.$refs[formName] as Form).validate((valid: any) => {
        if (valid) {
          console.log("===this.openid====", this.openid);
          this.requestBoundPhone(
            this.openid as string,
            this.numberValidateForm.phone as string
          ).then((rsp) => {
            const userInfo = rsp.data;
            console.log("===requestBoundPhone====", userInfo);
            if (userInfo?.user_id) {
              this.login(userInfo);
              this.dialogFormVisible = false;
            } else {
              console.log("===nouser====", userInfo);
              // this.dialogFormVisible = true;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName: string) {
      (this.$refs[formName] as Form).resetFields();
    },
    requestBoundPhone(code: string, phone: string) {
      return boundPhone({
        phone: phone || "",
        openid: code || "",
      });
    },
  },
});
</script>

<style lang="less">
// * base
// @tailwind base;
@import "~@/less/reset.less";
@import "~@/less/base.less";

// * components
// @tailwind components;
// ! 自定义组件样式这里引入
// * 尽可能使用 @apply
@import "~@/less/custom-components.less";

// * utilities
// * 需要扩展功能，在 tailwind.config.js 添加
@tailwind utilities;
</style>
