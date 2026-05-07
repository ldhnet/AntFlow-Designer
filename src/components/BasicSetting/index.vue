<template>
    <div class="my-nav-content">
        <div class="form-container">
            <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto"
                style="max-width: 600px;margin: auto;">
                <el-form-item label="流程编号" prop="formCode">
                    <el-input v-model="form.formCode" disabled placeholder="请输入流程编号" :style="{ width: '100%' }" />
                </el-form-item>
                <el-form-item label="选择分组" prop="flowGroup">
                    <el-select v-model="form.flowGroup" placeholder="请选择选择分组" :style="{ width: '100%' }">
                        <el-option v-for="(item, index) in flowOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批名称" prop="bpmnName">
                    <el-input v-model="form.bpmnName" placeholder="请输入审批名称" :style="{ width: '100%' }" />
                </el-form-item>

                <el-form-item label="审批人去重" prop="deduplicationType">
                    <el-select v-model="form.deduplicationType" placeholder="请选择去重类型" :style="{ width: '100%' }">
                        <el-option v-for="(item, index) in autoRepeatOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板图标" prop="icon">
                    <img :src="activeIconSrc" style="width: 28px;height: 28px;vertical-align: middle;">
                    <el-button plain @click="dialogVisible = true" style="margin-left: 10px;">选择图标</el-button>
                </el-form-item>
                <el-form-item label="审批说明" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入审批说明" :maxlength="100"
                        show-word-limit :autosize="{ minRows: 4, maxRows: 4 }" :style="{ width: '100%' }"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="选择图标" v-model="dialogVisible" width="612px">
            <img v-for="(icon, index) in iconList" :key="index" :src="icon.src" class="icon-item"
                :class="{ active: selectedIcon === icon.id }" @click="selectedIcon = icon.id">
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false; selectedIcon = activeIcon">关 闭</el-button>
                    <el-button type="primary" @click="dialogVisible = false; activeIcon = selectedIcon">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'
import { NodeUtils } from '@/utils/nodeUtils'
const { proxy } = getCurrentInstance()
const emit = defineEmits(['nextChange'])
let props = defineProps({
    basicData: {
        type: Object,
        default: () => (null),
    }
}); 

/**
 * 匹配静态文件路径
 * @param metaUrl 
 */
 const getPath = (metaUrl) =>{
  let path = ''
  if (import.meta.env.MODE !== 'development') { 
    const metaUrlMatch = metaUrl.match(/^(.*?)\/public\//) // 匹配public前面的路径
    if (metaUrlMatch && metaUrlMatch[0]) {
          path = metaUrl.replace(metaUrlMatch[0], '/design/')
    } 
  }else{
    path = metaUrl
  } 
  return path
} 
const fileImgs  = import.meta.glob('/public/flowIcon/**/*') 
const fileImgKeys =Object.keys(fileImgs); 
const iconList = fileImgKeys.map((t, idx) => ({src: getPath(t), id: idx})) 

let dialogVisible= ref(false);
let activeIcon= ref(iconList[0].id);
let selectedIcon =ref(iconList[0].id);

const generatorID = "BIZ_" + NodeUtils.idGenerator();
const ruleFormRef = ref(null);
let autoRepeatOptions = [{
    "label": "不启用自动去重",
    "value": 1
}, {
    "label": "启用自动去重",
    "value": 2
}];
let flowOptions = [{
    "label": "总公司流程",
    "value": 1
}, {
    "label": "分公司流程",
    "value": 2
}];


const form = reactive({
    bpmnName: '合同审批',
    bpmnCode: generatorID,
    bpmnType: null,
    flowGroup: 1,
    formCode: null,
    remark: '',
    effectiveStatus: true,
    deduplicationType: 1
})

let activeIconSrc = computed(()=> {
  const icon = iconList.find(t => t.id === activeIcon.value)
  return icon ? icon.src : ''
})  
onMounted(async () => {
    if (props.basicData) {
        form.bpmnName = props.basicData.bpmnName;
        form.bpmnCode = generatorID;
        form.bpmnType = props.basicData.bpmnType;
        form.formCode = props.basicData.formCode;
        form.remark = props.basicData.remark;
        form.effectiveStatus = props.basicData.effectiveStatus;
        form.deduplicationType = props.basicData.deduplicationType;
    }
});

let rules = {
    formCode: [{
        required: true,
        message: '请输入流程编号',
        trigger: 'blur'
    }],
    bpmnName: [{
        required: true,
        message: '请输入审批名称',
        trigger: 'blur'
    }],
    flowGroup: [{
        required: true,
        message: '请选择选择分组',
        trigger: 'change'
    }],
};
const nextSubmit = (ruleFormRef) => {
    if (!ruleFormRef) return
    ruleFormRef.validate((valid, fields) => {
        if (valid) {
            emit('nextChange', { label: "流程设计", key: "processDesign" })
        }
    })
}

// 给父级页面提供得获取本页数据得方法
const getData = () => {
    return new Promise((resolve, reject) => {
        proxy.$refs['ruleFormRef'].validate((valid, fields) => {
            if (!valid) {
                emit('nextChange', { label: "基础设置", key: "basicSettingDesign" })
                return;
            }
            form.effectiveStatus = form.effectiveStatus ? 1 : 0;
            resolve({ formData: form })  // TODO 提交表单
        })
    })
};
defineExpose({
    getData
})
</script>
<style lang="css" scoped>
.icon-item {
    width: 40px;
    height: 40px;
    margin: 6px;
    position: relative;
    cursor: pointer;
    opacity: .5; 
    &.active {
        opacity: 1;
    }

    &:hover {
        opacity: 1;
    }
}
</style>