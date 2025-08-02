<!--
 * @Date: 2023-03-15 14:44:17
 * @LastEditors: LDH 574427343@qq.com
 * @LastEditTime: 2023-05-24 15:20:48
 * @FilePath: /flow-designer/src/components/drawer/conditionDrawer.vue
-->

<template>
    <el-drawer :append-to-body="true" title="条件设置" v-model="visible" class="set_condition" :show-close="false"
        :size="680" :before-close="saveCondition">
        <template #header="{ titleId, titleClass }">
            <h3 :id="titleId" :class="titleClass">条件设置</h3>
            <select v-model="PriorityLevel" class="priority_level">
                <option v-for="item in conditionsConfig.conditionNodes.length" :value="item" :key="item">优先级{{ item }}
                </option>
            </select>
        </template>
        <div class="drawer_content">
            <div class="condition_content">
                <p class="tip">当审批单同时满足以下条件时进入此流程</p>
                <ul>
                    <li v-for="(item, index) in conditionConfig.conditionList" :key="index">
                        <span class="ellipsis">{{ item.type == 1 ? '发起人' : item.showName }}：</span>
                        <div v-if="item.type == 1">
                            <p :class="conditionConfig.nodeApproveList.length > 0 ? 'selected_list' : ''"
                                @click.self="addConditionRole" style="cursor:text">
                                <span v-for="(item1, index1) in conditionConfig.nodeApproveList" :key="index1">
                                    {{ item1.name }}<img src="@/assets/images/add-close1.png"
                                        @click="$func.removeEle(conditionConfig.nodeApproveList, item1, 'targetId')">
                                </span>
                                <input type="text" placeholder="请选择具体人员/角色/部门"
                                    v-if="conditionConfig.nodeApproveList.length == 0" @click="addConditionRole">
                            </p>
                        </div>
                        <div v-else-if="item.columnType == 'String' && item.showType == 3">
                            <p class="check_box">
                                <a :class="$func.toggleStrClass(item, item1.key) && 'active'"
                                    @click="toStrChecked(item, item1.key)"
                                    v-for="(item1, index1) in JSON.parse(item.fixedDownBoxValue)" :key="index1">{{
                                        item1.value
                                    }}</a>
                            </p>
                        </div>
                        <div v-else-if="item.columnType == 'String' && item.showType == 2">
                            <p v-if="item.fixedDownBoxValue">
                                <el-select :placeholder="'请选择' + item.showName" v-model="item.zdy1"
                                    style="width:400px;margin-right:10px;">
                                    <el-option v-for="itemOpt in JSON.parse(item.fixedDownBoxValue)" :key="itemOpt.key"
                                        :label="itemOpt.value" :value="itemOpt.key" />
                                </el-select>
                            </p>
                        </div>
                        <div v-else>
                            <p>
                                <el-select :style="'width:' + (item.optType == 6 ? 400 : 100) + 'px;margin-right:10px;'"
                                    @change="changeOptType(item)" v-model="item.optType">
                                    <el-option v-for="itemOpt in optTypes" :key="itemOpt.value" :label="itemOpt.label"
                                        :value="itemOpt.value" />
                                </el-select>
                                <el-input v-if="item.optType != 6" style="width:230px;"
                                    :placeholder="'请输入' + item.showName" v-model="item.zdy1" />
                            </p>
                            <p v-if="item.optType == 6">
                                <el-input style="width:90px;" v-model="item.zdy1" />
                                <el-select style="width:60px;" v-model="item.opt1">
                                    <el-option v-for="itemOpt in opt1s" :key="itemOpt.value" :label="itemOpt.label"
                                        :value="itemOpt.value" />
                                </el-select>
                                <strong class="ellipsis">{{
                                    item.showName }}</strong>
                                <el-select style="width:60px;" v-model="item.opt1">
                                    <el-option v-for="itemOpt in opt1s" :key="itemOpt.value" :label="itemOpt.label"
                                        :value="itemOpt.value" />
                                </el-select>
                                <el-input style="width:90px;" v-model="item.zdy2" />
                            </p>
                        </div>
                        <a v-if="item.type == 1"
                            @click="conditionConfig.nodeApproveList = []; $func.removeEle(conditionConfig.conditionList, item, 'formId')">
                            <i class="flowicon flowicon-delete" style="color: #f00;"></i>
                        </a>
                        <a v-if="item.type == 2"
                            @click="$func.removeEle(conditionConfig.conditionList, item, 'formId')">
                            <i class="flowicon flowicon-delete" style="color: #f00;"></i>
                        </a>
                    </li>
                </ul>
                <el-button type="primary" @click="addCondition">添加条件</el-button>
                <el-dialog title="选择条件" v-model="conditionVisible" :width="480" append-to-body class="condition_list">
                    <p>请选择用来区分审批流程的条件字段</p>
                    <p class="check_box">
                        <template v-for="(item, index) in conditions" :key="index">
                            <a :class="$func.toggleClass(conditionList, item, 'formId') && 'active'"
                                @click="$func.toChecked(conditionList, item, 'formId')">{{ item.showName }}</a>
                            <br v-if="(index + 1) % 3 == 0" />
                        </template>
                    </p>
                    <template #footer>
                        <el-button @click="conditionVisible = false">取 消</el-button>
                        <el-button type="primary" @click="sureCondition">确 定</el-button>
                    </template>
                </el-dialog>
            </div>
            <div class="flow-drawer__footer clear">
                <el-button type="primary" @click="saveCondition">确 定</el-button>
                <el-button @click="closeDrawer">取 消</el-button>
            </div>
        </div>
    </el-drawer>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import $func from '@/utils/index'
