<template>
	<div class="workflow-shell">
		<header class="top-nav">
			<div class="nav-left">
				<el-button text class="back-btn" @click="handleBack">
					<el-icon>
						<ArrowLeft />
					</el-icon>
				</el-button>
				<span class="process-title">请假申请流程</span>
			</div>

			<div class="nav-steps" :class="`step-${currentStep}`" role="list" aria-label="流程步骤">
				<div class="step-active-bg" aria-hidden="true"></div>
				<div v-for="(step, index) in steps" :key="step.value" class="step-item"
					:class="{ active: currentStep === index }" @click="currentStep = index">
					<span class="step-index">{{ index + 1 }}</span>
					<span class="step-text">{{ step.label }}</span>
				</div>
			</div>

			<div class="nav-right">


				<el-tooltip content="Gitee" placement="bottom">
					<a href="https://gitee.com/ldhnet/AntFlow-Designer" target="_blank">
						<svg t="1671270284061" class="icon"
							style="background-color: #fff;border-radius:20px;margin-bottom:-6px;"
							viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1920"
							width="32" height="32">
							<path
								d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z"
								fill="#C71D23" p-id="1921"></path>
						</svg>
					</a>
				</el-tooltip>
				<el-tooltip content="GitHub" placement="bottom">
					<a style="margin-right: 40px;" href="https://github.com/ldhnet/AntFlow-Designer" target="_blank">
						<svg height="32" style="background-color: #fff;border-radius:20px;margin-bottom:-6px;"
							aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true"
							class="octicon octicon-mark-github v-align-middle">
							<path
								d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z">
							</path>
						</svg>
					</a>
				</el-tooltip>
				<el-button class="publish-btn" @click="handlePublish">发布</el-button>
			</div>
		</header>

		<section class="content-panel">
			<div v-show="currentStep === 0" class="step-page">
				<BasicSetting ref="basicSettingRef" v-if="basicSettingDataConf" :data="basicSettingDataConf" />
			</div>
			<div v-show="currentStep === 1" class="step-page">
				<DynamicForm ref="dynamicFormRef" v-if="dynamicFormDataConf" :lfFormData="dynamicFormDataConf" />
			</div>
			<div v-show="currentStep === 2" class="step-page">
				<FlowDesign ref="flowDesignRef" v-if="nodesDataConf" :data="nodesDataConf" />
			</div>
		</section>

		<ErrorDialog v-model:visible="publishErrorVisible" :items="publishErrors" @edit="handlePublishEdit" />
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import BasicSetting from "./basicSetting/index.vue";
import DynamicForm from "./dynamicForm/index.vue";
import FlowDesign from "./flowDesign/index.vue";
import ErrorDialog from "./flowDesign/drawer/dialog/errorDialog.vue";
import { FormatDisplayUtils } from '@/utils/workflow/formatDisplayData';
import { NodeUtils } from "@/utils/workflow/nodeUtils";
import { getWorkFlowData, setWorkFlowData } from "@/api/workflow/mock.js";

const steps = [
	{ value: 'basic', label: '基础设置' },
	{ value: 'form', label: '表单设计' },
	{ value: 'flow', label: '流程设计' }
]

const currentStep = ref(0)
const basicSettingRef = ref(null)
const dynamicFormRef = ref(null)
const flowDesignRef = ref(null)
const basicSettingDataConf = ref(null)
const dynamicFormDataConf = ref(null)
const nodesDataConf = ref(null)

onMounted(async () => {
	await init();
});
const init = async () => {
	// var nodeDemo = NodeUtils.initNode();
	// var workflowResult = FormatDisplayUtils.getToTree(nodeDemo);
	// const { nodeConfig, frmValue, ...restData } = workflowResult;
	// nodesDataConf.value = nodeConfig;
	// dynamicFormDataConf.value = frmValue;
	// basicSettingDataConf.value = restData;

	await getWorkFlowData().then((res) => {
		const workflowResult = FormatDisplayUtils.getToTree(res.data);
		const { nodeConfig, frmValue, ...restData } = workflowResult;
		nodesDataConf.value = nodeConfig;
		dynamicFormDataConf.value = frmValue;
		basicSettingDataConf.value = restData;
	})

	//console.log("dynamicFormDataConf.value=====", dynamicFormDataConf.value);
};
const publish = () => {
	const step1 = basicSettingRef.value.getData();
	const step2 = dynamicFormRef.value.getData();
	const step3 = flowDesignRef.value.getData();
	Promise.all([step1, step2, step3])
		.then((res) => {
			ElMessage.success("流程发布成功,F12控制台查看数据");
			const basicData = res[0].formData;
			const dynamicFormData = res[1].formData;
			const flowDesignData = res[2].formData;
			Object.assign(basicData, { frmValue: JSON.stringify(dynamicFormData) });
			Object.assign(basicData, {
				nodes: flowDesignData.map(item => {
					return { ...item, definitionKey: basicData.key || '' }
				})
			});
			return basicData;
		})
		.then((data) => {
			console.log("格式化后对接后端api================", JSON.stringify(data));
			// setWorkFlowData(data).then((resLog) => {
			// 	if (resLog.code == 200) {
			// 		console.log("提交到API返回成功");
			// 	} else {
			// 		console.log("提交到API返回失败=", JSON.stringify(resLog));
			// 	}
			// });
		})
		.catch((err) => {
			if (err) {
				console.log("设置失败" + JSON.stringify(err));
				ElMessage.error("至少配置一个有效审批人节点");
			}
		});
};

