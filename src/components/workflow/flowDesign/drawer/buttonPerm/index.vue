<template>
	<section class="perm-panel">
		<header class="panel-head">
			<h3>【审批页面】按钮权限显示控制</h3>
			<p>可控制审批节点中按钮的显示权限，默认按钮不可取消。</p>
		</header>

		<el-checkbox-group v-model="localState.pageButtons" class="perm-list" @change="handleButtonsChange">
			<el-checkbox v-for="option in approvalPageButtons" :key="option.value" :value="option.value"
				:disabled="isLocked(option)" border class="perm-item" :class="{
					checked: isChecked(option),
					locked: isLocked(option),
				}">
				<span class="perm-label">【{{ option.label }}】</span>
				<span class="perm-desc">{{ option.description }}</span>
			</el-checkbox>
		</el-checkbox-group>
	</section>
</template>

<script setup>
import { reactive, watch } from "vue";
import { approvalPageButtons } from "@/utils/workflow/constantBtn";

const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({}),
	},
});
const emit = defineEmits(["update:modelValue", "change"]);
const defaultButtonValues = approvalPageButtons
	.filter((item) => item.type === "default")
	.map((item) => item.value);

const localState = reactive({
	pageButtons: [],
});
const isLocked = (option) => option.type === "default";
const isChecked = (option) => {
	return localState.pageButtons?.includes(option.value)
};
watch(() => props.modelValue, (val) => {
	localState.pageButtons = Array.from(new Set([...defaultButtonValues, ...(val?.approvalPage || [])]));
}, { immediate: true, deep: true });

const handleButtonsChange = () => {
	const nextModel = {
		...(props.modelValue || {}),
		approvalPage: [...localState.pageButtons],
	}
	emit("update:modelValue", nextModel);
};
</script>

<style scoped>
.perm-panel {
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

.panel-head {
	margin-bottom: 14px;
}

.panel-head h3 {
	margin: 0;
	font-size: 18px;
	font-weight: 700;
	color: var(--text-main);
}

.panel-head p {
	margin: 8px 0 0;
	font-size: 13px;
	color: var(--text-sub);
}

.perm-list,
.mode-list {
	display: grid;
	grid-template-columns: 1fr;
	row-gap: 12px;
}

.mode-block {
	margin-top: 14px;
}

.perm-item,
.mode-item {
	height: auto;
	min-height: 44px;
	margin-right: 0;
	padding: 11px 14px;
	border-radius: 8px;
	border-color: var(--panel-border);
	background: linear-gradient(180deg, #ffffff 0%, var(--panel-bg) 100%);
	transition: all 0.2s ease;
}

.perm-item :deep(.el-checkbox__label),
.mode-item :deep(.el-radio__label) {
	white-space: normal;
}

.perm-item :deep(.el-checkbox__label) {
	display: inline-flex;
	align-items: center;
	gap: 6px;
}

.perm-item.checked,
.mode-item.is-checked {
	border-color: var(--panel-primary);
	box-shadow: 0 0 0 2px rgba(47, 136, 255, 0.08);
	background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
}

.perm-item.locked {
	opacity: 0.78;
}

.perm-label {
	margin-right: 0;
	font-size: 14px;
	line-height: 1;
	font-weight: 700;
	display: inline-block;
	vertical-align: middle;
	color: #1f6fe5;
}

.perm-desc {
	font-size: 12px;
	line-height: 1.35;
	color: #4a5973;
}

.focus-mode-item {
	border-color: #9ec3ff;
}

@media (max-width: 768px) {
	.perm-panel {
		padding: 12px;
		border-radius: 10px;
	}

	.perm-item,
	.mode-item {
		padding: 10px 12px;
	}

	.perm-desc {
		display: inline;
	}
}
</style>
