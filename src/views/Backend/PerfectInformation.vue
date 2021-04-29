<template>
  <div>
    <div class="flex mt-8 h-60">
      <div
        class="w-60 rounded-l-lg relative flex text-white items-center justify-center"
        style="background-color: #3090C8"
      >
        <!-- <img src="@/assets/perfect_bg.png" alt="" class="h-60 absolute" /> -->
        <div class="absolute text-xs right-4 top-4">
          完善进度{{ processing }}
        </div>
        <div class="absolute text-xl">完善信息</div>
        <!-- <div class="absolute text-xs bottom-16">激活商家</div> -->
      </div>
      <div
        class="flex flex-col flex-grow bg-white rounded-r-lg px-8 divide-y divide-solid divide-gray-300"
      >
        <div class="flex-grow flex justify-between items-center px-2">
          <div class="flex flex-col">
            <span class="font-bold text-base">绑定设备</span>
            <span class="text-sm text-gray-600 mt-2">绑定设备</span>
          </div>
          <div>
            <template v-if="hasDevice && false">
              <span class="text-xs mr-4">已绑定</span>
            </template>
            <template v-else>
              <el-button round size="small" @click="showDialog = true"
                >绑定设备</el-button
              >
            </template>
          </div>
        </div>
        <!-- <div class="flex-grow flex justify-between items-center px-2">
          <div class="flex flex-col">
            <span class="font-bold text-base">完善商家信息</span>
            <span class="text-sm text-gray-600 mt-2"
              >完善商家信息，提高商家信任度</span
            >
          </div>
          <div>
            <el-button round size="small">完善信息</el-button>
          </div>
        </div> -->
      </div>
    </div>
    <!-- 绑定弹窗 -->
    <bind-device v-model="showDialog" @bindDevice="onBindDevice"></bind-device>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default Vue.extend({
  name: "perfect-information",
  components: {
    "bind-device": () => import("@/components/BindDevice.vue")
  },
  data() {
    return {
      isPerfect: false,
      showDialog: false,
      deviceForm: {
        serialNumber: "",
        verifyCode: ""
      }
    };
  },
  computed: {
    ...mapState("GlobalModule", ["user"]),
    ...mapGetters("GlobalModule", ["hasDevice"]),
    processing(): string {
      let n = 0;
      if (this.hasDevice) n++;
      if (this.isPerfect) n++;
      return `${n}/${this.MAX_PROCESSING_COUNT}`;
    },
    MAX_PROCESSING_COUNT(): number {
      return 1;
    }
  },
  watch: {
    hasDevice(n, o) {
      if (n) {
        this.$router.replace({
          name: "overview"
        });
      }
    }
  },
  beforeMount() {
    this.requestDeviceList();
  },
  methods: {
    ...mapActions("GlobalModule", ["requestDeviceList"]),
    onBindDevice() {
      this.requestDeviceList();
    }
  }
});
</script>

<style lang="less" scoped></style>
