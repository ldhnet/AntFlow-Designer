<template>
  <div class="node-warp">
    <!-- 1. 普通节点 -->
    <template v-if="node && ![NodeTypeEnum.GatewayNode, NodeTypeEnum.ParallelApproveWayNode].includes(node.nodeType)">
      <div class="node-card-wrap">
        <span v-if="node.error" class="node-error-badge" aria-label="节点配置错误">!</span>
        <div :class="['node-card', { 'is-active': isActive, 'has-error': node.error }]">
          <span v-if="node.nodeWeight && node.nodeType == NodeTypeEnum.ConditionNode" class="node-priority">
            优先级{{ node.nodeWeight }}
          </span>
          <button class="node-delete" type="button" @click.stop="handleDelete(node)"> x </button>
          <div :class="['node-header', `hd-${node.nodeType}`]">
            <div class="header-left">
              <el-icon v-if="node.nodeType === NodeTypeEnum.ApproveNode" class="node-icon">
                <UserFilled />
              </el-icon>
              <el-icon v-if="node.nodeType === NodeTypeEnum.CopyNode" class="node-icon">
                <Promotion />
              </el-icon>
              <span v-if="!isInputEditList[0]" class="title" @click.stop="startEdit(0)">
                {{ node.nodeName }}
              </span>
              <input v-else v-model="node.nodeName" v-focus class="node-title-input" type="text" @blur="commitEdit(0)"
                @keydown.enter.stop.prevent="commitEdit(0)" @keydown.esc.stop.prevent="cancelEdit(0)" />
            </div>
          </div>
          <div class="node-content" @click="setNodeInfo(node)">
            <span class="placeholder" v-if="node.error">请选择{{ defaultText }}</span>
            <span class="content" v-else>{{ node.nodeDisplayName }}</span>
            <el-icon class="arrow-right">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>

      <div class="connecting-line">
        <div class="line-top"></div>
        <AddNode v-model:childNode="node.childNode" />
        <div class="line-bottom"></div>
        <div class="arrow"></div>
      </div>
    </template>
    <!-- 2. 条件网关节点 -->
    <template v-if="node && node.nodeType === NodeTypeEnum.GatewayNode">
      <div class="parallel-branches-container">
        <div class="branch-label condition-branch-label" @click="handleAddNodeItem(node)">添加条件</div>
        <div class="branches-wrapper">
          <div class="branch-column" v-for="(branch, index) in node?.nodeProperty?.conditionNodes || []" :key="index">
            <template v-if="branch">
              <!-- <node-warp v-if="branch" :node="branch" /> -->
              <div class="node-card-wrap">
                <span v-if="branch.error" class="node-error-badge" aria-label="节点配置错误">!</span>
                <div :class="['node-card', { 'has-error': branch.error }]">
                  <span class="node-priority">
                    优先级{{ branch.nodeWeight }}
                  </span>
                  <button class="node-delete" type="button" @click.stop="handleDelete(branch)"> x </button>
                  <div :class="['node-header', `hd-${branch.nodeType}`]">
                    <div class="header-left">
                      <span v-if="!isInputEditList[index]" class="title" @click.stop="startEdit(index)">
                        {{ branch.nodeName }}
                      </span>
                      <input v-else v-focus v-model="branch.nodeName" class="node-title-input" type="text"
                        @blur="commitEdit(index)" @keydown.enter.stop.prevent="commitEdit(index)"
                        @keydown.esc.stop.prevent="cancelEdit(index)" />
                    </div>
                  </div>
                  <div class="node-content" @click="setNodeInfo(branch)">
                    <span class="placeholder" v-if="branch.error">请选择{{ defaultText }}</span>
                    <span class="content" v-else>{{ branch.nodeDisplayName }}</span>
                    <el-icon class="arrow-right">
                      <ArrowRight />
                    </el-icon>
                  </div>
                </div>
              </div>
              <div class="connecting-line">
                <div class="line-top"></div>
                <AddNode v-model:childNode="branch.childNode" />
                <div class="line-bottom"></div>
                <div class="arrow"></div>
              </div>
              <div class="branch-empty-space"></div>
            </template>
            <node-warp v-if="branch && branch.childNode" v-model:node="branch.childNode" />
            <template v-if="index == 0">
              <div class="top-left-cover-line"></div>
              <div class="bottom-left-cover-line"></div>
            </template>
            <template v-if="index == node?.nodeProperty?.conditionNodes.length - 1">
              <div class="top-right-cover-line"></div>
              <div class="bottom-right-cover-line"></div>
            </template>
          </div>
        </div>
      </div>
      <div class="merge-line">
        <div class="line-top"></div>
        <AddNode v-model:childNode="node.childNode" />
        <div class="line-bottom"></div>
        <div class="arrow"></div>
      </div>
    </template>
    <!-- 3. 并行审批分支节点 -->
    <template v-if="node && node.nodeType === NodeTypeEnum.ParallelApproveWayNode">
      <div class="parallel-branches-container">
        <div class="branch-label condition-branch-label" @click="handleAddNodeItem(node)">并行审批</div>
        <div class="branches-wrapper">
          <div class="branch-column" v-for="(branch, index) in node?.nodeProperty?.parallelNodes || []" :key="index">
            <template v-if="branch">
              <!-- <node-warp v-if="branch" :node="branch" /> -->
              <div class="node-card-wrap">
                <span v-if="branch.error" class="node-error-badge" aria-label="节点配置错误">!</span>
                <div :class="['node-card', { 'has-error': branch.error }]">
                  <button class="node-delete" type="button" @click.stop="handleDelete(branch)"> x </button>
                  <div :class="['node-header', `hd-${branch.nodeType}`]">
                    <div class="header-left">
                      <span v-if="!isInputEditList[index]" class="title" @click.stop="startEdit(index)">
                        {{ branch.nodeName }}
                      </span>
                      <input v-else v-focus v-model="branch.nodeName" class="node-title-input" type="text"
                        @blur="commitEdit(index)" @keydown.enter.stop.prevent="commitEdit(index)"
                        @keydown.esc.stop.prevent="cancelEdit(index)" />
                    </div>
                  </div>
                  <div class="node-content" @click="setNodeInfo(branch)">
                    <span class="placeholder" v-if="branch.error">请选择{{ defaultText }}</span>
                    <span class="content" v-else>{{ branch.nodeDisplayName }}</span>
                    <el-icon class="arrow-right">
                      <ArrowRight />
                    </el-icon>
                  </div>
                </div>
              </div>
              <div class="connecting-line">
                <div class="line-top"></div>
                <AddNode v-model:childNode="branch.childNode" />
                <div class="line-bottom"></div>
                <div class="arrow"></div>
              </div>
              <div class="branch-empty-space"></div>
            </template>
            <node-warp v-if="branch && branch.childNode" v-model:node="branch.childNode" />
            <template v-if="index == 0">
              <div class="top-left-cover-line"></div>
              <div class="bottom-left-cover-line"></div>
            </template>
            <template v-if="index == node?.nodeProperty?.parallelNodes.length - 1">
              <div class="top-right-cover-line"></div>
              <div class="bottom-right-cover-line"></div>
            </template>
          </div>
        </div>
      </div>

      <div class="merge-line">
        <div class="line-top"></div>
        <AddNode v-model:childNode="node.childNode" />
        <div class="line-bottom"></div>
        <div class="arrow"></div>
      </div>
    </template>

    <!-- 3. 递归渲染下一个节点 -->
    <node-warp v-if="node && node.childNode" v-model:node="node.childNode" />
  </div>

