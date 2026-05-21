<template>
  <el-drawer v-model="drawerVisible" title="条件设置" size="600px" :append-to-body="true" :destroy-on-close="false"
    class="condition-drawer">
    <section class="condition-panel" v-if="state.isDefault == 1">
      <div>
        <el-alert class="hint-alert" show-icon title="默认条件分支描述" type="warning" :closable="false"
          description="默认条件分支不允许设置条件，即兜底分支，其他条件未命中时走默认分支，可以防止流程卡住。如果不需要默认分支，请先添加条件，然后将默认条件分支删除" />
      </div>
    </section>
    <section class="condition-panel" v-if="state.isDefault != 1">
      <div class="global-relation">
        <span class="relation-tip">当审批单满足以下条件时进入此流程</span>
        <span class="relation-label">条件组关系：</span>
        <el-switch v-model="state.groupRelation" inline-prompt active-text="且" inactive-text="或" />
      </div>

      <div v-for="(group, groupIndex) in state.groupConditions" :key="group.id" class="group-wrap">
        <el-card shadow="never" class="group-card">
          <template #header>
            <div class="group-header">
              <div class="group-title-wrap">
                <span class="group-title">{{ group.groupName || `条件组${groupIndex + 1}` }}</span>
                <span class="relation-label">组内条件关系：</span>
                <el-switch v-model="group.condRelation" inline-prompt active-text="且" inactive-text="或" />
              </div>
              <el-button text :icon="Delete" @click="removeGroup(group.groupId)" class="delete-group-btn" />
            </div>
          </template>

          <div class="group-content-scroll">
            <div v-for="item in group.conditionList" :key="item.id" class="condition-row">
              <label class="field-name">
                <span class="field-name-text" :data-full-label="item.label">{{ item.label }}</span>
                <span class="field-name-colon">:</span>
              </label>

              <div class="field-editor">
                <el-input v-if="item.type === 'input'" v-model="item.zdy1" :placeholder="`请输入${item.label}`"
                  clearable />

                <div v-else-if="item.type === 'number'" class="composite-editor">
                  <el-select v-model="item.optType" style="width: 104px">
                    <el-option label="等于" value="=" />
                    <el-option label="大于" value=">" />
                    <el-option label="小于" value="<" />
                    <el-option label="小于等于" value="<=" />
                    <el-option label="大于等于" value=">=" />
                    <el-option label="介于两数之间" value="in" />
                  </el-select>
                  <el-input-number v-model="item.zdy1" :controls="false" :placeholder="`请输入${item.label}`"
                    style="width: 100%" />
                </div>

                <div v-else-if="item.type === 'date'" class="composite-editor">
                  <el-select v-model="item.optType" style="width: 104px">
                    <el-option label="等于" value="=" />
                    <el-option label="大于" value=">" />
                    <el-option label="小于" value="<" />
                    <el-option label="小于等于" value="<=" />
                    <el-option label="大于等于" value=">=" />
                    <el-option label="介于两数之间" value="in" />
                  </el-select>
                  <el-date-picker v-model="item.zdy1" type="date" value-format="YYYY-MM-DD" placeholder="请选择date"
                    style="flex: 1" />
                </div>

                <el-select v-else-if="item.type === 'select'" v-model="item.zdy1" :placeholder="`请选择${item.label}`"
                  clearable>
                  <el-option v-for="slItem in getOptionList(item.fixedDownBoxValue)" :key="slItem.key"
                    :value="slItem.key" :label="slItem.label"></el-option>
                </el-select>

                <div v-else-if="item.type === 'time'" class="composite-editor">
                  <el-select v-model="item.optType" style="width: 104px">
                    <el-option label="等于" value="=" />
                    <el-option label="大于" value=">" />
                    <el-option label="小于" value="<" />
                    <el-option label="小于等于" value="<=" />
                    <el-option label="大于等于" value=">=" />
                    <el-option label="介于两数之间" value="in" />
                  </el-select>
                  <el-time-picker v-model="item.zdy1" value-format="HH:mm:ss" placeholder="请选择time" style="flex: 1" />
                </div>

                <el-checkbox-group v-else-if="item.type === 'checkbox'" v-model="item.zdy1">
                  <el-checkbox v-for="(ckItem, ckIndex) in getOptionList(item.fixedDownBoxValue)" :key="ckItem.key"
                    :value="ckItem.key">{{
                      ckItem.label }}</el-checkbox>
                </el-checkbox-group>

                <el-radio-group v-else-if="item.type === 'radio'" v-model="item.zdy1">
                  <el-radio v-for="(raItem, raIndex) in getOptionList(item.fixedDownBoxValue)" :key="raItem.key"
                    :value="raItem.key">
                    {{ raItem.label }}
                  </el-radio>
                </el-radio-group>

                <el-switch v-else-if="item.type === 'switch'" v-model="item.zdy1" />
              </div>

              <el-button text type="primary" class="delete-btn" @click="removeCondition(group.groupId, item.key)">
                删除
              </el-button>
            </div>
          </div>

          <el-button type="primary" @click="openConditionDialog(group.groupId)">
            + 添加条件
          </el-button>
        </el-card>

        <p v-if="groupIndex < state.groupConditions.length - 1" class="between-relation">
          {{ state.groupRelation ? "且满足" : "或满足" }}
        </p>
      </div>

      <div class="group-tray">
        <el-button class="group-tray-btn" @click="addConditionGroup">
          + 添加条件组
        </el-button>
      </div>
    </section>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-drawer>

  <select-condition-dialog v-if="conditionDialogVisible" v-model:visible="conditionDialogVisible"
    :data="activegroupConditionselectedTypes" @change="handleConditionDialogChange" />
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { Delete } from "@element-plus/icons-vue";
import SelectConditionDialog from "./dialog/selectConditionDialog.vue";
import { useWorkflowStore } from '@/store/modules/workflow'
const store = useWorkflowStore();
const {
  setCondition,
  setConditionsConfig,
  conditionsConfig,
} = store;

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(["update:modelValue"]);
const drawerVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
const conditionDialogVisible = ref(false);
const activeGroupId = ref(null);
const normalizeConditionValue = (condition) => {
  if (condition?.type !== "number") {
    return condition;
  }
  if (condition.zdy1 === "" || condition.zdy1 === undefined) {
    return { ...condition, zdy1: null };
  }
  return condition;
};

