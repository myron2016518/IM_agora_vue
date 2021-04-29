import { EOrderStatus } from "@/utils/enum";
import { http } from "./";

interface GetUserInfoParams {
  code: string;
}

/**
 * 获取用户信息
 */
export function getUserInfo(params: GetUserInfoParams) {
  // return http.get("/SmartLink/User/weixin_pc_login", {
  //   params,
  // });
  return http.post("/Systemus/api/socials/wechat/authorizations", params);
}
/**
 * 绑定手机号
 */
export function boundPhone(params: any) {
  return http.post("/Systemus/api/bound-phone", params);
}

// 获取token
export function getToken(params: any) {
  return http.get(`/TC/php/sample/RtmTokenBuilderSample.php`, { params });
}
export function rtcTokenBuilderClient(uid: any, channelName: any) {
  return http.get("/TC/php/sample/RtcTokenBuilderClient.php", {
    params: {
      user_id: uid,
      channelName,
    },
  });
}

// 根据cc号获取xx那边的im用户信息
export function getUserEaseMob(cc: any) {
  return http.get("/tc_api/api/v2/getUserEaseMob", {
    baseURL: "",
    params: {
      cc,
    },
  });
}
/**
 * im 根据im账号获取用户信息
 */
export function getIMUserInfo(params: any) {
  return http.get("/SmartLink/User/getUserInfoByHxId", {
    params,
  });
}
/**
 * 用户查询任务列表（需求广场调用）
 */
export function getBusTaskList(params: any) {
  return http.get("/SmartLink/Task/get_business_task_list", {
    params,
  });
}
// /**
//  *  获取指定给我的任务列表（B用户调用）
//  */
// export function getHistoryTaskList(params: any) {
//   return http.get("/SmartLink/Task/get_selected_task_list", {
//     params,
//   });
// }
/**
 *   B用户查询历史任务列表（我服务的）
 */
export function getHistoryTaskList(params: any) {
  return http.get("/SmartLink/Task/get_history_task_list", {
    params,
  });
}
/**
 * 获取今日流水和未支付金额
 */
export function getTodayFlow(params: any) {
  return http.get("/SmartLink/User/getTodayFlow", {
    params,
  });
}
// 获取绑定的设备列表
export function getDeviceList(deviceType = 0) {
  let UserJSON = localStorage.getItem("user") as any;
  UserJSON && (UserJSON = JSON.parse(UserJSON));
  return http.get("/SmartLink/Device/get_binding_device", {
    params: {
      device_type: deviceType,
      user_id: UserJSON.user_id,
    },
  });
}
// 获取空闲B端设备列表
export function getFreeDevice(deviceType = 0) {
  let UserJSON = localStorage.getItem("user") as any;
  UserJSON && (UserJSON = JSON.parse(UserJSON));
  return http.get("/SmartLink/User/getFreeDevice", {
    params: {
      user_id: UserJSON.user_id,
    },
  });
}
// 商家发起订单
export function bsReleaseTask(params: any) {
  let UserJSON = localStorage.getItem("user") as any;
  UserJSON && (UserJSON = JSON.parse(UserJSON));
  params.user_id = UserJSON.user_id;
  params.golo_user_id = UserJSON.golo_user_id;
  return http.post("/SmartLink/Task/bs_release_task", params);
}
// 用户查询订单详情
export function imGetTaskDetail(params: any) {
  let UserJSON = localStorage.getItem("user") as any;
  UserJSON && (UserJSON = JSON.parse(UserJSON));
  params.user_id = UserJSON.user_id;
  return http.get("/SmartLink/Task/im_get_task_detail", {
    params,
  });
}
// B用户IM修改订单
export function imEditTask(params: any) {
  let UserJSON = localStorage.getItem("user") as any;
  UserJSON && (UserJSON = JSON.parse(UserJSON));
  params.user_id = UserJSON.user_id;
  params.golo_user_id = UserJSON.golo_user_id;
  return http.post("/SmartLink/Task/im_edit_task", params);
}
// 修改任务状态
export function imModifyTask(params: any) {
  let UserJSON = localStorage.getItem("user") as any;
  UserJSON && (UserJSON = JSON.parse(UserJSON));
  params.user_id = UserJSON.user_id;
  params.golo_user_id = UserJSON.golo_user_id;
  return http.post("/SmartLink/Task/im_modify_task", params);
}