</template>

<script setup>
import { computed, nextTick, ref, getCurrentInstance } from "vue";
import { ArrowRight, Promotion, UserFilled } from "@element-plus/icons-vue";
import AddNode from "./addNode.vue";
import { NodeType as NodeTypeEnum, placeholderList } from '@/utils/workflow/constant.js';
import { NodeUtils } from "@/utils/workflow/nodeUtils";
import { useWorkflowStore } from '@/store/modules/workflow'
const store = useWorkflowStore();
const { proxy } = getCurrentInstance();
const _uid = getCurrentInstance().uid;
const {
  setPromoter,
  setApprover,
  setCopyer,
  setCondition,
  setPromoterConfig,
  setApproverConfig,
  setCopyerConfig,
  setConditionsConfig,
} = store;

defineOptions({
  name: "NodeWarp",
});
const emits = defineEmits(["update:node"])
const props = defineProps({
  node: {
    type: Object,
    default: () => ({}),
  }
});
const isInputEditList = ref([]);//是否是输入状态 
/**默认显示节点名称 */
const defaultText = computed(() => {
  return placeholderList[props.node.nodeType]
})

//console.log("node init=====", props.node)

const isActive = false;
const approverVisible = ref(false);
/**
 * 设置节点信息
 */
const setNodeInfo = (node) => {
  const payload = {
    value: node,
    index: node.nodeWeight || 0,
    flag: false,
    id: _uid,
  };
  const actionMap = {
    [NodeTypeEnum.StartNode]: { open: setPromoter, config: setPromoterConfig },
    [NodeTypeEnum.ApproveNode]: { open: setApprover, config: setApproverConfig },
    [NodeTypeEnum.ParallelApproveNode]: { open: setApprover, config: setApproverConfig },
    [NodeTypeEnum.CopyNode]: { open: setCopyer, config: setCopyerConfig },
    [NodeTypeEnum.ConditionNode]: { open: setCondition, config: setConditionsConfig },
  };

  const entry = actionMap[node.nodeType];
  if (!entry) throw new Error("Unsupported node type");
  if (typeof entry.open === "function") entry.open(true);
  if (typeof entry.config === "function") entry.config(payload);
};
// 重置节点权重
const resetNodeWeights = (nodes = []) => {
  const validNodes = nodes.filter(Boolean);
  const normalNodes = validNodes.filter((item) => item.nodeProperty.isDefault !== 1);
  const defaultNodes = validNodes.filter((item) => item.nodeProperty.isDefault === 1);
  const orderedNodes = [...normalNodes, ...defaultNodes];
  const newOrderedNodes = orderedNodes.map((item, index) => ({
    ...item,
    nodeWeight: index + 1,
  }));
  //newOrderedNodes.sort((a, b) => a.nodeWeight - b.nodeWeight);
  return newOrderedNodes;
};

