import moment from "moment";
import store from "@/store";
import { ServiceItem } from "@/store/global";
import { EOrderStatus } from "./enum";

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 *检测是否为数组
 */
export function isArray(value: any) {
  return Object.prototype.toString.call(value) == "[object Array]";
}
/**
 *检测是否为数组
 */
export function isFunction(value: any) {
  return Object.prototype.toString.call(value) == "[object Function]";
}
/**
 *检测是否为对象
 */
export function isObject(value: any) {
  return Object.prototype.toString.call(value) == "[object Object]";
}

/**
 * 时间格式化
 * @param timestamp
 * @param format
 * @returns
 */
export function formatDate(timestamp: string, format = "YYYY-MM-DD") {
  return moment.unix(+timestamp).format(format);
}

/**
 * 获取服务列表的名称
 * @param id
 * @returns
 */
export function getServiceItemName(id: string) {
  return store.state.GlobalModule.serviceList.find((v: ServiceItem) => {
    return v.item_id === id;
  })?.item_name;
}

/**
 * 获取
 */
export function getOrderTagType(status: EOrderStatus) {
  switch (status) {
    case EOrderStatus.未开始:
    case EOrderStatus.待接单确认:
    case EOrderStatus.确认完成: {
      return "warning";
    }
    case EOrderStatus.退款中:
    case EOrderStatus.进行中: {
      return "primary";
    }
    case EOrderStatus.已完成: {
      return "success";
    }
    case EOrderStatus.已超时:
    case EOrderStatus.已失效:
    case EOrderStatus.放弃: {
      return "danger";
    }
    default: {
      return "info";
    }
  }
}
