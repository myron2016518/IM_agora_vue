// @ts-nocheck
import Vue from "vue";
import vant, { Toast } from "vant";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "vant/lib/icon/index.css";
import "vant/lib/index.css";

import { transferStatus } from "@/utils/im/public";

// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// Vue.use(ElementUI).use(vant);
Vue.use(vant);
Vue.use(Antd);
Vue.prototype.$showLoading = Toast.bind(Toast, {
  type: "loading",
  message: "加载中...",
  forbidClick: true,
  loadingType: "spinner",
  duration: 0,
});
Vue.prototype.$hideLoading = Toast.clear.bind(Toast);
import {
  DatePicker,
  Table,
  TableColumn,
  Pagination,
  Breadcrumb,
  BreadcrumbItem,
  Rate,
  Select,
  Option,
  Input,
  InputNumber,
  Button,
  Avatar,
  Message,
  Loading,
  Popconfirm,
  Popover,
  Tooltip,
  Dialog,
  Drawer,
  Tag,
  Link,
  Form,
  FormItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "element-ui";

Vue.prototype.$message = Message;
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Link);
Vue.use(Tooltip);
Vue.use(Popover);
Vue.use(Popconfirm);
Vue.use(Loading);
Vue.use(Avatar);
Vue.use(Button);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Option);
Vue.use(Rate);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(DatePicker);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Drawer);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);

// 格式化时间，入参为时间戳秒
Vue.filter("format", function(timestamp, formatString) {
  return format.call(new Date(timestamp * 1000), formatString);
});
// 任务状态格式化
Vue.filter("transferStatus", transferStatus);

// 过滤x5 x10  98883 x5  98887 x10
Vue.filter("getSnTxt", function(_str) {
  let _txt = "";
  if (_str) {
    _str.indexOf("98883") != -1 && (_txt = "x5");
    _str.indexOf("98887") != -1 && (_txt = "x10");
    // _str.indexOf("98957") != -1 && (_txt = "x11");
    // _str.indexOf("98956") != -1 && (_txt = "x12");
  }
  return _txt;
});
