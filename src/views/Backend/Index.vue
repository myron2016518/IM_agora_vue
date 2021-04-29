<template>
  <div>
    <header class="header">
      <div class="header-left">
        <el-avatar
          class="mr-4 cursor-pointer"
          fit="fill"
          icon="el-icon-user-solid"
          :src="user.headimgurl"
        ></el-avatar>
        <span>星卡超级远程诊断服务中心</span>
      </div>
      <template v-if="showTabs">
        <div class="header-center">
          <router-link :to="{ name: 'contact' }">
            <div
              class="header-center__text"
              :class="{ actived: $route.name === 'contact' }"
            >
              工作台
            </div>
          </router-link>
          <router-link :to="{ name: 'overview' }">
            <div
              class="header-center__text"
              :class="{ actived: $route.name !== 'contact' }"
            >
              商家管理
            </div>
          </router-link>
        </div>
      </template>
      <div class="header-right">
        <div class="header__nickname">{{ user.nickname }}</div>
        <a class="header__logout" @click="logout">退出</a>
      </div>
    </header>
    <main class="main">
      <router-view class="application"></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "vuex";
import Vue from "vue";

export default Vue.extend({
  name: "backend",
  computed: {
    ...mapState("GlobalModule", ["user"]),
    showTabs() {
      const blackList = ["perfect-business-information", "perfect-information"];
      if (blackList.includes(this.$route.name as string)) {
        return false;
      }

      return true;
    },
  },
  data() {
    return {
      curTabIdx: 0,
    };
  },
  methods: {
    ...mapActions("GlobalModule", ["logout"]),
  },
});
</script>

<style lang="less" scoped>
.header {
  @apply flex flex-shrink-0 items-center bg-blue-700 text-white justify-between bg-cover bg-no-repeat h-16;
  background-image: url("../../assets/backend_header_bg.png");

  &__avatar {
    @apply rounded-full bg-white w-10 h-10 m-4;
  }

  &__nickname {
    @apply text-white font-bold;
  }

  &__logout {
    @apply font-bold cursor-pointer mr-10 ml-6;
    color: #0083d2;
  }
}

.header-left {
  @apply text-white flex items-center font-bold ml-4;
  width: 33%;
}

.header-center {
  @apply flex items-center bg-white rounded-full text-black border-4 border-white border-solid box-content h-10;

  &__text {
    @apply text-black flex items-center justify-center w-40;

    &.actived {
      @apply text-white rounded-full box-border h-10;
      background-color: #0083d2;
    }

    + & {
      @apply ml-4;
    }
  }
}

.header-right {
  @apply flex justify-end items-center;
  width: 33%;
}

.main {
  @apply flex-grow flex justify-center overflow-auto;
}

.application {
  @apply pb-6;
  width: 1000px;
  height: fit-content;
}
</style>
