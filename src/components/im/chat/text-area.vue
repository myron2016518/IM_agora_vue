<template>
  <div class="text-area">
    <textarea
      @input="onInput"
      :placeholder="placeholder"
      v-model="v"
    ></textarea>
    <span class="length" v-if="this.max > 0"
      >{{ this.length }}/{{ this.max }}</span
    >
  </div>
</template>

<script>
// @ts-nocheck
/* eslint-disable */
// @ts-ignore
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入",
    },
    max: {
      type: Number,
      default: 100,
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      v: "",
    };
  },
  created() {
    this.v = this.value;
  },
  activated() {
    this.v = this.value;
  },
  computed: {
    length() {
      return this.v.length;
    },
  },
  watch: {
    value(v) {
      this.v = v;
    },
  },
  methods: {
    onInput() {
      const length = this.v.length;
      if (this.max > 0 && length > this.max) {
        this.v = this.v.substring(0, this.max);
      }
      this.$emit("input", this.v);
    },
  },
};
</script>

<style lang="less" scoped>
.text-area {
  // background: #fbfbfb;
  height: 300px;
  textarea {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    background-color: transparent;
    font-size: 26px;
    line-height: 1.4;
    &::-webkit-input-placeholder {
      font-size: 24px;
      color: #999;
    }
    word-wrap: break-word;
    word-break: break-all;
    border: none;
    resize: none;
  }
  position: relative;
  .length {
    position: absolute;
    right: 8px;
    bottom: 6px;
    color: #999;
    font-size: 24px;
  }
}
</style>
