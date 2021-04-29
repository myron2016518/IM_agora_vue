// @ts-nocheck
/* eslint-disable */
//@ts-ignore
import Vue from "vue";
import Vuex from "vuex";

import LoginIM from "@/store/im/login";
//@ts-ignore
import Chat from "@/store/im/chat";
//@ts-ignore
import FriendModule from "@/store/im/friendModule";
//@ts-ignore
import Group from "@/store/im/group";
//@ts-ignore
import Emedia from "@/store/im/emedia";
//@ts-ignore
import Agora from "@/store/im/agora";

import { GlobalModule } from "./global";
Vue.use(Vuex);

export interface TRootState {
  GlobalModule: any;
}

export default new Vuex.Store<TRootState>({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    login: LoginIM,
    chat: Chat,
    friendModule: FriendModule,
    group: Group,
    emedia: Emedia,
    agora: Agora,
    GlobalModule,
  },
});
