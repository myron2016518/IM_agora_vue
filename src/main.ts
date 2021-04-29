// @ts-nocheck
/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
console.log("router", router);

import store from "./store";
import "./ui";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