import { useStore } from '@/stores/index'
import { optTypes, opt1s } from '@/utils/const'
import { getConditions } from '@/api/index'
import { NodeUtils } from '@/utils/nodeUtils'

let conditionVisible = ref(false)
let conditionsConfig = ref({
    conditionNodes: [],
})
let conditionConfig = ref({})
let PriorityLevel = ref('')
let conditions = ref([])
let conditionList = ref([])
let checkedList = ref([])
let conditionRoleVisible = ref(false)

let store = useStore()
let { setCondition, setConditionsConfig } = store
let flowId = computed(() => store.flowId)
let conditionsConfig1 = computed(() => store.conditionsConfig1)
let conditionDrawer = computed(() => store.conditionDrawer)
let visible = computed({
    get() {
        return conditionDrawer.value
    },
    set() {
        closeDrawer()
    }
})
watch(conditionsConfig1, (val) => {
    conditionsConfig.value = val.value;
    PriorityLevel.value = val.value.index;
    conditionConfig.value = val.value.index
        ? conditionsConfig.value.conditionNodes[val.value.index - 1]
        : { nodeApproveList: [], conditionList: [] }
})

const changeOptType = (item) => {
    if (item.optType == 1) {
        item.zdy1 = 2;
    } else {
        item.zdy1 = 1;
        item.zdy2 = 2;
    }
}
const toStrChecked = (item, key) => {
    let a = item.zdy1 ? item.zdy1.split(",") : []
    var isIncludes = $func.toggleStrClass(item, key);
    if (!isIncludes) {
        a.push(key)
        item.zdy1 = a.toString()
    } else {
        removeStrEle(item, key);
    }
}
const removeStrEle = (item, key) => {
    let a = item.zdy1 ? item.zdy1.split(",") : []
    var includesIndex;
    a.map((item, index) => {
        if (item == key) {
            includesIndex = index
        }
    });
    a.splice(includesIndex, 1);
    item.zdy1 = a.toString()
}
const addCondition = async () => {
    conditionList.value = [];
    conditionVisible.value = true;
    let { data } = await getConditions({ flowId: flowId.value })
    conditions.value = data;
    if (conditionConfig.value.conditionList) {
        for (var i = 0; i < conditionConfig.value.conditionList.length; i++) {
            var { formId } = conditionConfig.value.conditionList[i]
            if (formId == 0) {
                conditionList.value.push({ formId: 0 })
            } else {
                conditionList.value.push(conditions.value.filter(item => { return item.formId == formId; })[0])
            }
        }
    }
}
/**选择条件后确认 */
const sureCondition = () => {
    for (var i = 0; i < conditionList.value.length; i++) {
        var { formId, showName, columnName, showType, columnType, fixedDownBoxValue } = conditionList.value[i];
        if ($func.toggleClass(conditionConfig.value.conditionList, conditionList.value[i], "formId")) {
            continue;
        }
        const judgeObj = NodeUtils.createJudgeNode(formId, 2, showName, showType, columnName, columnType, fixedDownBoxValue);
        if (formId == 0) {
            conditionConfig.value.nodeApproveList = [];
            conditionConfig.value.conditionList.push({ formId: formId, type: 1, showName: '发起人' });
        } else {
            conditionConfig.value.conditionList.push(judgeObj)
        }
    }

    for (let i = conditionConfig.value.conditionList.length - 1; i >= 0; i--) {
        if (!$func.toggleClass(conditionList.value, conditionConfig.value.conditionList[i], "formId")) {
            conditionConfig.value.conditionList.splice(i, 1);
        }
    }
    conditionConfig.value.conditionList.sort(function (a, b) { return a.formId - b.formId; });
    conditionVisible.value = false;
}
/**条件抽屉的确认 */
const saveCondition = () => {
    closeDrawer()
    var a = conditionsConfig.value.conditionNodes.splice(PriorityLevel.value - 1, 1)//截取旧下标
    conditionsConfig.value.conditionNodes.splice(conditionConfig.value.priorityLevel - 1, 0, a[0])//填充新下标
    conditionsConfig.value.conditionNodes.map((item, index) => {
        item.priorityLevel = index + 1
    });
    for (var i = 0; i < conditionsConfig.value.conditionNodes.length; i++) {
        conditionsConfig.value.conditionNodes[i].error = $func.conditionStr(conditionsConfig.value, i) == "请设置条件" && i != conditionsConfig.value.conditionNodes.length - 1
        conditionsConfig.value.conditionNodes[i].nodeDisplayName = $func.conditionStr(conditionsConfig.value, i);
    }
    setConditionsConfig({
        value: conditionsConfig.value,
        flag: true,
        id: conditionsConfig1.value.id
    })
}
const addConditionRole = () => {
    conditionRoleVisible.value = true;
    checkedList.value = conditionConfig.value.nodeApproveList
}
const sureConditionRole = (data) => {
    conditionConfig.value.nodeApproveList = data;
    conditionRoleVisible.value = false;
}
const closeDrawer = (val) => {
    setCondition(false)
}
</script>
<style lang="css" scoped>
ul,
li {
    list-style: none;
}

