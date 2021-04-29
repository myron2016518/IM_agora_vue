// @ts-nocheck
/* eslint-disable */
// @ts-ignore

export const DETAIL_ERR_CODE = 20190810; // 任务详情已被取消或删除而不能获得接口数据的自定义错误代码
export const ROLE_TYPE_C = 1; //C端用户
export const ROLE_TYPE_B = 2; //B端用户

export const DEVICE_TYPE_C = 1; //SmartLinkC
export const DEVICE_TYPE_B = 2; //SmartLinkB

//im自定义消息状态
export const IM_ORDER_HELP = "order_help"; //发起订单
export const IM_ORDER_PAYED = "order_payed"; //订单已付款
export const IM_ACCEPT_TASK = "received_order_help"; //接受订单
export const IM_FINISH_TASK = "diagnose_finish"; //诊断完成
export const IM_GIVEUP_TASK = "giveup_order"; //放弃订单

export const transferStatus = function(val = 0) {
  var status = "";
  switch (parseInt(val)) {
    case 1:
      status = "未开始";
      break;
    case 2:
      status = "进行中";
      break;
    case 3:
      status = "已失效";
      break;
    case 4:
      status = "已完成";
      break;
    case 5:
      status = "已超时";
      break;
    case 6:
      status = "放弃";
      break;
    case 7:
      status = "待接单确认";
      break;
    case 8:
      status = "确认完成";
      break;
    case 9:
      status = "退款中";
      break;
    default:
      status = "";
  }
  return status;
};
//进度条处理（包含C端二次确认过程）
export const processCheckCopy = function(status, roleId) {
  var titleList = {};
  if (roleId == 2) {
    //B端用户
    titleList.data = ["接受任务", "待用户确认", "联系用户远程", "确认完成"];
  }
  if (roleId == 1) {
    //C端用户
    titleList.data = [
      "发布需求",
      "等待接单",
      "确认接单",
      "技师远程",
      "确认完成"
    ];
  }
  switch (parseInt(status)) {
    case 1:
      //表示未开始,roleId为2为B端，1为C端
      if (roleId == 2) {
        titleList.chose = 0;
      }
      if (roleId == 1) {
        titleList.chose = 1;
      }
      break;
    case 2:
      //进行中
      if (roleId == 2) {
        titleList.chose = 2;
      }
      if (roleId == 1) {
        titleList.chose = 3;
      }
      break;
    case 4:
      //已结束
      if (roleId == 2) {
        titleList.chose = 3;
      }
      if (roleId == 1) {
        titleList.data = [
          "等待接单",
          "确认接单",
          "技师远程",
          "确认完成",
          "评价"
        ];
        titleList.chose = 4;
      }
      break;
    case 7:
      //待用户确认
      if (roleId == 2) {
        titleList.chose = 1;
      }
      if (roleId == 1) {
        titleList.chose = 2;
      }
      break;
    case 8:
      //待确认完成
      if (roleId == 2) {
        titleList.chose = 3;
      }
      if (roleId == 1) {
        titleList.chose = 4;
      }
      break;
    case 9:
      //退款中
      if (roleId == 2) {
        titleList.data = ["确认接单", "技师远程", "确认完成", "退款中"];
        titleList.chose = 3;
      }
      if (roleId == 1) {
        titleList.data = [
          "等待接单",
          "确认接单",
          "技师远程",
          "确认完成",
          "退款中"
        ];
        titleList.chose = 4;
      }
      break;
    default:
      titleList.chose = -1;
      break;
  }
  if (titleList.chose >= 0) {
    var headCompiled = _.template($("#processDialogTpl").html())(titleList);
  } else {
    var headCompiled = "";
  }
  console.log("titleList", titleList);
  return headCompiled;
};
//进度条处理（删除C端二次确认过程）
export const processCheck = function(status, roleId) {
  var titleList = {};
  if (roleId == 2) {
    //B端用户
    titleList.data = ["接受任务", "联系用户远程", "确认完成"];
  }
  if (roleId == 1) {
    //C端用户
    titleList.data = ["发布需求", "等待接单", "技师远程", "确认完成"];
  }
  switch (parseInt(status)) {
    case 0:
      if (roleId == ROLE_TYPE_C) {
        titleList.chose = 0;
      }
      break;
    case 1:
      //表示未开始,roleId为2为B端，1为C端
      if (roleId == ROLE_TYPE_B) {
        titleList.chose = 0;
      }
      if (roleId == ROLE_TYPE_C) {
        titleList.chose = 1;
      }
      break;
    case 2:
      //进行中
      if (roleId == ROLE_TYPE_B) {
        titleList.chose = 1;
      }
      if (roleId == ROLE_TYPE_C) {
        titleList.chose = 2;
      }
      break;
    case 4:
      //已结束
      if (roleId == ROLE_TYPE_B) {
        titleList.chose = 2;
      }
      if (roleId == ROLE_TYPE_C) {
        titleList.data = ["等待接单", "技师远程", "确认完成", "评价"];
        titleList.chose = 3;
      }
      break;
    /*case 7:
                //待用户确认
                if(roleId==2) {
                    titleList.chose=1;
                }
                if(roleId==1){
                    titleList.chose=2;
                }
                break;*/
    case 8:
      //待确认完成
      if (roleId == ROLE_TYPE_B) {
        titleList.chose = 2;
      }
      if (roleId == ROLE_TYPE_C) {
        titleList.chose = 3;
      }
      break;
    case 9:
      //退款中
      if (roleId == ROLE_TYPE_B) {
        titleList.data = ["确认接单", "技师远程", "确认完成", "退款中"];
        titleList.chose = 3;
      }
      if (roleId == ROLE_TYPE_C) {
        titleList.data = ["等待接单", "技师远程", "确认完成", "退款中"];
        titleList.chose = 3;
      }
      break;
    default:
      titleList.chose = -1;
      break;
  }
  return titleList;
};

