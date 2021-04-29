export enum EOrderStatus {
  "未开始" = 1,
  "进行中",
  "已失效",
  "已完成",
  "已超时",
  "放弃",
  "待接单确认",
  "确认完成",
  "退款中"
}

export enum EPayStatus {
  "待支付",
  "已支付",
  "支付失败",
  "退款中",
  "退款成功"
}

export enum EnumBusinessType {
  普通维修厂 = 1,
  快修连锁店,
  品牌专修店,
  汽车改装店,
  汽车电子专修,
  其他
}

export enum EScoreText {
  "技术能力",
  "服务态度",
  "响应速度"
}