const publishErrorVisible = ref(false)
const publishErrors = ref([])
const handlePublish = () => {
	const errors = flowDesignRef.value?.validatePublish() || []
	if (errors.length > 0) {
		publishErrors.value = errors
		publishErrorVisible.value = true
		return
	} else {
		publish();
	}
}

const handlePublishEdit = () => {
	currentStep.value = 2
}

const handleBack = () => {
	ElMessage.info('返回上一页')
}

</script>

<style scoped>
.workflow-shell {
	min-height: 100vh;
	background: linear-gradient(180deg, #eef4ff 0%, #f9fbff 56%, #ffffff 100%);
}

.top-nav {
	position: sticky;
	top: 0;
	z-index: 30;
	height: 65px;
	display: grid;
	grid-template-columns: minmax(160px, 260px) minmax(420px, 1fr) auto;
	align-items: center;
	gap: 16px;
	padding: 0 18px;
	background: linear-gradient(90deg, #2d82da 0%, #3f97eb 100%);
	box-shadow: 0 6px 16px rgba(34, 101, 189, 0.24);
	overflow-x: auto;
	overflow-y: hidden;
}

.nav-left {
	display: flex;
	align-items: center;
	gap: 6px;
	color: #fff;
	white-space: nowrap;
}

.back-btn {
	color: #d6e9ff;
	padding: 6px;
}

.process-title {
	font-size: 18px;
	font-weight: 600;
	letter-spacing: 0.5px;
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.nav-steps {
	position: relative;
	width: min(480px, 100%);
	min-width: 420px;
	height: 65px;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	align-items: stretch;
	overflow: hidden;
}

.step-active-bg {
	position: absolute;
	left: 0;
	top: 0;
	width: calc(100% / 3);
	height: 100%;
	background: rgba(76, 118, 230, 0.36);
	transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.nav-steps.step-1 .step-active-bg {
	transform: translateX(100%);
}

.nav-steps.step-2 .step-active-bg {
	transform: translateX(200%);
}

.step-active-bg::after {
	content: '';
	position: absolute;
	left: 50%;
	bottom: -1px;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 7px solid transparent;
	border-right: 7px solid transparent;
	border-bottom: 8px solid #dfe7f6;
}

.step-item {
	position: relative;
	z-index: 1;
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 6px;
	cursor: pointer;
	transition: color 0.22s;
}

.step-index {
	width: 24px;
	height: 24px;
	border-radius: 50%;
	border: 1px solid #ffffff;
	color: #fff;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	line-height: 1;
	background: rgba(255, 255, 255, 0.08);
	transition: background-color 0.22s;
}

.step-text {
	color: #fff;
	font-size: 25px;
	transform: scale(0.56);
	transform-origin: left center;
	font-weight: 500;
	line-height: 1;
	white-space: nowrap;
	transition: opacity 0.22s;
}

.step-item.active .step-index {
	background: rgba(255, 255, 255, 0.24);
}

.nav-right {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 10px;
	white-space: nowrap;
}

.publish-btn {
	min-width: 82px;
	color: #2f87df;
	background: #f4f8ff;
	border: none;
	border-radius: 6px;
	font-weight: 600;
}

.content-panel {
	position: relative;
}

.step-page {
	width: 100%;
}


@media (max-width: 1100px) {
	.top-nav {
		height: 56px;
		grid-template-columns: minmax(120px, 200px) minmax(360px, 1fr) auto;
		gap: 10px;
		padding: 0 12px;
	}

	.nav-left {
		min-width: 0;
	}

	.nav-right {
		justify-content: flex-end;
		gap: 8px;
	}

	.process-title {
		font-size: 16px;
		max-width: 160px;
	}

	.nav-steps {
		width: min(520px, 100%);
		min-width: 360px;
		height: 56px;
		border-radius: 4px;
		overflow: hidden;
	}

	.step-active-bg::after {
		bottom: -1px;
	}

	.step-text {
		font-size: 25px;
		transform: scale(0.52);
	}
}

@media (max-width: 860px) {
	.top-nav {
		height: 56px;
		row-gap: 6px;
		overflow: hidden;
	}

	.brand-btn {
		display: none;
	}

	.publish-btn {
		min-width: 72px;
		height: 30px;
		padding: 0 14px;
	}

	.nav-steps {
		height: 56px;
	}

	.step-item {
		gap: 4px;
	}

	.step-index {
		width: 20px;
		height: 20px;
		font-size: 12px;
	}

	.step-text {
		font-size: 25px;
		transform: scale(0.5);
	}
}

@media (max-width: 560px) {
	.top-nav {
		/* padding: 6px 8px 8px; */
		overflow: hidden;
	}

	.back-btn {
		padding: 4px;
	}

	.nav-steps {
		height: 56px;
	}

	.step-text {
		font-size: 25px;
	}
}
</style>
