<template>
  <el-dialog title="维修建议" width="500px" :visible.sync="show" append-to-body>
    <div class="flex flex-col">
      <el-input
        type="textarea"
        placeholder="请输入车辆维修建议（最多600字)"
        maxlength="600"
        v-model="content"
      />
    </div>

    <div class="flex mt-4">
      <el-button
        class="w-full"
        size="small"
        type="primary"
        round
        @click="handleSubmit"
        >提交</el-button
      >
    </div>
  </el-dialog>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "repair-advice",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      content: ""
    };
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
    handleSubmit() {
      this.$emit("repairSubmit", this.content);
    }
  }
});
</script>

<style lang="less" scoped></style>
