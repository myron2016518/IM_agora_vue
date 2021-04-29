<template>
  <div class="rate-wrap">
    <label>{{ label }}</label>
    <v-rate
      class="rate-item"
      v-model="score"
      :readonly="readonly"
      @change="onChange"
    />
    <!-- <span>{{level}}</span> -->
  </div>
</template>
<script>
// @ts-nocheck
/* eslint-disable */
// @ts-ignore
import { Rate } from "vant";
export default {
  name: "Rate",
  props: {
    label: {
      type: [String],
      default: "",
    },
    value: {
      type: [Number],
      default: 5,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      score: this.value,
    };
  },
  computed: {
    level() {
      let txt = "好评";
      switch (this.score) {
        case 0:
          txt = "差评";
          break;
        case 1:
        case 2:
          txt = "一般";
          break;
        case 3:
        case 4:
          txt = "中评";
          break;
        case 5:
          txt = "好评";
          break;
      }
      return txt;
    },
  },
  methods: {
    onChange(val) {
      this.$emit("update:value", val);
    },
  },
  components: {
    vRate: Rate,
  },
};
</script>
<style scoped lang="less">
.rate-wrap {
  > * {
    vertical-align: middle;
  }
  label {
    padding-right: 10px;
  }
  span {
    display: inline-flex;
    padding-left: 10px;
  }
}
</style>