const normalizegroupConditions = (groupConditions = []) =>
  groupConditions.map((group, index) => ({
    ...group,
    groupName: group.groupName || `条件组${index + 1}`,
    conditionList: Array.isArray(group.conditionList)
      ? group.conditionList.map((condition) => normalizeConditionValue(condition))
      : [],
  }));

// 当前条件组已选的条件类型列表
const activegroupConditionselectedTypes = computed(() => {
  const targetGroup = state.groupConditions.find((group) => group.groupId === activeGroupId.value);
  if (!targetGroup || !Array.isArray(targetGroup.conditionList)) {
    return [];
  }
  return Array.from(new Set(targetGroup.conditionList.map((item) => item.key)));
});
const state = reactive({});
const resetByModel = () => {
  const config = conditionsConfig?.value?.nodeProperty || {};
  const defaultData = JSON.parse(JSON.stringify(config));
  defaultData.groupConditions = normalizegroupConditions(defaultData.groupConditions || []);
  Object.assign(state, defaultData);
};

watch(() => drawerVisible.value, (val) => {
  if (val) {
    resetByModel();
  }
}, { immediate: true },);


//打开条件字段选择框
const openConditionDialog = (groupId) => {
  activeGroupId.value = groupId;
  conditionDialogVisible.value = true;
};
// 添加条件选项
const handleConditionDialogChange = (selectedOptions) => {
  const targetGroup = state.groupConditions.find((group) => group.groupId === activeGroupId.value);
  if (!targetGroup) {
    return;
  }
  //遍历要添加的选项，不存在则 push 存在则移除
  const selectedKeys = new Set(selectedOptions.map(i => i.key));
  targetGroup.conditionList = [
    ...targetGroup.conditionList.filter(i => selectedKeys.has(i.key)),
    ...selectedOptions.filter(i => !targetGroup.conditionList.some(c => c.key === i.key))
  ];
};
// 删除条件组
const removeGroup = (groupId) => {
  state.groupConditions = state.groupConditions.filter((item) => item.groupId !== groupId);
};
// 移除条件
const removeCondition = (groupId, conditionId) => {
  const targetGroup = state.groupConditions.find((item) => item.groupId === groupId);
  if (!targetGroup) {
    return;
  }
  targetGroup.conditionList = targetGroup.conditionList.filter(
    (item) => item.key !== conditionId,
  );
};
const addConditionGroup = () => {
  state.groupConditions.push({
    groupId: `group-${Date.now()}`,
    groupName: `条件组${state.groupConditions.length + 1}`,
    condRelation: true,
    conditionList: [],
  });
};
// 验证节点属性
const validNodeProperty = () => {
  return state.groupConditions.every((group) => {
    const conditionList = group.conditionList.filter(item => {
      const hasZdy1 = item.zdy1 != null && item.zdy1 !== '';
      const isInAndHasZdy2 = item.optType === 'in' && item.zdy2 != null && item.zdy2 !== '';
      return hasZdy1 || isInAndHasZdy2;
    })
    return conditionList.length > 0;
  });
}
// 生成显示名称
const generateDisplayName = (nodeProperty = {}) => {
  if (nodeProperty.isDefault == 1) {
    return "默认条件分支";
  }
  const defaultDisplayName = "请设置条件";
  const groupConditions = Array.isArray(nodeProperty.groupConditions) ? nodeProperty.groupConditions : [];
  if (groupConditions.length === 0) {
    return defaultDisplayName;
  }
  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join("/");
    }
    if (value === null || value === undefined || value === "") {
      return "";
    }
    return String(value);
  };

  const groupTextList = groupConditions
    .map((group, index) => {
      const groupName = group.groupName || `条件组${index + 1}`;
      const conditionList = Array.isArray(group.conditionList) ? group.conditionList : [];
      if (conditionList.length === 0) {
        return defaultDisplayName;
      }

      const conditionJoiner = group.condRelation ? " 且 " : " 或 ";
      const conditionText = conditionList.filter(item => {
        const hasZdy1 = item.zdy1 != null && item.zdy1 !== '';
        const isInAndHasZdy2 = item.optType === 'in' && item.zdy2 != null && item.zdy2 !== '';
        return hasZdy1 || isInAndHasZdy2;
      }).map((item) => {
        const label = item.label || item.key || "条件";
        const optType = item.optType || "=";
        const zdy1 = formatValue(item.zdy1);
        return `${label} ${optType} ${zdy1}`.trim();
      }).join(conditionJoiner);
      return `${groupName}:(${conditionText})`;
    }).filter(Boolean);

  if (groupTextList.length === 0) {
    return defaultDisplayName;
  }
  const groupJoiner = nodeProperty.groupRelation ? " 且 " : " 或 ";
  return groupTextList.join(groupJoiner);
}

