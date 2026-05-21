<template>
  <el-dialog v-model="visibleDialog" title="选择条件" :width="520" append-to-body class="select-condition-dialog"
    :close-on-click-modal="false">
    <div class="global-relation">
      <p class="global-tip">请选择用来区分审批流程的条件字段</p>
    </div>
    <el-checkbox-group v-model="checkedKeys" class="field-grid">
      <el-checkbox v-for="item in conditionOptions" :key="item.key" :value="item.key">
        {{ item.label }}
      </el-checkbox>
    </el-checkbox-group>

    <div v-if="conditionOptions.length <= 0">
      <p style="color: red;">未设置业务表单</p>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useWorkflowStore } from '@/store/modules/workflow'
const store = useWorkflowStore();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
  }
});

const emit = defineEmits(["update:visible", "change"]);
const visibleDialog = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

const formFieldAll = computed(() => {
  const data = store.lowCodeFormField?.formFields || [];
  return Array.isArray(data) ? data : [];
});

//匹配数据库字段类型
const matchDatabasetype = new Map([
  ["input", "String"], //"string"
  ["number", "Int"], //" "Int""
  ["select", "String"], //"Int" select
  ["checkbox", "Array"], //checkbox 对应 VForm 是Array
  ["radio", "Int"],
  ["switch", "Int"],
  ["date", "DateTime"],
]);
/**低代码表单条件加载 */
const loadLFFormCondition = computed(() => {
  return formFieldAll.value
    .filter((item) => item && matchDatabasetype.has(item.type))
    .map((item, index) => {
      let optionGroup = [];
      if (item.options?.optionItems) {
        optionGroup = item.options.optionItems.map(c => {
          return { key: c.value, label: c.label }
        });
        optionGroup = optionGroup.filter(c => c);
      }
      return {
        key: item.id,
        label: item.options?.label || item.type || `未命名字段${index + 1}`,
        type: item.type,
        optType: "=",
        zdy1: getDefaultValue(item.type),
        opt1: "<",
        zdy2: "",
        opt2: "<",
        columnDbName: item.id,
        columnType: matchDatabasetype[item.type] || "String",
        fixedDownBoxValue: JSON.stringify(optionGroup)
      };

    });
});

const conditionOptions = computed(() => {
  return loadLFFormCondition.value.length > 0 ? loadLFFormCondition.value : [];
});
const toKeyArray = (input) => {
  if (!Array.isArray(input)) {
    return [];
  }
  return input.map((item) =>
    typeof item === "object" && item !== null ? item.key : item,
  );
};
const checkedKeys = ref([]);
watch(() => props.visible, (val) => {
  if (val) {
    checkedKeys.value = toKeyArray(props.data);
  }
}, { immediate: true },);

const closeDialog = () => {
  emit("update:visible", false);
};

const confirmDialog = () => {
  const checkedSet = new Set(checkedKeys.value);
  const selectedOptions = conditionOptions.value.filter((item) =>
    checkedSet.has(item.columnDbName),
  );
  //console.log('selectedOptions===============', selectedOptions);
  emit("change", selectedOptions);
  closeDialog();
};

/**
 * 根据组件类型 key 获取对应的默认值
 * @param {string} key - 组件类型 input/number/checkbox/radio 等
 * @returns {any} 对应的默认值（字符串/数组/数字/日期）
 */
function getDefaultValue(key) {
  const type = matchDatabasetype.get(key);
  switch (type) {
    case "String":
      return "";          // 字符串默认空串
    case "Array":
      return [];          // 数组默认空数组（checkbox 必须用这个）
    case "Int":
      return 0;           // 数字/单选/开关 默认 0
    case "DateTime":
      return new Date();
    default:
      return "";          // 兜底默认值
  }
}
</script>

<style scoped>
:deep(.select-condition-dialog .el-dialog) {
  border-radius: 4px;
  overflow: hidden;
}

:deep(.select-condition-dialog .el-dialog__header) {
  margin: 0;
  padding: 12px 16px;
  background: linear-gradient(90deg, #2f91ff 0%, #2586ef 100%);
}

:deep(.select-condition-dialog .el-dialog__title) {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

:deep(.select-condition-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
}

:deep(.select-condition-dialog .el-dialog__body) {
  padding: 20px 16px 16px;
}

:deep(.select-condition-dialog .el-dialog__footer) {
  border-top: 1px solid #ebeef5;
  padding: 10px 16px;
}

.global-relation {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 36px;
  padding: 0px 10px;
  margin-bottom: 14px;
  border: 1px solid #77b6ff;
  background: #edf5ff;
}

.global-tip {
  color: #2f88ff;
  font-size: 26px;
  line-height: 1;
  display: inline-block;
  transform: scale(0.5);
  transform-origin: left center;
  margin-right: -38px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  row-gap: 10px;
  column-gap: 8px;
}

.field-grid .el-checkbox {
  margin-right: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 640px) {
  .field-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
}
</style>
