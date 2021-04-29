import { Module } from "vuex";
import { TRootState } from "../";
import router from "@/router";
import {
  getBindingDevice,
  getServiceItemList,
  getStationDevcieList,
  getUserEaseMob,
} from "@/api/api";

export enum EnumRole {
  "商家管理员" = 1,
  "商家技师" = 2,
  "普通技师" = 3,
}

export interface ServiceItem {
  item_id: string;
  item_name: string;
  item_lower_price: string;
}

export interface TGlobalModuleState {
  user: Record<string, string | number | null>;
  serviceList: ServiceItem[];
  deviceList: any[];
}

export interface IUpdateUserRoleInfoPayload {
  roleId: number;
  bId: number;
}

export const GlobalModule: Module<TGlobalModuleState, TRootState> = {
  namespaced: true,
  state: {
    user: {},
    serviceList: [],
    deviceList: [],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setUserRoleId(state, roleId) {
      state.user.role_id = roleId;
    },
    setUserBId(state, bId) {
      state.user.b_id = bId;
    },
    setServiceList(state, serviceList) {
      state.serviceList = serviceList;
    },
    setDeviceList(state, deviceList) {
      state.deviceList = deviceList;
    },
  },
  actions: {
    login({ commit, dispatch, getters, state }, user) {
      if (user) {
        commit("setUser", user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        const UserJSON = localStorage.getItem("user") as string;
        user = JSON.parse(UserJSON);
        commit("setUser", user);
      }

      // * 可能storage没有数据，进行二次判断
      if (user?.user_id) {
        if (user.hx_id.indexOf("hx") > -1) {
          //launch用户，默认密码
          dispatch(
            "onLogin",
            {
              username: user.hx_id,
              // ! 密码固定
              password: "123456",
            },
            {
              root: true,
            }
          );
          router.push({
            name: "overview",
          });
          dispatch("requestDeviceList");
        } else {
          //xx用户，需要获取密码
          getUserEaseMob(user.golo_user_id)
            .then((data: any) => {
              if (data.data && data.data.im_pwd) {
                dispatch(
                  "onLogin",
                  {
                    username: user.hx_id,
                    // ! 密码固定
                    password: data.data.im_pwd,
                  },
                  {
                    root: true,
                  }
                );
                router.push({
                  name: "overview",
                });
                dispatch("requestDeviceList");
              } else {
                console.log("获取im密码出错");
              }
            })
            .catch((err: any) => {
              console.log("获取im密码出错：", err);
            });
        }
      }
    },

    logout({ commit }) {
      commit("setUser", {});
      localStorage.removeItem("user");

      router.push({
        name: "login",
      });
    },
    initState({ dispatch }) {
      dispatch("requestGetServiceItemList");
    },
    async requestGetServiceItemList({ commit }) {
      const rsp = await getServiceItemList();
      commit("setServiceList", rsp.data);
    },
    updateUserRoleInfo({ commit }, payload: IUpdateUserRoleInfoPayload) {
      const userInfoStorage = localStorage.getItem("user") as string;
      const userInfo = JSON.parse(userInfoStorage);
      userInfo.role_id = payload.roleId;
      userInfo.b_id = payload.bId;
      localStorage.setItem("user", JSON.stringify(userInfo));
      commit("setUserRoleId", payload.roleId);
      commit("setUserBId", payload.bId);
    },
    requestDeviceList({ getters, state, commit }) {
      let rsp;
      if (getters.isBusiness) {
        rsp = getStationDevcieList({
          b_id: state.user.b_id as number,
          user_id: state.user.user_id as number,
        });
      } else {
        rsp = getBindingDevice({
          user_id: state.user.user_id as number,
        });
      }
      return rsp.then((rsp) => {
        const list = rsp.data;
        commit("setDeviceList", list);
        if (!getters.hasDevice) {
          router.push({
            name: "perfect-information",
          });
        }
      });
    },
  },
  getters: {
    isBusiness(state) {
      return state.user.role_id == EnumRole.商家管理员;
    },
    isBusinessTechnician(state) {
      return state.user.role_id == EnumRole.商家技师;
    },
    isTechnician(state) {
      return state.user.role_id == EnumRole.普通技师;
    },
    role(state) {
      return EnumRole[state.user.role_id as number];
    },
    customerRating(state) {
      const scores = state.user.composite_score
        ? (state.user.composite_score as string).split("|")
        : [5, 5, 5];
      return {
        technology: +scores[0],
        service: +scores[1],
        response: +scores[2],
      };
    },
    hasDevice(state) {
      return state.deviceList.length > 0;
    },
  },
};