const handleConfirm = () => {
  const valid = validNodeProperty();
  const nextNodeProperty = {
    ...conditionsConfig.value.nodeProperty,
    ...state,
  };
  conditionsConfig.value.nodeProperty = nextNodeProperty;
  conditionsConfig.value.nodeDisplayName = generateDisplayName(nextNodeProperty);
  conditionsConfig.value.error = !valid;
  conditionsConfig.flag = conditionsConfig.value.error;
  setCondition(false);
  setConditionsConfig(conditionsConfig);
};

const getOptionList = (value) => {
  try {
    return value ? JSON.parse(value) : []
  } catch (e) {
    console.warn('下拉选项解析失败', e)
    return []
  }
}
</script>

<style scoped>
:deep(.condition-drawer .el-drawer__body) {
  padding-top: 8px;
  padding-bottom: 12px;
  background: #f7f9fc;
}

.condition-panel {
  padding-bottom: 4px;
}

.global-relation {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  min-height: 36px;
  padding: 0px 12px;
  margin-bottom: 5px;
  border: 1px solid #77b6ff;
  background: #edf5ff;
}

.global-relation .relation-tip {
  font-size: 13px;
  transform: none;
  margin-right: 0;
  white-space: nowrap;
}

.global-relation .relation-label {
  margin-left: auto;
  margin-right: 0;
  font-size: 13px;
  transform: none;
  white-space: nowrap;
}

