<template>
	<el-drawer v-model="drawerVisible" title="审批人" size="600px" :append-to-body="true" :destroy-on-close="false"
		class="approver-drawer">

		<el-tabs v-model="activeTab" class="approver-tabs">
			<el-tab-pane label="审批人设置" name="approverFormTab" />
			<el-tab-pane label="按钮权限设置" name="buttonPermTab">
				<button-perm v-model="approverForm.buttons" />
			</el-tab-pane>
			<el-tab-pane label="表单权限设置" name="fieldPermTab">
				<field-perm-conf :formItems="approverForm.fieldPrems" @changePermVal="changePermVal" />
			</el-tab-pane>
		</el-tabs>
		<section v-if="activeTab === 'approverFormTab'">
			<div class="approver-panel section-top">
				<el-radio-group class="radio-grid" v-model="approverForm.assigneeType"
					@change="handleAssigneeTypeChange">
					<el-radio v-for="item in assigneeTypeOptions" :key="item.value" :value="item.value">
						{{ item.label }}
					</el-radio>
				</el-radio-group>

				<div v-if="approverForm.assigneeType === 1" class="person-select-wrap">
					<el-button type="primary" plain :icon="Plus" @click="handleAddUser">
						添加/修改人员
					</el-button>
					<div class="person-tags">
						<el-tag v-for="person in approverForm.assigneeList" :key="person.targetId" closable
							effect="dark" @close="removeApproverUser(person.targetId)">
							{{ person.name }}
						</el-tag>
					</div>
				</div>
				<div v-if="approverForm.assigneeType === 2" class="person-select-wrap">
					<el-button type="primary" plain :icon="Plus" @click="handleAddRole">
						添加/修改角色
					</el-button>
					<div class="person-tags">
						<el-tag v-for="person in approverForm.assigneeList" :key="person.targetId" closable
							effect="dark" @close="removeApproverUser(person.targetId)">
							{{ person.name }}
						</el-tag>
					</div>
				</div>
				<div v-if="approverForm.assigneeType === 3" class="person-select-wrap">
					<el-alert class="hint-alert" :closable="false" show-icon title="直属领导" type="warning"
						description="系统将自动选择流程发起人的直属领导作为审批人" />
				</div>
				<div v-if="approverForm.assigneeType === 5" class="person-select-wrap">
					<div>
						<el-alert class="hint-alert" :closable="false" show-icon title="发起人自己" type="warning"
							description="系统将自动选择流程发起人自己作为审批人" />
					</div>
				</div>
				<div v-if="approverForm.assigneeType === 6" class="person-select-wrap">
					<div class="hint-alert">
						<span>发起人的：</span>
						<el-select v-model="approverForm.directorLevel" placeholder="请选择" style="width: 300px">
							<el-option v-for="item in directorMaxLevel" :key="item" :value="item"
								:label="item == 0 ? '直接主管' : '第' + item + '级' + '主管'" />
						</el-select>
						<p style="color: #e6a23c;">找不到主管时，由直属领导代审批</p>
					</div>

				</div>
				<div v-if="approverForm.assigneeType === 7" class="person-select-wrap">
					<div>
						<el-alert class="hint-alert" :closable="false" show-icon title="层层审批" type="warning"
							description="按照组织架构的上下级关系，从低到高、一级一级往上审批，每一级的直属领导都要依次审批" />
					</div>
				</div>
				<div v-if="approverForm.assigneeType === 8" class="person-select-wrap">
					<div>
						<el-alert class="hint-alert" show-icon title="发起人自选审批人" type="warning" :closable="false"
							description="用户可以在流程发起时选择该节点的审批人" />
					</div>
				</div>
			</div>
			<div class="approver-panel approver-panel-top">
				<div class="section-block">
					<h3>✍多人审批时采用的审批方式</h3>
					<el-radio-group v-model="approverForm.signType" class="radio-stack">
						<el-radio :value="1">或签（只需一名审批人同意或拒绝即可）</el-radio>
						<el-radio :value="2">会签（需所有审批人同意，不限顺序）</el-radio>
						<el-radio :value="3" v-if="approverForm.assigneeType === 1">顺序会签（需要所有审批人同意，根据前端传入的顺序）</el-radio>
					</el-radio-group>
				</div>

				<div class="section-block">
					<h3>✍审批人为空时</h3>
					<el-radio-group v-model="approverForm.noHeaderAction" class="radio-stack">
						<el-radio :value="0">不允许发起</el-radio>
						<el-radio :value="1">跳过</el-radio>
						<el-radio :value="2">转交给审核管理员</el-radio>
					</el-radio-group>
				</div>
			</div>
		</section>
		<template #footer>
			<div class="drawer-footer">
				<el-button @click="drawerVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
			</div>
		</template>
	</el-drawer>
	<select-user-dialog v-model:visible="userDialogVisible" :data="approverForm.assigneeList"
		@change="sureDialogApproverUser" />
	<select-role-dialog v-model:visible="roleDialogVisible" :data="approverForm.assigneeList"
		@change="sureDialogApproverRole" />
</template>

<script setup>
import { computed, reactive, ref, watch, getCurrentInstance } from "vue";
import { Plus } from "@element-plus/icons-vue";
import ButtonPerm from "./buttonPerm/index.vue";
import fieldPermConf from "./fieldPerm/index.vue"
import selectUserDialog from './dialog/selectUserDialog.vue'
import selectRoleDialog from './dialog/selectRoleDialog.vue'
import { useWorkflowStore } from '@/store/modules/workflow'
const store = useWorkflowStore();
const { proxy } = getCurrentInstance();
const _uid = getCurrentInstance().uid;
const {
	setApprover,
	setApproverConfig,
	approverConfig,
} = store;

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

