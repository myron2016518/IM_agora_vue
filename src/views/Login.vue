<template>
  <div>
    <div class="login_h_1">
      <img class="login_h_2" src="@/assets/tk1.png" alt="" />
    </div>
    <div class="wrapper">
      <!-- <div class="bg-imgs">
        <img src="@/assets/login_bg_img_1.png" alt="" class="bg-img-1" />
        <img src="@/assets/login_bg_img_2.png" alt="" class="bg-img-2" />
        <img src="@/assets/login_bg_img_3.png" alt="" class="bg-img-3" />
        <img src="@/assets/login_bg_img_4.png" alt="" class="bg-img-4" />
      </div>
      <div class="login-logo">
        <img class="login-logo-img-1" src="@/assets/login_logo_1.png" alt="" />
        <img class="login-logo-img-2" src="@/assets/login_logo_2.png" alt="" />
      </div> -->
      <div class="login-logo">
        <img class="login-logo-img-1" src="@/assets/tk2.png" alt="" />
      </div>
      <div class="login-box">
        <wxLogin
          :appid="appid"
          scope="snsapi_login"
          state="STATE"
          :redirect_uri="redirectUri"
        ></wxLogin>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import wxLogin from "vue-wxlogin";
export default Vue.extend({
  name: "login",
  data() {
    return {
      // appid: process.env.VUE_APP_WX_APP_ID,
      appid: process.env.VUE_APP_WX_APP_ID_TC,
    };
  },
  created() {
    this.login();
  },
  computed: {
    redirectUri() {
      const { host } = location;
      // ! 利用bug 利用 /// 可以随意指定回调地址
      const uri = `http:///${host}/login`;
      // const uri = `https:///${host}/`;
      return encodeURIComponent(uri);
    },
  },
  components: {
    wxLogin,
  },
  methods: {
    ...mapActions("GlobalModule", ["login"]),
  },
});
</script>

<style lang="less" scoped>
.container {
  @apply items-center;
}

.wrapper {
  @apply flex flex-row justify-center items-center relative h-full;
  width: 1280px;
}

.login-logo {
  @apply relative -top-10;
  width: 740px;
  height: 468px;
}

.login-logo-img {
  &-1 {
    @apply object-contain;
    height: 468px;
  }

  &-2 {
    @apply object-contain absolute;
    width: 590px;
    height: 73px;
    top: 159px;
    left: 86px;
  }
}

.login-box {
  @apply rounded  relative ml-24 -top-10 border border-solid;
  background-color: #ececec;
  border-color: #cdcdcd;
}

.bg-imgs {
  @apply absolute bottom-0 flex items-end justify-around w-full max-w-7xl;
  height: 220px;
}

.bg-img {
  &-1 {
    @apply object-contain;
    width: 300px;
  }
  &-2 {
    @apply object-contain;
    width: 212px;
  }
  &-3 {
    @apply object-contain;
    width: 155px;
  }
  &-4 {
    @apply object-contain;
    width: 400px;
  }
}
.login_h_1 {
  width: 100%;
  flex: auto;
  background-color: #fff;
  padding: 10px 0;
  .login_h_2 {
    object-fit: contain;
    /* width: 100px; */
    padding-left: 22%;
  }
}
</style>