// 获得车辆：品牌、车型、年款、排量等信息Api
export function getCarInfoOptions(params: any) {
  let UserJSON = localStorage.getItem("user") as any;
  UserJSON && (UserJSON = JSON.parse(UserJSON));
  params.user_id = UserJSON.user_id;
  return http.get("/SmartLink/Task/get_car_info_options", {
    params,
  });
}

// 通过im获取用户信息及设备
export function getUserInfoByHxId(params: any) {
  let UserJSON = localStorage.getItem("user") as any;
  UserJSON && (UserJSON = JSON.parse(UserJSON));
  params.user_id = UserJSON.user_id;
  return http.get("/SmartLink/Task/get_user_info_by_hx_id", {
    params,
  });
}
interface GetMyTechnicianListParams {
  user_id: number;
}

/**
 * 技师列表
 */
export function getMyTechnicianList(params: GetMyTechnicianListParams) {
  return http.get("/SmartLink/User/getMytechnicianList", {
    params,
  });
}

/**
 * 获取服务项目列表
 */
export function getServiceItemList() {
  return http.get("/SmartLink/Task/getSerivceItemList");
}

/**
 * 设备类型
 */
const enum EnumDeviceType {
  全部,
  C端,
  B端,
}

interface GetBindingDeviceParams {
  user_id: number;
  device_type?: EnumDeviceType;
}

/**
 * 获取绑定的B端设备列表
 */
export function getBindingDevice(params: GetBindingDeviceParams) {
  params.device_type = EnumDeviceType.B端;
  return http.get("/SmartLink/Device/get_binding_device", {
    params,
  });
}

interface GetStationDevcieListParams {
  user_id?: number;
  b_id?: number;
  device_type?: EnumDeviceType;
}

/**
 * 获取商家设备列表
 * @param params
 * @returns
 */
export function getStationDevcieList(params: GetStationDevcieListParams) {
  params.device_type = EnumDeviceType.B端;
  return http.get("/SmartLink/User/getStationDevcieList", {
    params,
  });
}

interface BindingDeviceParams {
  serial_number: string;
  verify_code: string;
  user_id: number;
}

/**
 * 绑定设备
 */
export function bindingDevice(params: BindingDeviceParams) {
  return http.get("/SmartLink/Device/binding_device", {
    params,
  });
}

interface UnbindDeviceParams {
  user_id: number;
  serial_number: string;
  type?: string;
}

/**
 * 设备解绑
 */
export function unbindDevice(params: UnbindDeviceParams) {
  params.type = "wx";
  return http.get("/SmartLink/Device/unbind_device", {
    params,
  });
}

interface DelShopTechnicianParams {
  user_id: number;
  del_user_id: number;
}

/**
 * 删除商家技师
 */
export function delShopTechnician(params: DelShopTechnicianParams) {
  return http.get("/SmartLink/User/delShopTechnician", {
    params,
  });
}

interface MyIncomeParams {
  user_id: number;
  s_user_id: number;
}

/**
 * 我的收入（含列表）
 */
export function myIncome(params: MyIncomeParams) {
  return http.get("/SmartLink/User/myIncome", {
    params,
  });
}

interface WithdrawRecordParams {
  user_id: number;
}

/**
 * 提现记录
 */
export function withdrawRecord(params: WithdrawRecordParams) {
  return http.get("/SmartLink/User/withdrawRecord", {
    params,
  });
}

interface GetShopDetailParams {
  golo_user_id?: number;
  b_id: number;
}

/**
 * 获取商家详情
 */
export function getShopDetail(params: GetShopDetailParams) {
  return http.get("/SmartLink/Shop/getShopDetail", {
    params,
  });
}

interface EditBusinessInfoParams {
  user_id: number;
  golo_user_id?: number;
  b_id: number;
  name: string;
  logo_url: string;
  shop_type: number;
  lon: number;
  lat: number;
  address: string;
  desc: string;
  contact_phone?: string;
  head_person?: string;
  opening_hours?: string;
}

/**
 * 编辑商家信息
 */
export function editBusinessInfo(params: EditBusinessInfoParams) {
  return http.post("/SmartLink/User/b_station_info_add", params);
}

