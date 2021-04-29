<template>
  <div class="box">
    <div class="box-header">
      <div class="box-header-left">
        <slot name="title"></slot><template v-if="title">{{ title }}</template>
      </div>
      <div class="box-header-right">
        <slot name="href"></slot>
      </div>
    </div>
    <div class="box-main">
      <slot></slot>
    </div>
    <slot class="box-footer" name="footer"></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "box-component",
  props: {
    title: {
      type: String,
      default: ""
    }
  }
});
</script>

<style lang="less" scoped>
.box {
  @apply flex flex-col;

  &-header {
    @apply px-4 flex items-center justify-between h-8 text-sm rounded-t-lg;
    background: #d9eaf4;

    &-right {
      color: #28678d;
    }
  }

  &-main {
    @apply bg-white rounded-b-lg;
  }
}
</style>
