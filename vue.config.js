// eslint-disable-next-line
const px2rem = require('postcss-px2rem');
const path = require('path');

const {
  env: { BASE_URL },
  VUE_CLI_SERVICE: { mode }
} = process;
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  // 修改为相对路径
  baseUrl: BASE_URL,
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    port: 8080,
    proxy: {
      '/api': {
        target: ' http://39.105.108.226:7002', // 对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config =>
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('variable', resolve('src/variable.styl')),
  css: {
    loaderOptions: {
      postcss: {
        // 基准大小 baseSize，需要和rem.js中相同
        // 1rem=remUnit*px
        plugins: [px2rem({ remUnit: 100 })]
      }
    }
  },
  productionSourceMap: mode !== 'production'
};
