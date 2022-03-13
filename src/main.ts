import "default-passive-events";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/utils/flexiblePC.js'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css' // or 'ant-design-vue/dist/antd.less'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'virtual:svg-icons-register';

const app = createApp(App);

app.use(Antd).use(ElementPlus).use(router).use(store).mount("#app");
