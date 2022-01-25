const interface_API = {
  // 登录、定时检测
  timingDetection: {
    method: "post",
    url: "/user/checkPassword",
  },
  // 解锁密码和pc唯一端地址
  deviceUnlock: {
    method: "post",
    url: "/user/unlockPasswordForPc",
  },
  // 消耗积分兑换功能
  integralConvert: {
    method: "post",
    url: "/user-function/exchangeFunction",
  },
  // 获取套餐列表
  setMealList: {
    method: "post",
    url: "/function-package/listFunctionPackage",
  },
  // 获取积分
  getIntegral: {
    method: "post",
    url: "/user/getUserScoreInPc",
  },
  // 获取数据
  getConfig: {
    method: "post",
    url: "/user/getConfig",
  },
};

export default interface_API;