.set_condition .priority_level {
    position: absolute;
    top: 11px;
    right: 30px;
    width: 100px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
    font-size: 12px;
}

.set_condition .condition_content {
    padding: 20px 20px 0;
    flex: 1 !important;
}

.set_condition .el-button {
    margin-bottom: 20px;
}

.set_condition p.tip {
    margin: 20px 0;
    width: 100%;
    text-indent: 17px;
    line-height: 45px;
    background: rgba(241, 249, 255, 1);
    border: 1px solid rgba(64, 163, 247, 1);
    color: #46a6fe;
    font-size: 14px;
}

.set_condition ul {
    max-height: 500px;
    overflow-y: scroll;
    margin-bottom: 20px;
}

.set_condition ul li {
    line-height: 25px;
}

.set_condition ul li span {
    float: left;
    margin-right: 8px;
    width: 150px !important;
    text-align: right;
    color: #0857a1;
}

.set_condition ul li div {
    display: inline-block;
}

.set_condition ul li div p:not(:last-child) {
    margin-bottom: 10px;
}

.set_condition ul li:not(:last-child)>div>p {
    margin-bottom: 20px;
}

.set_condition ul li p.selected_list {
    padding-left: 10px;
    border-radius: 4px;
    min-height: 32px;
    border: 1px solid rgba(217, 217, 217, 1);
    word-break: break-word;
}

.condition_list .el-dialog__body {
    padding: 16px 26px;
}

.condition_list p {
    color: #666666;
    margin-bottom: 10px;
}

.condition_list p.check_box {
    margin-bottom: 0;
    line-height: 30px;
}
</style>