// 添加条件分支或并行分支
const handleAddNodeItem = () => {
  if (!props.node) return;
  const updateNode = JSON.parse(JSON.stringify(props.node));
  if (updateNode.nodeType === NodeTypeEnum.GatewayNode) {
    const nodes = (updateNode.nodeProperty.conditionNodes || []).concat(
      NodeUtils.createConditionNode("条件" + (updateNode.nodeProperty.conditionNodes?.length || 0), null, 0, false)
    );
    updateNode.nodeProperty.conditionNodes = resetNodeWeights(nodes);
  }
  else if (updateNode.nodeType === NodeTypeEnum.ParallelApproveWayNode) {
    const nodes = (updateNode.nodeProperty.parallelNodes || []).concat(
      NodeUtils.createParallelApproveNode(null)
    );
    updateNode.nodeProperty.parallelNodes = resetNodeWeights(nodes);
  }
  else {
    throw new Error("Unsupported node type");
  }
  emits("update:node", updateNode);
};
// 删除节点
const handleDelete = (node) => {
  if (!node) return;
  const updateNode = JSON.parse(JSON.stringify(props.node));
  if (updateNode.nodeType === NodeTypeEnum.GatewayNode) {
    let conditionNodes = updateNode.nodeProperty?.conditionNodes || [];
    if (conditionNodes.length <= 2) {
      emits("update:node", updateNode.childNode);
      return;
    }
    const index = conditionNodes.findIndex((item) => item.nodeId === node.nodeId);
    if (index > -1) {
      conditionNodes = conditionNodes.filter((_, i) => i !== index); // 生成新数组
      updateNode.nodeProperty.conditionNodes = resetNodeWeights(conditionNodes);
    }
    emits("update:node", updateNode);
    return;
  }
  if (updateNode.nodeType === NodeTypeEnum.ParallelApproveWayNode) {
    let parallelNodes = updateNode.nodeProperty?.parallelNodes || [];
    if (parallelNodes.length <= 2) {
      emits("update:node", updateNode.childNode);
      return;
    }
    const index = parallelNodes.findIndex((item) => item.nodeId === node.nodeId);
    if (index > -1) {
      parallelNodes = parallelNodes.filter((_, i) => i !== index); // 生成新数组
      updateNode.nodeProperty.parallelNodes = resetNodeWeights(parallelNodes);
    }
    emits("update:node", updateNode);
    return;
  }
  emits("update:node", updateNode.childNode);
};
//点击节点名称编辑
const startEdit = (index) => {
  if (!props.node) {
    return;
  }
  if (index || index === 0) {
    isInputEditList.value[index] = true;
  } else {
    isInputEditList.value[0] = true;
  }
};
//提交编辑节点名称
const commitEdit = (index = 0) => {
  if (!props.node) {
    return;
  }
  const idx = Number.isInteger(index) ? index : 0;
  const updatedNode = JSON.parse(JSON.stringify(props.node));

  if (updatedNode.nodeType == NodeTypeEnum.GatewayNode) {
    updatedNode.nodeProperty.conditionNodes[idx].nodeName = updatedNode.nodeProperty.conditionNodes[idx].nodeName || "条件";
  } else if (updatedNode.nodeType == NodeTypeEnum.ParallelApproveWayNode) {
    updatedNode.nodeProperty.parallelNodes[idx].nodeName = updatedNode.nodeProperty.parallelNodes[idx].nodeName || "审批人";
  } else {
    updatedNode.nodeName = updatedNode.nodeName || defaultText
  }
  emits("update:node", updatedNode);
  isInputEditList.value[idx] = false;
};

