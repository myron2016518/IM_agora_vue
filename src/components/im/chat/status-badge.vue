<template>
  <span class="badge" :class="getClass">
    {{ taskStatus | transferStatus }}
  </span>
</template>
<script>
// @ts-nocheck
/* eslint-disable */
// @ts-ignore
export default {
  name: "StatusBadge",
  props: {
    status: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      taskStatus: this.status,
    };
  },
  computed: {
    getClass() {
      let className = "";
      switch (parseInt(this.taskStatus)) {
        case 1:
        case 7:
        case 8:
          className = "warning";
          break;
        case 2:
        case 9:
          className = "danger";
          break;
        case 4:
          className = "success";
          break;
        default:
          className = "cancel";
      }
      return className;
    },
  },
  watch: {
    status: function(newValue, oldVal) {
      this.taskStatus = newValue;
    },
  },
  methods: {
    back() {
      if (!this.noBack && !this.handleBackOut) {
        this.$router.back();
      }
      this.$emit("back");
    },
  },
};
</script>
<style scoped lang="less">
// 主色
@color-primary: #007cc3;
.badge {
  display: inline-block;
  padding: 0 5px;
  text-align: center;
  color: #fff;
  background-color: @color-primary;
  border-radius: 4px;
  line-height: 24px;
  &.cancel {
    background-color: #c6c6c6;
  }
  &.warning {
    background-color: #007ac3;
  }
  &.danger {
    background-color: #ffbc00;
  }
  &.success {
    background-color: #00ce65;
  }
}
</style>
