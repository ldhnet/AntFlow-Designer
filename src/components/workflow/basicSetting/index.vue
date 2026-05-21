<template>
	<section class="basic-setting-page">
		<div class="basic-setting-wrap">
			<el-form ref="formRef" :model="basicForm" :rules="rules" label-position="right" label-width="90px"
				class="setting-form">
				<el-form-item label="流程编号" prop="flowCode" required>
					<el-input v-model="basicForm.flowCode" disabled />
				</el-form-item>

				<el-form-item label="选择分组" prop="groupId" required>
					<el-select v-model="basicForm.groupId" class="full-width" placeholder="请选择分组">
						<el-option label="总公司流程" value="root-group" />
						<el-option label="分公司流程" value="branch-group" />
					</el-select>
				</el-form-item>

				<el-form-item label="审批名称" prop="name" required>
					<el-input v-model="basicForm.name" placeholder="请输入审批名称" maxlength="20" />
				</el-form-item>

				<el-form-item label="审批人去重" prop="distinctType">
					<el-select v-model="basicForm.distinctType" class="full-width">
						<el-option label="不启去重" value="0" />
						<el-option label="前去重" value="1" />
						<el-option label="后去重" value="2" />
					</el-select>
				</el-form-item>

				<el-form-item label="模板图标" prop="flowIcon">
					<div class="icon-row">
						<span class="icon-preview">★</span>
						<el-button plain @click="selectIcon">选择图标</el-button>
					</div>
				</el-form-item>

				<el-form-item label="审批说明" prop="remark">
					<el-input v-model="basicForm.remark" type="textarea" :rows="4" maxlength="100" show-word-limit
						placeholder="请输入审批说明" />
				</el-form-item>
			</el-form>
		</div>
	</section>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getRandomUniqueCode } from '@/utils/workflow/commonUtils'
let props = defineProps({
	data: {
		type: Object,
		default: () => ({})
	}
});
const formRef = ref(null)
const basicForm = reactive({})
watch(() => props.data, (value) => {
	const defkey = value.flowCode + getRandomUniqueCode(); // 确保每个流程都有唯一的key
	Object.assign(basicForm, { ...(value || {}), key: defkey })
}, { immediate: true, deep: true })
const rules = {
	flowCode: [{ required: true, message: '请输入流程编号', trigger: 'blur' }],
	name: [{ required: true, message: '请输入审批名称', trigger: 'blur' }]
}

const selectIcon = () => {
	ElMessage.info('图标选择面板开发中')
}

// 给父级页面提供得获取本页数据得方法
const getData = () => {
	try {
		return Promise.resolve({ formData: { ...basicForm } })
	} catch (err) {
		return Promise.reject(new Error('获取基础表单数据失败'))
	}
}

defineExpose({
	getData
})
</script>

<style scoped>
.basic-setting-page {
	min-height: 100%;
	padding: 0 64px;
}

.basic-setting-wrap {
	min-height: calc(100vh - 74px);
	max-width: 760px;
	min-width: 320px;
	margin: 0 auto;
	padding: 26px 64px;
	background: #fff;
	box-sizing: border-box;
}

.setting-form {
	max-width: 520px;
	margin: 0 auto;
}

.full-width {
	width: 100%;
}

.icon-row {
	display: flex;
	align-items: center;
	gap: 10px;
}

.icon-preview {
	width: 26px;
	height: 26px;
	border-radius: 2px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	font-size: 13px;
	background: #45c97a;
}

:deep(.el-form-item) {
	margin-bottom: 16px;
}

:deep(.el-form-item__label) {
	color: #4f5b6f;
	font-size: 15px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select__wrapper) {
	background: #ffffff;
	box-shadow: 0 0 0 1px #d9dde5 inset;
	border-radius: 2px;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
	background: #eef1f5;
	box-shadow: 0 0 0 1px #d9dde5 inset;
}

:deep(.el-textarea .el-input__count) {
	background: transparent;
	right: 8px;
	color: #7d8797;
}

@media (max-width: 900px) {
	.basic-setting-page {
		padding: 0 10px;
	}

	.basic-setting-wrap {
		padding: 16px 12px;
	}

	.setting-form {
		max-width: 100%;
	}
}
</style>