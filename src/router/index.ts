import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import routers from './config'

// 路由数组
const routes: RouteRecordRaw[] = routers

// 创建路由
export default createRouter({
  history: createWebHistory(),
  routes,
});