const cancelEdit = (index = 0) => {
  isInputEditList.value[index] = false;
};
</script>

<style scoped>
.node-warp {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.node-card-wrap {
  position: relative;
  width: 260px;
}

.node-card {
  position: relative;
  width: 100%;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(180, 180, 180, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.node-card.has-error {
  border-color: #ff4d4f;
}

.node-error-badge {
  position: absolute;
  top: 0px;
  right: -25px;
  z-index: 1;
  pointer-events: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.45);
}

.node-delete {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 12px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition:
    opacity 0.2s ease,
    background 0.2s ease;
}

.node-priority {
  position: absolute;
  top: 6px;
  right: 30px;
  padding: 0 6px;
  border-radius: 10px;
  background: #eee;
  color: #555353;
  font-size: 11px;
  line-height: 18px;
}

.node-card:hover .node-delete {
  opacity: 1;
}

.node-delete:hover {
  background: rgba(0, 0, 0, 0.55);
}

.node-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(50, 150, 250, 0.8);
}

/* 高亮选中态（截图中的蓝色外发光边框效果） */
.node-card.is-active {
  box-shadow: 0 0 0 6px rgba(50, 150, 250, 0.7);
}

.node-header {
  padding: 6px 12px;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 14px;
}

.node-icon {
  margin-right: 4px;
  font-size: 14px;
  color: #fff;
}

.header-left {
  display: flex;
  align-items: center;
}

.title {
  max-width: 7em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.node-title-input {
  width: 12em;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  font-size: 12px;
  line-height: 1.2;
  padding: 2px 4px;
  outline: none;
}

/* 不同类型节点的颜色配置 */
.node-header {
  background-color: #5b698d;
}

.node-header.hd-1 {
  background-color: #5b698d;
}

.node-header.hd-3 {
  background-color: rgba(39, 174, 96, 0.12);
  color: #27ae60;
}

.node-header.hd-3 .node-title-input {
  border-color: rgba(39, 174, 96, 0.9);
}

.node-header.hd-4,
.node-header.hd-7 {
  background-color: #ff943e;
}

.node-header.hd-6 {
  background-color: #3296fa;
}

.node-content {
  padding: 3px 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 14px;
  color: #333;
  min-height: 48px;
}

.content {
  flex: 1;
  min-width: 0;
  line-height: 18px;
  max-height: 54px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* 同时写标准属性和带前缀的属性 */
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.placeholder {
  color: #999;
}

.arrow-right {
  flex: 0 0 15px;
  width: 15px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0;
  font-size: 20px;
  color: #999;
  border-left: 1px solid #ececec;
  pointer-events: none;
}

/* 分支卡片箭头规则（纯 CSS）：
   最左：仅右箭头；中间：左右箭头；最右：仅左箭头 */
.branches-wrapper .branch-column:not(:first-child) .node-content::before {
  content: "\2039";
  flex: 0 0 15px;
  width: 15px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 20px;
  line-height: 1;
  margin-right: 0;
  border-right: 1px solid #ececec;
  pointer-events: none;
}

.branches-wrapper .branch-column:last-child .node-content .arrow-right {
  visibility: hidden;
  /* 视觉隐藏 */
}

/* 连接线及中间加号 */
.connecting-line {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line-top {
  width: 1px;
  height: 20px;
  background-color: #cacaca;
}

.line-bottom {
  width: 1px;
  height: 20px;
  background-color: #cacaca;
}

/* 箭头小三角 */
.connecting-line .arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #cacaca;
}

/* ==== 并行分支样式区 ==== */
.parallel-branches-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 12px 0 0;
}

.branch-label {
  position: absolute;
  top: -10px;
  z-index: 2;
  background-color: #fff;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  color: #27ae60;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.condition-branch-label {
  color: #3296fa;
  cursor: pointer;
}

.condition-branch-label:hover {
  background-color: #3296fa;
  color: #fff;
  box-shadow: 0 4px 12px rgba(50, 150, 250, 0.35);
}

.branches-wrapper {
  display: flex;
  justify-content: center;
  position: relative;
  width: fit-content;
  max-width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 0 20px;
}

/* 连接分支的顶横线与底横线 */
.branches-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 299px);
  height: 1px;
  background-color: #cacaca;
}

