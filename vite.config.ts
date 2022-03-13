import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import styleImport from "vite-plugin-style-import";
import path from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";
import usePluginImport from "vite-plugin-importer";
import ViteComponents from "unplugin-vue-components/vite";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import { generateModifyVars } from "./build/style/generateModifyVars";

import { camelCase } from 'unplugin-vue-components'
// https://vitejs.dev/config/
interface IMatcher {
  pattern: RegExp;
  styleDir: string;
}

export default defineConfig({
  // base: "/dist/",
  plugins: [
    vue(),
    vueJsx(),/*  */
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹/*  */
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icon/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[name]',
    }),
    // ElementPlus({
    //   // options
    // }),
    // ViteComponents({
    //   dirs: ['./', './components', 'src/components'],
    //   directoryAsNamespace: true,
    // include: [/@layui/],
    //  extensions: ['vue'],
    // include: [/\.vue$/, /\.vue\?vue/,/[\\/]node_modules[\\/]/],
    // }),
    //tsx用
    // usePluginImport({
    //   libraryName: "ant-design-vue",
    //   libraryDirectory: "es",
    //   style: "css",
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 配置@符号
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },

  // 服务器配置
  server: {
    host: 'localhost',
    port: 8080,
    strictPort: false, // 端口被占用直接退出
    https: false, //默认使用 http方式
    open: true, // 自动启动项目
    // 代理
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // build: {
  //   rollupOptions: {
  //     output: {

  //       manualChunks(id) {
  //         if (id.includes('node_modules') && id.includes('element-plus')) {
  //           console.log(id)
  //           return id.toString().split('node_modules/')[1].split('/')[0].toString()
  //         }
  //       }
  //     }
  //   }
  // },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        modifyVars: generateModifyVars(),
        javascriptEnabled: true,
      },
      // css配置
      //引入var.scss 这样就可以再全局中使用var.scss中预定的变量了
      // 给导入的路径最后加上；
      scss: {
        additionalData: '@import "@/assets/styles/global.scss";', // 引入全局scss地址
      },
    },
  },
});
