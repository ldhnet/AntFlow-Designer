<template>
  <div ref="rootRef" class="add-node">
    <div class="add-btn">
      <el-icon>
        <Plus />
      </el-icon>
    </div>
    <div class="add-menu" @click.stop>
      <div v-for="item in actions" :key="item.label" class="menu-item" @click="handleAddNode(item)">
        <div class="menu-icon" :style="{ color: item.color }">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
        </div>
        <div class="menu-label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Connection,
  Guide,
  Plus,
  Promotion,
  Share,
  Switch,
  UserFilled,
} from "@element-plus/icons-vue";
import { NodeUtils } from "@/utils/workflow/nodeUtils";
import { useWorkflowStore } from "@/store/modules/workflow";
const store = useWorkflowStore();
const { setApprover, setApproverConfig } = store;
const rootRef = ref(null);
let props = defineProps({
  childNode: {
    type: Object,
    default: () => (null)
  }
})
let emits = defineEmits(['update:childNode'])

const actions = [
  { label: "审批人", key: 1, icon: UserFilled, color: "#f2994a" },
  { label: "抄送人", key: 2, icon: Promotion, color: "#2f80ed" },
  { label: "条件网关", key: 3, icon: Connection, color: "#27ae60" },
  { label: "并行审批", key: 4, icon: Share, color: "#f2994a" },
];
/**创建审批人节点 */
const createApproveNode = (childNode) => {
  return NodeUtils.createApproveNode(childNode);
}
/**创建抄送人节点 */
const createCopyNode = (childNode) => {
  return NodeUtils.createCopyNode(childNode);
}
/**创建并行审批人节点 */
const createParallelWayNode = (childNode) => {
  return NodeUtils.createParallelWayNode(childNode);
}
/**创建条件网关节点 */
const createGatewayNode = (childNode) => {
  return NodeUtils.createGatewayNode(childNode);
}
/**创建并行审批人节点 */
const createParallelApproveNode = (childNode) => {
  return NodeUtils.createParallelApproveNode(childNode);
}
/**创建并行网关节点 */
const createParallelConditionWayNode = (childNode) => {
  return NodeUtils.createParallelConditionWayNode(childNode);
}
// 创建节点 Map集合
const createNodeMap = new Map([
  [1, createApproveNode],
  [2, createCopyNode],
  [3, createGatewayNode],
  [4, createParallelWayNode],
  [5, createParallelApproveNode],
  [6, createParallelConditionWayNode]
]);
const handleAddNode = (item) => {
  const handleCreateNodeFunc = createNodeMap.get(item.key);
  const newNodeInfo = handleCreateNodeFunc(props.childNode);
  emits("update:childNode", newNodeInfo)
};
</script>

<style scoped>
.add-node {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-node::after {
  content: "";
  position: absolute;
  left: 100%;
  top: 50%;
  width: 16px;
  height: 56px;
  transform: translateY(-50%);
}

.add-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #3296fa;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(50, 150, 250, 0.3);
  position: relative;
  z-index: 2;
  color: #fff;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.add-btn:hover {
  transform: scale(1.12);
  box-shadow: 0 8px 18px rgba(50, 150, 250, 0.35);
}

.add-menu {
  position: absolute;
  left: 42px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  background-color: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  box-shadow: 0 12px 30px rgba(20, 40, 80, 0.16);
  border: 1px solid #edf0f5;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  min-width: 260px;
  z-index: 20;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
  transition:
    opacity 0.15s ease,
    visibility 0.15s ease;
}

.add-node:hover .add-menu,
.add-node:focus-within .add-menu {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translate3d(0, -50%, 0);
}

.add-menu::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 8px 8px 8px 0;
  border-style: solid;
  border-color: transparent #edf0f5 transparent transparent;
}

.add-menu::after {
  content: "";
  position: absolute;
  left: -7px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 7px 7px 7px 0;
  border-style: solid;
  border-color: transparent #fff transparent transparent;
}

.menu-item {
  border: 1px solid #e7e9ef;
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.menu-item:hover {
  transform: translateY(-1px);
  border-color: #cfd7e6;
  box-shadow: 0 6px 14px rgba(20, 40, 80, 0.12);
}

.menu-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f5f7fb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.menu-icon .el-icon {
  font-size: 18px;
  line-height: 1;
}

.menu-label {
  font-size: 13px;
  font-weight: 500;
  color: #3f4754;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  white-space: nowrap;
}
</style>
