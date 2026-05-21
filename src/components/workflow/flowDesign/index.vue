<template>
  <div class="review-warp pageBgColor">
    <div ref="viewportRef" class="flow-viewport" :class="{ dragging: isDragging }" @mousedown="onMouseDown">
      <div class="zoom-toolbar" @mousedown.stop>
        <button class="zoom-btn" :disabled="!canZoomOut" @click="zoomOut" title="缩小">
          <el-icon>
            <Minus />
          </el-icon>
        </button>
        <span class="zoom-percent">{{ zoomPercent }}</span>
        <button class="zoom-btn" :disabled="!canZoomIn" @click="zoomIn" title="放大">
          <el-icon>
            <Plus />
          </el-icon>
        </button>
        <button class="zoom-btn" @click="resetView" title="重置">
          <el-icon>
            <RefreshRight />
          </el-icon>
        </button>
      </div>
      <div class="flow-container" :style="flowTransformStyle">
        <section v-if="flowData">
          <node-warp v-model:node="flowData" />
          <!-- 流程结束节点 -->
          <div class="end-node">
            <div class="circle"></div>
            <span class="text">流程结束</span>
          </div>
        </section>
        <section v-else>
          <p>暂无流程数据</p>
        </section>
      </div>
    </div>
  </div>
  <ApproverDrawer v-if="approverDrawerVisible" v-model="approverDrawerVisible" />
  <CopyerDrawer v-if="copyerDrawerVisible" v-model="copyerDrawerVisible" />
  <ConditionDrawer v-if="conditionDrawerVisible" v-model="conditionDrawerVisible" />
</template>

<script setup>
import { ref, onMounted, computed, watch, toRaw } from "vue";
import { Minus, Plus, RefreshRight } from "@element-plus/icons-vue";
import NodeWarp from "./nodeWarp.vue";
import { useViewportTransform } from "./viewportTransform.js";
import ApproverDrawer from "./drawer/approverDrawer.vue";
import CopyerDrawer from "./drawer/copyerDrawer.vue";
import ConditionDrawer from "./drawer/conditionDrawer.vue";
import { FormatUtils } from '@/utils/workflow/formatCommitData';
import { NodeType, placeholderList } from '@/utils/workflow/constant.js';
import { useWorkflowStore } from '@/store/modules/workflow'
const store = useWorkflowStore()
const viewportRef = ref(null);
const { viewportViewState, onMouseDown, zoomIn, zoomOut, resetView } = useViewportTransform(viewportRef);
const { isDragging, flowTransformStyle, zoomPercent, canZoomIn, canZoomOut } = viewportViewState;
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const flowData = ref(null)
watch(() => props.data,
  (newVal) => {
    flowData.value = JSON.parse(JSON.stringify(toRaw(newVal)));
  }, { immediate: true, deep: true })
const createDrawerVisible = (getVisible, setVisible) => computed({
  get: getVisible,
  set: setVisible
})
const promoterDrawerVisible = createDrawerVisible(
  () => store.promoterDrawer,
  (val) => store.setPromoter(val)
)
const approverDrawerVisible = createDrawerVisible(
  () => store.approverDrawer,
  (val) => store.setApprover(val)
)
const copyerDrawerVisible = createDrawerVisible(
  () => store.copyerDrawer,
  (val) => store.setCopyer(val)
)
const conditionDrawerVisible = createDrawerVisible(
  () => store.conditionDrawer,
  (val) => store.setCondition(val)
)

const collectPublishErrors = (node, errors = []) => {
  if (!node) {
    return errors;
  }
  const ignoreNodeTypes = [NodeType.StartNode];
  const shouldValidateNodeType = !ignoreNodeTypes.includes(node.nodeType);
  if (shouldValidateNodeType && node.error) {
    errors.push({
      key: node.nodeId,
      label: node.nodeName || node.nodeDisplayName || "流程设计",
      message: "请完善：" + placeholderList[node.nodeType] + "节点",
    });
  }
  if (node.nodeType == NodeType.GatewayNode) {
    node?.nodeProperty?.conditionNodes?.forEach((conditionNode) => {
      collectPublishErrors(conditionNode, errors);
    });
  }
  if (node.nodeType == NodeType.ParallelApproveWayNode) {
    node?.nodeProperty?.parallelNodes?.forEach((approveNode) => {
      collectPublishErrors(approveNode, errors);
    });
  }
  if (node.childNode) {
    collectPublishErrors(node.childNode, errors);
  }
  return errors;
};
const deepClone = (source) => {
  return JSON.parse(JSON.stringify(toRaw(source)));
};
const validatePublish = () => {
  const cloneFlowData = deepClone(flowData.value);
  return collectPublishErrors(cloneFlowData, []);
};
// 给父级页面提供得获取本页数据得方法
const getData = () => {
  try {
    const cloneFlowData = deepClone(flowData.value);
    const resultFlowData = FormatUtils.formatSettings(cloneFlowData);
    return Promise.resolve({ formData: [...resultFlowData] })
  } catch (err) {
    return Promise.reject(new Error('获取基础表单数据失败'))
  }
}

defineExpose({
  validatePublish,
  getData
});
</script>

<style scoped>
.review-warp {
  padding: 30px 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: stretch;
  background-color: #f5f6f8;
  /* 浅灰底色 */
}

.flow-viewport {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  -webkit-font-smoothing: auto;
  text-rendering: geometricPrecision;
}

.zoom-toolbar {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  cursor: default;
}

.zoom-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  background: #fff;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-btn:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
}

.zoom-btn:disabled {
  cursor: not-allowed;
  color: #c0c4cc;
  background: #f5f7fa;
}

.zoom-percent {
  min-width: 46px;
  font-size: 16px;
  line-height: 1;
  text-align: center;
  color: #303133;
}

.flow-viewport.dragging {
  cursor: grabbing;
}

.flow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* 连向结束节点的特殊修饰 */
.end-line {
  width: 1px;
  height: 30px;
  background-color: #cacaca;
}

.end-arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #cacaca;
}

.end-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
}

.end-node .circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #dbdbdb;
  margin-bottom: 10px;
}

.end-node .text {
  font-size: 14px;
  color: #999;
}
</style>