.global-relation :deep(.el-switch) {
  flex-shrink: 0;
}

.relation-tip {
  color: #2f88ff;
  font-size: 26px;
  line-height: 1;
  display: inline-block;
  transform: scale(0.5);
  transform-origin: left center;
  margin-right: -38px;
}

.relation-label {
  font-size: 26px;
  line-height: 1;
  color: #f59f42;
  display: inline-block;
  transform: scale(0.5);
  transform-origin: left center;
  margin-right: -28px;
}

.group-wrap {
  margin-bottom: 10px;
}

.group-card {
  border-color: #dfe5f0;
  border-radius: 6px;
}

:deep(.group-card .el-card__header) {
  padding: 5px 10px;
}

:deep(.group-card .el-card__body) {
  padding: 5px 10px;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.group-title-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.group-title-wrap .relation-label {
  font-size: 13px;
  transform: none;
  margin-right: 0;
  white-space: nowrap;
}

.group-title {
  font-size: 28px;
  line-height: 1;
  transform: scale(0.5);
  transform-origin: left center;
  margin-right: -30px;
  color: #242b38;
}

.delete-group-btn {
  color: #606266;
}

.group-content-scroll {
  max-height: 184px;
  min-height: 50px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

.condition-row {
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr) 52px;
  gap: 12px;
  align-items: center;
  min-height: 56px;
  border-bottom: 1px solid #ebeef5;
}

.condition-row:last-child {
  border-bottom: none;
}

.field-name {
  position: relative;
  text-align: right;
  overflow: visible;
  color: #2467bf;
  font-size: 14px;
  line-height: 1;
  transform: none;
}

.field-name-text {
  display: inline-block;
  position: relative;
  max-width: 7em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.field-name-colon {
  vertical-align: middle;
}

.field-name-text:hover::after {
  content: attr(data-full-label);
  position: absolute;
  right: 0;
  bottom: calc(100% + 6px);
  max-width: 220px;
  padding: 6px 8px;
  border-radius: 4px;
  background: rgba(48, 49, 51, 0.96);
  color: #fff;
  font-size: 12px;
  line-height: 1.3;
  white-space: normal;
  word-break: break-all;
  z-index: 20;
}

.field-editor {
  min-width: 0;
  width: 100%;
}

.composite-editor {
  display: flex;
  gap: 8px;
}

/* 两个子元素平分宽度 */
.composite-editor>* {
  flex: 1;
}

.delete-btn {
  justify-self: end;
  padding-left: 0;
  padding-right: 0;
}

.between-relation {
  margin: 10px 0 2px 6px;
  color: #f59f42;
  font-size: 22px;
  line-height: 1;
  transform: scale(0.5);
  transform-origin: left center;
}

.drawer-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.group-tray {
  padding: 10px 0 0;
  margin-top: 4px;
}

.group-tray-btn {
  width: 100%;
  height: 36px;
  border: none;
  background: #eceff3;
  color: #8f98a8;
  font-weight: 600;
}

.group-tray-btn:hover {
  background: #e3e7ee;
  color: #6f7b8f;
}

@media (max-width: 760px) {
  .condition-row {
    gap: 6px;
    padding: 10px 0;
  }

  .field-name {
    text-align: left;
    transform-origin: left center;
  }
}
</style>