const enum EnumFileType {
  文件,
  图片,
}

interface UploadFileParams {
  type?: EnumFileType;
  file: File;
}

/**
 * 上传头像
 */
export function uploadPhoto(params: UploadFileParams) {
  params.type = EnumFileType.图片;
  return http.post("/glfile/?action=sharefile_service.upload_file", params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

interface GetTechnicianLabelListParams {
  user_id: number;
}

/**
 * 技师精修品牌列表
 */
export function getTechnicianLabelList(params: GetTechnicianLabelListParams) {
  return http.get("/SmartLink/User/getTechnicianLabelList", {
    params,
  });
}

export interface GetEvaluateListParams {
  user_id?: number;
  b_id?: number;
  page?: number;
  pagesize?: number;
}

/**
 * 商家技师评价列表
 */
export function getEvaluateList(params: GetEvaluateListParams) {
  return http.get("/SmartLink/Shop/getEvaluateList", {
    params,
  });
}

interface CashOutParams {
  user_id: number;
  verify_code: string;
  money: number;
  /**
   * ?接口未说明
   */
  wx_type?: number;
}

/**
 * 用户提现
 */
export function cashOut(params: CashOutParams) {
  params.wx_type = 5;
  return http.get("/SmartLink/Pay/cashOut", {
    params,
  });
}

interface SendCodeParams {
  /**
   * 邮箱、手机号
   */
  req_info: string;
  /**
   * 1 短信/邮箱
   * 2 图形
   */
  isres: 1 | 2;
  /**
   * 1 验证注册
   * 2 找回密码
   * 0 其他
   */
  is_check?: 1 | 2 | 0;
  /**
   * zh 中文,
   * en 英文
   */
  lan?: "zh" | "en";
}

/**
 * 发送验证码
 */
export function sendCode(params: SendCodeParams) {
  params.lan = "zh";
  return http.post("/SmartLink/User/req_send_code", params);
}

interface GetAcceptRecordCountParams {
  user_id: number;
  /**
   * 开始时间 YYYY-MM-DD
   */
  start_date: string;
  /**
   * 结束时间 YYYY-MM-DD
   */
  end_date: string;
}

/**
 * 查询商家或技师每日接单统计数据
 */
export function getAcceptRecordCount(params: GetAcceptRecordCountParams) {
  return http.get("/SmartLink/Count/get_accept_record_count", {
    params,
  });
}

interface GetTop10DataParams {
  user_id: number;
}

/**
 * 获取TOP10品牌、功能
 */
export function getTop10Data(params: GetTop10DataParams) {
  return http.get("/SmartLink/Count/getTop10Data", {
    params,
  });
}

export type TServiceStatusText =
  | "全部"
  | "待支付"
  | "待诊断"
  | "待确认"
  | "退款"
  | "完成";

export enum EServiceStatus {
  全部,
  待支付,
  待诊断,
  待确认,
  退款,
  完成,
}

interface GetServiceListParams {
  golo_user_id: number;
  type: EServiceStatus;
  page?: number;
  size?: number;
}

/**
 * 服务列表
 */
export function getServiceList(params: GetServiceListParams) {
  return http.get("/SmartLink/Task/get_bs_order_list", {
    params,
  });
}

export interface GetTaskDetailParams {
  golo_user_id: number;
  task_id: string;
}

/**
 * 用户查询任务详情
 */
export function getTaskDetail(params: GetTaskDetailParams) {
  return http.get("/SmartLink/Task/im_get_task_detail", {
    params,
  });
}

export enum TaskType {
  "普通模式",
  "智能模式",
}

const enum TaskItemId {
  "基本诊断" = 1,
  "在线编程",
  "设码/初始化",
  "改装/刷隐藏",
  "保养灯归零",
  "防盗匹配",
  "新能源车型",
  "其他",
}

interface IMModifyTaskParams {
  golo_user_id: number;
  task_id: number;
  serial_number: string;
  /** 维修建议 */
  advice?: string;
  status: EOrderStatus;
}

/**
 * B用户IM修改订单
 */
export function IMModifyTask(params: IMModifyTaskParams) {
  return http.post("/SmartLink/Task/im_modify_task", params);
}
