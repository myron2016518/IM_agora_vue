<template>
  <div class="border border-gray-300 border-solid">
    <iframe id="map" width="100%" height="100%" frameborder="0" :src="mapApi">
    </iframe>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "location-component",
  created() {
    window.addEventListener("message", this.onMessageCallback, false);
  },
  destroyed() {
    window.removeEventListener("message", this.onMessageCallback);
  },
  computed: {
    mapApi(): string {
      return `https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=MASBZ-2FARW-SEFRT-ORGBR-BX3NT-23FVR&referer=loc`;
    }
  },
  methods: {
    onMessageCallback(event: any) {
      // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
      const loc = event.data;
      if (loc && loc.module == "locationPicker") {
        //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        this.$emit("locationChanged", loc);
      }
    }
  }
});
</script>
<style lang="less" scoped></style>
