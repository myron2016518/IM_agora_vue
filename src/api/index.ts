import { isDevelopment, isProduction } from "@/utils/utils";
import axios, { AxiosRequestConfig } from "axios";
import { Message } from "element-ui";

const config: AxiosRequestConfig = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  transformRequest: [
    (data, headers) => {
      if (data) {
        switch (headers["Content-Type"]) {
          case "application/x-www-form-urlencoded": {
            const queryArr = [];
            for (const i in data) {
              queryArr.push(`${i}=${data[i]}`);
            }
            console.log("queryArr", queryArr);
            return queryArr.join("&");
          }
          case "multipart/form-data": {
            const formData = new FormData();
            for (const i in data) {
              formData.append(i, data[i]);
            }
            // console.info(formData.get('type'))
            return formData;
          }
        }
      }
    },
  ],
};

const http = axios.create(config);

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // console.info(config);
    return config;
  },
  (err) => {
    // 对请求错误做些什么
    return Promise.reject(err);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    if (response.data.code != 0) {
      Message.error(response.data.msg);
      return Promise.reject(response.data);
    }
    return response.data;
    // 响应报错处理
  },
  (err) => {
    // 对响应错误做点什么
    return Promise.reject(err);
  }
);

export { http };