const activeTab = ref("approverFormTab");
const userDialogVisible = ref(false);
const roleDialogVisible = ref(false);

const directorMaxLevel = 5; //主管层级最大值

const assigneeTypeOptions = [
	{ value: 1, label: "指定成员" },
	{ value: 2, label: "指定角色" },
	{ value: 3, label: "直属领导" },
	//{ value: 4, label: '指定部门' },
	{ value: 5, label: "发起人自己" },
	{ value: 6, label: "指定层级" },
	{ value: 7, label: "层层审批" },
	{ value: 8, label: "发起人自选审批人" },
];

let approverForm = reactive({
	assigneeType: 1,
	signType: 1,
	noHeaderAction: 0,
	directorLevel: 1, //主管层级 1、直属主管 2、上级主管 3、最高主管 
	IsDistinct: 0, //是否去重 1、去重 0、不去重
	sort: 0,
	fieldPrems: [],
	buttons: {
		approvalPage: [],
	},
	assigneeList: [],
});
const resetFromConfig = () => {
	const config = approverConfig?.value?.nodeProperty || {};
	Object.assign(approverForm, { ...config });
};

watch(() => drawerVisible.value, (val) => {
	if (val) {
		activeTab.value = "approverFormTab";
		resetFromConfig();
	}
}, { immediate: true });

const handleAssigneeTypeChange = () => {
	approverForm.signType = 1;
	approverForm.noHeaderAction = 0;
	approverForm.directorLevel = 3;
	approverForm.assigneeList = [];
	approverForm.IsDistinct = 0;
};
/**选择人员确认框 */
const sureDialogApproverUser = (data) => {
	approverForm.assigneeList = data;
}

const sureDialogApproverRole = (data) => {
	approverForm.assigneeList = data;
}
const handleAddUser = () => {
	userDialogVisible.value = true;
};
const handleAddRole = () => {
	roleDialogVisible.value = true;
};
//移除选中人员
const removeApproverUser = (targetId) => {
	approverForm.assigneeList = approverForm.assigneeList.filter((item) => item.targetId !== targetId);
};
//修改业务表单字段权限
const changePermVal = (val) => {
	approverForm.fieldPrems = val;
};
//审批人设置验证
const validNodeProperty = () => {
	// assigneeType 为指定成员/角色时，必须至少选择一项
	if ([1, 2].includes(approverForm.assigneeType)) {
		const assigneeList = approverForm.assigneeList || [];
		if (!Array.isArray(assigneeList) || assigneeList.length === 0) {
			return false;
		}
	}
	// assigneeType 为指定层级时，必须选择有效主管层级
	if (approverForm.assigneeType === 6) {
		const level = Number(approverForm.directorLevel || 0);
		if (!level || level <= 0) {
			return false;
		}
	}
	// 其他类型的校验规则默认为通过
	return true;
}
//生成显示名称
const generateDisplayName = (nodeProperty = {}) => {
	const assigneeType = nodeProperty.assigneeType;
	const assigneeList = nodeProperty.assigneeList || [];
	const directorLevel = nodeProperty.directorLevel;
	const signType = nodeProperty.signType;

	// 1 assigneeType 为 1/2 时，展示选中人员/角色名称
	if ([1, 2].includes(assigneeType)) {
		const names = assigneeList
			.map((item) => item?.name)
			.filter(Boolean);
		if (names.length > 0) {
			if (signType == 1) {
				return names.join(",");
			} else if (signType == 2) {
				return (
					assigneeList.length + "人(" + names.join(",") + ")会签"
				);
			} else if (signType == 3) {
				return (
					assigneeList.length + "人(" + names.join(",") + ")顺序会签"
				);
			}
			else {
				return names.join(",");
			}
		}
	}

	// 2 assigneeType 为 6 时，展示主管层级
	if (assigneeType === 6) {
		return `第 ${directorLevel} 级主管`;
	}

	// 3 其他类型展示对应配置项 label
	const matched = assigneeTypeOptions.find((item) => item.value === assigneeType);
	return matched?.label || approverConfig?.value?.nodeName;
}


const handleSubmit = () => {
	setApprover(false);
	const nextNodeProperty = {
		...(approverConfig?.value.nodeProperty || {}),
		...approverForm,
	};
	approverConfig.value.nodeProperty = nextNodeProperty;
	approverConfig.value.nodeDisplayName = generateDisplayName(nextNodeProperty);
	approverConfig.value.error = !validNodeProperty();
	approverConfig.flag = approverConfig.value.error;
	//console.log('approverConfig=============', approverConfig);
	setApproverConfig(approverConfig);
};
</script>

<style scoped>
:deep(.approver-drawer .el-drawer__body) {
	padding-top: 8px;
	padding-bottom: 8px;
}

.approver-tabs {
	margin-bottom: 10px;
}

.approver-panel {
	--panel-bg: #f7f9fc;
	--panel-border: #d9e3f4;
	--panel-primary: #2f88ff;
	--text-main: #24324a;
	--text-sub: #6b7a90;
	padding: 16px;
	border-radius: 14px;
	background: radial-gradient(circle at 20% 0, #ffffff 0, #f8fbff 40%, #f3f7fd 100%);
	border: 1px solid #ebf0f8;
}

.approver-panel-top {
	margin-top: 10px;
}

.section-top {
	min-height: 200px;
}

.section-block {
	padding: 14px 0 16px;
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

.person-select-wrap .hint-alert {
	margin-top: 8px;
	border-radius: 8px;
}

@media (max-width: 560px) {
	.radio-grid {
		grid-template-columns: 1fr;
	}
}
</style>