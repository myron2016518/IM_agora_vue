import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Backend from "@/views/Backend/Index.vue";
import Login from "@/views/Login.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    redirect: {
      name: "login"
    },
    name: "index",
    component: Backend,
    children: [
      {
        path: "/overview",
        name: "overview",
        component: () => import("@/views/Backend/Overview.vue")
      },
      {
        path: "/technician-management",
        name: "technician-management",
        component: () => import("@/views/Backend/TechnicianManagement.vue")
      },
      {
        path: "/technician-detail",
        name: "technician-detail",
        component: () => import("@/views/Backend/TechnicianDetail.vue")
      },
      {
        path: "/device-management",
        name: "device-management",
        component: () => import("@/views/Backend/DeviceManagement.vue")
      },
      {
        path: "/business-information",
        name: "business-information",
        component: () => import("@/views/Backend/BusinessInformation.vue")
      },
      {
        path: "/my-income",
        name: "my-income",
        component: () => import("@/views/Backend/MyIncome.vue")
      },
      {
        path: "/praised-me",
        name: "praised-me",
        component: () => import("@/views/Backend/PraisedMe.vue")
      },
      {
        path: "/perfect-information",
        name: "perfect-information",
        component: () => import("@/views/Backend/PerfectInformation.vue")
      },
      // {
      //   path: "/workbench",
      //   name: "workbench",
      //   component: () => import("@/views/Backend/Workbench.vue")
      // },
      {
        path: "/perfect-business-information",
        name: "perfect-business-information",
        component: () =>
          import("@/views/Backend/PerfectBusinessInformation.vue")
      },
      {
        path: "/service-history",
        name: "service-history",
        component: () =>
          import("@/views/Backend/ServiceHistory.vue")
      },
      {
        path: "/contact",
        name: "contact",
        component: () => import("@/views/Backend/Workbench.vue")
      }
    ]
  },
  {
    path: "*",
    redirect: {
      name: "login"
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  // 验权操作
  if (to.name !== "login") {
    if (store.state.GlobalModule.user.user_id) {
      next();
    } else {
      next({
        name: "login"
      });
    }
  } else {
    if (store.state.GlobalModule.user.user_id) {
      store.state.GlobalModule.dispatch();
    }
    next();
  }
});

export default router;
