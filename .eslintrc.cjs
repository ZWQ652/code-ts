/*
 * @Author: zwq
 * @Date: 2024-08-09 09:00:15
 * @LastEditors: zwq
 * @LastEditTime: 2024-09-29 15:03:32
 * @Description:
 */
/* eslint-env node */
module.exports = {
  root: true,
  globals: {
    //挂载的全局属性
    electronApi: 'readonly',
    __SERVER_PATH__: 'readonly'
  },
  env: {
    //环境配置
    browser: true, //浏览器全局变量。
    node: true,
    es6: true // 支持的特性 2021
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-fallthrough': 'off' // 允许switch块无break;
  }
}