.branches-wrapper::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 299px);
  height: 1px;
  background-color: #cacaca;
}

.branch-column {
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
  position: relative;
}

/* 分支侧边的垂直连接线 */
.branch-column::before {
  content: "";
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 20px;
  background-color: #cacaca;
}

.branch-column::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 20px;
  background-color: #cacaca;
}

/* 分支为了对齐底部的虚空占位，补充画出该长分支的接引直线 */
.branch-empty-space {
  flex: 1;
  width: 1px;
  background-color: #cacaca;
}

/* 并行汇聚后下面结构 */
.merge-line {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.merge-line .line-top {
  width: 1px;
  height: 20px;
  background-color: #cacaca;
}

.merge-line .line-bottom {
  width: 1px;
  height: 20px;
  background-color: #cacaca;
}

.merge-line .arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #cacaca;
}

.top-left-cover-line {
  left: -1px;
}

.top-left-cover-line,
.top-right-cover-line {
  position: absolute;
  height: 8px;
  width: 50%;
  background-color: #f5f5f7;
  top: -22px;
}

.top-right-cover-line {
  right: -1px;
}

.bottom-left-cover-line {
  left: -1px;
}

.bottom-left-cover-line,
.bottom-right-cover-line {
  z-index: 1;
  position: absolute;
  height: 8px;
  width: 50%;
  background-color: #f5f5f7;
  bottom: -22px;
}

.bottom-right-cover-line {
  right: -1px;
}
</style>