// 判断设备类型
export function getDeviceType(sn) {
  var type = "";
  if (/^(98957|98934|96067)/.test(sn)) {
    type = "C";
  } else if (/^(98956|98945)/.test(sn)) {
    type = "B";
  }
  return type;
}
//判断是否在元征apk中打开
export function isApp() {
  return true; //window.Yuanzheng
}
export function getLocationInApp() {
  let possition = {
      lon: "",
      lat: ""
    },
    isYuanzheng = isApp();
  if (isYuanzheng && typeof isYuanzheng.getLocation === "function") {
    try {
      possition = JSON.parse(isYuanzheng.getLocation());
    } catch (e) {
      possition = {
        lon: "",
        lat: ""
      };
    }
  }
  return possition;
}
//支付类型
export function transformPayType(value) {
  let type = "";
  switch (parseInt(value)) {
    case 1:
      type = "微信";
      break;
  }
  return type;
}
//支付状态
export function transformPayStatus(value) {
  let status = "";
  switch (parseInt(value)) {
    case 0:
      status = "未支付";
      break;
    case 1:
      status = "已支付";
      break;
    case 2:
      status = "支付失败";
      break;
    case 3:
      status = "退款中";
      break;
    case 4:
      status = "退款成功";
      break;
  }
  return status;
}

/**
 * 获取订单类型（查询时的分类）
 * @param  {Number} type 订单类型值
 * @return {String}      订单类型名称
 */
export function getTotalType(type) {
  let totalType = "total";
  switch (parseInt(type)) {
    case 0: //所有
      totalType = "total";
      break;
    case 1: //未支付
      totalType = "un_pay";
      break;
    case 2: //待诊断
      totalType = "wait_diagnose";
      break;
    case 3: //待确认
      totalType = "wait_confirm";
      break;
    case 4: //退款
      totalType = "refund";
      break;
    case 5: //完成
      totalType = "finish";
      break;
    case 7: //未开始
      totalType = "un_start";
      break;
  }
  return totalType;
}

/**
 * 判断非空 单独处理 null
 */
export function checkEmpty(_txt) {
  let _t = "";
  _txt && _txt != "null" && _txt != null && (_t = _txt || "");

  return _t;
}
