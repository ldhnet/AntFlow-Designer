import { createApp, defineAsyncComponent } from "vue";
import "./assets/styles/index.css";
import "./assets/styles/element-ui.css";
import App from "./App.vue";

import router from "./router";
import store from "./store";
import plugins from "./plugins"; // plugins

import VForm3 from "@/./lib/vform/designer.umd.js";
import "./lib/vform/designer.style.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const paginationAsync = defineAsyncComponent(
  () => import("./components/Pagination/index.vue"),
);
const app = createApp(App);
// 全局组件挂载
app.component("Pagination", paginationAsync);

app.use(router);
app.use(store);
app.use(plugins);
app.use(VForm3); //全局注册VForm3，同时注册了v-form-designer、v-form-render等组件
// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: zhCn,
  // 支持 large、default、small
  size: "default",
});

app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});
app.mount("#app");
