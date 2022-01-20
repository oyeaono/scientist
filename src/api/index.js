import axios from "axios";
import service from "./interface.js";
// import { encryptDes, decryptDes } from "../utils/encryption.js";

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 120000,
});

const Http = {};

for (let key in service) {
  let api = service[key]; // url method
  // async 作用：避免进入回调地狱
  Http[key] = async function (
    params, // 请求参数 get：url，put，post，patch（data），delete：url
    isFormData = false, // 标识是否是form-data请求
    config = {} // 配置参数
  ) {
    let newParams = {};

    //  content-type是否是form-data的判断
    if (params && isFormData) {
      newParams = new FormData();
      for (let i in params) {
        newParams.append(i, params[i]);
      }
    } else {
      newParams = params;
    }
    // 不同请求的判断
    let response = {}; // 请求的返回值
    if (
      api.method === "put" ||
      api.method === "post" ||
      api.method === "patch"
    ) {
      try {
        response = await instance[api.method](api.url, newParams, config);
      } catch (err) {
        response = err;
      }
    } else if (api.method === "delete" || api.method === "get") {
      config.params = newParams;
      try {
        response = await instance[api.method](api.url, config);
      } catch (err) {
        response = err;
      }
    }
    return response; // 返回响应值
  };
}

instance.interceptors.request.use(
  (config) => {
    // 发起请求前做些什么
    return config;
  },
  () => {
    // 请求错误
  }
);
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 请求成功
    return res.data;
  },
  () => {}
);

export default Http;
