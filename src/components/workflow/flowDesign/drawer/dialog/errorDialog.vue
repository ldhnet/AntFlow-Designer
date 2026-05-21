<template>
	<el-dialog v-model="visibleDialog" title="提示" :width="620" append-to-body class="error-dialog"
		:close-on-click-modal="false" :show-close="true">
		<section class="error-panel">
			<div class="error-summary">
				<div class="error-icon">!</div>
				<div class="error-copy">
					<p class="error-title">当前无法发布</p>
					<p class="error-subtitle">以下内容不完善，需进行修改</p>
				</div>
				<div class="error-count">{{ normalizedItems.length }} 项待修复</div>
			</div>

			<div v-if="normalizedItems.length" class="error-list">
				<div v-for="(item, index) in normalizedItems" :key="item.key || item.label || index" class="error-row">
					<div class="error-main">
						<span class="error-index">{{ index + 1 }}</span>
						<span class="error-label">{{ item.label }}</span>
					</div>
					<span class="error-message">{{ item.message }}</span>
				</div>
			</div>
			<div v-else class="error-empty">未检测到可展示的问题项</div>
		</section>

		<template #footer>
			<div class="dialog-footer">
				<el-button class="ghost-btn" @click="handleAcknowledge">我知道了</el-button>
				<el-button type="primary" class="primary-btn" @click="handleEdit">前往修改</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	items: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(["update:visible", "edit"]);

const visibleDialog = computed({
	get: () => props.visible,
	set: (val) => emit("update:visible", val),
});

const normalizedItems = computed(() =>
	(props.items || []).map((item) => ({
		key: item?.key,
		label: item?.label || "未命名项",
		message: item?.message || "请补充完整",
	})),
);

const closeDialog = () => {
	emit("update:visible", false);
};

const handleAcknowledge = () => {
	closeDialog();
};

const handleEdit = () => {
	emit("edit", normalizedItems.value);
	closeDialog();
};
</script>

<style scoped>
:deep(.error-dialog .el-dialog) {
	border-radius: 12px;
	overflow: hidden;
}

:deep(.error-dialog .el-dialog__header) {
	margin: 0;
	padding: 20px 24px 0;
}

:deep(.error-dialog .el-dialog__title) {
	color: #2f3440;
	font-size: 18px;
	font-weight: 600;
}

:deep(.error-dialog .el-dialog__headerbtn) {
	top: 18px;
	right: 18px;
}

:deep(.error-dialog .el-dialog__headerbtn .el-dialog__close) {
	color: #a8abb2;
	font-size: 18px;
}

:deep(.error-dialog .el-dialog__body) {
	padding: 14px 24px 8px;
}

:deep(.error-dialog .el-dialog__footer) {
	padding: 12px 24px 20px;
}

.error-panel {
	min-height: 220px;
}

.error-summary {
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 14px 16px;
	border-radius: 10px;
	background: linear-gradient(135deg, #fff4f2 0%, #fff9f8 100%);
	border: 1px solid #ffd9d4;
}

.error-icon {
	width: 34px;
	height: 34px;
	border-radius: 50%;
	background: #ef2f10;
	color: #fff;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	font-weight: 700;
	line-height: 1;
	box-shadow: 0 6px 16px rgba(239, 47, 16, 0.28);
}

.error-copy {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.error-title,
.error-subtitle {
	margin: 0;
}

.error-title {
	color: #2f3440;
	font-size: 16px;
	font-weight: 700;
}

.error-subtitle {
	color: #d93a2f;
	font-size: 13px;
	line-height: 1.5;
}

.error-count {
	margin-left: auto;
	height: 28px;
	padding: 0 10px;
	border-radius: 999px;
	background: #fff;
	border: 1px solid #ffd0ca;
	color: #d93a2f;
	font-size: 12px;
	font-weight: 600;
	display: inline-flex;
	align-items: center;
	white-space: nowrap;
}

.error-list {
	margin-top: 14px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	max-height: 230px;
	overflow: auto;
	padding-right: 4px;
}

.error-row {
	min-height: 48px;
	padding: 10px 12px;
	border-radius: 10px;
	background: #fff7f6;
	border: 1px solid #ffe3df;
	border-left: 4px solid #ff675b;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.error-main {
	display: flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
}

.error-index {
	width: 22px;
	height: 22px;
	border-radius: 50%;
	background: #ffe0dc;
	color: #d93a2f;
	font-size: 12px;
	font-weight: 700;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 22px;
}

.error-label {
	color: #3a4354;
	font-size: 14px;
	font-weight: 500;
}

.error-message {
	color: #ef3f33;
	font-size: 13px;
	font-weight: 500;
	text-align: right;
}

.error-empty {
	margin-top: 14px;
	height: 120px;
	border-radius: 10px;
	border: 1px dashed #d7dbe4;
	color: #8d95a3;
	font-size: 13px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}

.ghost-btn,
.primary-btn {
	min-width: 88px;
	height: 34px;
	border-radius: 8px;
}

.ghost-btn {
	border-color: #bcd7f7;
	color: #409eff;
	background: #ecf5ff;
}

.primary-btn {
	background: #409eff;
	border-color: #409eff;
}

@media (max-width: 680px) {
	:deep(.error-dialog .el-dialog) {
		width: calc(100vw - 24px) !important;
		margin: 8vh auto 0;
	}

	:deep(.error-dialog .el-dialog__header) {
		padding: 16px 16px 0;
	}

	:deep(.error-dialog .el-dialog__body) {
		padding: 12px 16px 8px;
	}

	:deep(.error-dialog .el-dialog__footer) {
		padding: 10px 16px 16px;
	}

	.error-summary {
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.error-count {
		margin-left: 48px;
	}

	.error-row {
		padding: 10px 14px;
		align-items: flex-start;
		flex-direction: column;
	}

	.error-message {
		text-align: left;
	}
}
</style>
