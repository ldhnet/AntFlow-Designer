<template>
    <el-drawer v-model="drawerVisible" title="抄送人" size="580px" :append-to-body="true" :destroy-on-close="false"
        class="copyer-drawer">
        <el-tabs v-model="activeTab" class="copyer-tabs">
            <el-tab-pane label="抄送人设置" name="copyerTab" />
            <el-tab-pane label="表单权限设置" name="formTab" />
        </el-tabs>

        <div v-if="activeTab === 'copyerTab'" class="section-block section-top">
            <el-radio-group v-model="copyform.assigneeType" class="radio-grid" @change="handleAssigneeTypeChange">
                <el-radio v-for="item in assigneeTypeOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                </el-radio>
            </el-radio-group>

            <div v-if="copyform.assigneeType === 1" class="person-select-wrap">
                <el-button type="primary" plain :icon="Plus" @click="handleAddUser">
                    添加/修改人员
                </el-button>
                <div class="person-tags">
                    <el-tag v-for="person in copyform.assigneeList" :key="person.targetId" closable effect="light"
                        @close="removeChooseUser(person.targetId)">
                        {{ person.name }}
                    </el-tag>
                </div>
            </div>
            <div v-if="copyform.assigneeType === 2" class="person-select-wrap">
                <el-button type="primary" plain :icon="Plus" @click="handleAddRole">
                    添加/修改角色
                </el-button>
                <div class="person-tags">
                    <el-tag v-for="person in copyform.assigneeList" :key="person.targetId" closable effect="light"
                        @close="removeChooseUser(person.targetId)">
                        {{ person.name }}
                    </el-tag>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'formTab'" class="section-block section-top">
            <field-perm-conf :formItems="copyform.fieldPrems" @changePermVal="changePermVal" />
        </div>

        <template #footer>
            <div class="drawer-footer">
                <el-button @click="drawerVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
        </template>
    </el-drawer>
    <select-user-dialog v-model:visible="userDialogVisible" :data="copyform.assigneeList"
        @change="sureDialogcopyerUser" />
    <select-role-dialog v-model:visible="roleDialogVisible" :data="copyform.assigneeList"
        @change="sureDialogcopyerRole" />
</template>

<script setup>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { Plus } from "@element-plus/icons-vue";
import fieldPermConf from "./fieldPerm/index.vue"
import selectUserDialog from './dialog/selectUserDialog.vue'
import selectRoleDialog from './dialog/selectRoleDialog.vue'
import { useWorkflowStore } from '@/store/modules/workflow'
const store = useWorkflowStore();
const { proxy } = getCurrentInstance();
const _uid = getCurrentInstance().uid;
const { setCopyer, setCopyerConfig, copyerDrawer, copyerConfig } = store;

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["update:modelValue", "confirm"]);
const drawerVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});
const userDialogVisible = ref(false);
const roleDialogVisible = ref(false);
const activeTab = ref("copyerTab");
const assigneeTypeOptions = [
    { value: 1, label: "指定成员" },
    { value: 2, label: "指定角色" },
];

const copyform = reactive({
    assigneeType: 1,
    assigneeList: [],
    fieldPrems: [],
});

const resetFromConfig = () => {
    const config = copyerConfig?.value?.nodeProperty || {};
    Object.assign(copyform, { ...config });
};

watch(() => drawerVisible.value, (val) => {
    if (val) {
        activeTab.value = "copyerTab";
        resetFromConfig();
    }
}, { immediate: true });

const handleAssigneeTypeChange = () => {
    if (copyform.assigneeType !== 1) {
        copyform.assigneeList = [];
    }
};
/**选择人员确认框 */
const sureDialogcopyerUser = (data) => {
    copyform.assigneeList = data;
}

const sureDialogcopyerRole = (data) => {
    copyform.assigneeList = data;
}
const handleAddUser = () => {
    userDialogVisible.value = true;
};
const handleAddRole = () => {
    roleDialogVisible.value = true;
};
//移除选中人员
const removeChooseUser = (targetId) => {
    copyform.assigneeList = copyform.assigneeList.filter((item) => item.targetId !== targetId);
};
//修改业务表单字段权限
const changePermVal = (val) => {
    copyform.fieldPrems = val;
};
//生成显示名称
const generateDisplayName = (nodeProperty = {}) => {
    const assigneeType = nodeProperty.assigneeType;
    const assigneeList = nodeProperty.assigneeList || [];
    let newDisplayName = "";
    const names = assigneeList
        .map((item) => item?.name)
        .filter(Boolean);

    if (names.length > 0) {
        newDisplayName = names.join(",");
    }
    return newDisplayName || copyerConfig?.value?.nodeName;
}
const handleSubmit = () => {
    setCopyer(false);
    const assigneeList = [...(copyform.assigneeList || [])];
    const nextNodeProperty = {
        ...(copyerConfig?.value.nodeProperty || {}),
        ...copyform,
    };
    copyerConfig.value.nodeProperty = nextNodeProperty;
    copyerConfig.value.nodeDisplayName = generateDisplayName(nextNodeProperty);
    copyerConfig.value.error = !(assigneeList.length > 0);
    copyerConfig.flag = copyerConfig.value.error;
    setCopyerConfig(copyerConfig);
};
</script>

<style scoped>
:deep(.copyer-drawer .el-drawer__body) {
    padding-top: 8px;
    padding-bottom: 8px;
}

.copyer-tabs {
    margin-bottom: 10px;
}

.section-top {
    min-height: 200px;
}

.section-block {
    padding: 14px 0 16px;
    border-top: 1px solid #ebedf0;
}

.section-block h3 {
    margin: 8px 0 16px;
    font-size: 20px;
    line-height: 20px;
    font-weight: 500;
    color: #303133;
}

.radio-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(180px, 1fr));
    row-gap: 8px;
    column-gap: 10px;
    width: 100%;
    margin-bottom: 16px;
}

.radio-grid .el-radio {
    margin-right: 0;
}

.person-select-wrap {
    margin-top: 8px;
}

.person-tags {
    margin-top: 12px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.radio-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.drawer-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

@media (max-width: 820px) {
    .radio-grid {
        grid-template-columns: repeat(2, minmax(140px, 1fr));
    }
}

@media (max-width: 560px) {
    .radio-grid {
        grid-template-columns: 1fr;
    }
}
</style>