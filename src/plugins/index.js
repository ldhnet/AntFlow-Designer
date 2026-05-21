import tab from "./tab";
import cache from "./cache";
import modal from "./modal";

export default function installPlugins(app) {
  // 页签操作
  app.config.globalProperties.$tab = tab;
  // 缓存对象
  app.config.globalProperties.$cache = cache;
  // 模态框对象
  app.config.globalProperties.$modal = modal;
}
