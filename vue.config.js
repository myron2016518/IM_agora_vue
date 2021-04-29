const {
  html: { title }
} = require("./package.json");

module.exports = {
  publicPath: "./",
  devServer: {
    port: "8110",
    proxy: {
      "/SmartLink": {
        // target: "http://aittest.x431.com:8000/"
        target: "https://ait.x431.com",//正式
      },
      "/glfile": {
        // target: "https://cntestglfile.x431.com/",
        target: "https://cnglfile.dbscar.com/", //正式
        pathRewrite: {
          "^/glfile": ""
        }
      },
      "/TC": {
        target: "http://token.mythinkcar.cn/",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/TC": "" }
      },
      '/tc_api': {
                target: "http://tcapi.mythinkcar.cn/", 
                changeOrigin: true,
                secure: false,
                pathRewrite: {'^/tc_api' : ''}
      },
      "/Systemus": {
        target: "http://system.mythinkcar.cn/",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/Systemus": "" }
      }
    }
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = title;
      return args;
    });
  }
};
