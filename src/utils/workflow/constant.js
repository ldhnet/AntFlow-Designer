export const NodeType = Object.freeze({
  StartNode: 1, //开始节点
  GatewayNode: 2, //条件网关
  ConditionNode: 3, // 条件节点
  ApproveNode: 4, // 审批人
  ParallelApproveWayNode: 5, // 并行审核网关
  CopyNode: 6, // 抄送人
  ParallelApproveNode: 7, // 并行审核人
});
export const placeholderList = Object.freeze({
  [NodeType.StartNode]: "发起人",
  [NodeType.GatewayNode]: "条件",//网关
  [NodeType.ConditionNode]: "条件",
  [NodeType.ApproveNode]: "审核人",
  [NodeType.ParallelApproveWayNode]: "并行审核人",//网关
  [NodeType.CopyNode]: "抄送人",
  [NodeType.ParallelApproveNode]: "并行审核人",
});

export let optTypes = [
  { value: 1, label: "小于" },
  { value: 2, label: "大于" },
  { value: 3, label: "小于等于" },
  { value: 4, label: "等于" },
  { value: 5, label: "大于等于" },
  { value: 6, label: "介于两个数之间" },
];

export let opt1s = [
  { value: "<", label: "<" },
  { value: "≤", label: "≤" },
];

/**
 * 自定义表单路径与processKey映射
 */
export const bizFormMaps = new Map([
  ["DSFZH_WMA", "/forms/form1.vue"],
  ["LEAVE_WMA", "/forms/form2.vue"],
  ["UCARREFUEl_WMA", "/forms/form3.vue"],
  ["PURCHASE_WMA", "/forms/form4.vue"],
  ["BXSP_WMA", "/forms/form5.vue"],
]);

export const messageSendTypeList = [
  {
    active: false,
    id: 1,
    name: "邮件",
  },
  {
    active: false,
    id: 2,
    name: "短信",
  },
  {
    active: false,
    id: 3,
    name: "app推送",
  },
  {
    active: false,
    id: 5,
    name: "企微",
  },
  {
    active: false,
    id: 6,
    name: "钉钉",
  },
  {
    active: false,
    id: 7,
    name: "飞书",
  },
];

/**
 * 1、控件对应后端api的判断类型
 * 2、用于条件节点 对接 流程引擎中 条件判断
 * 3、与后端约定的值
 */
export const condition_columnTypeMap = new Map([
  ["input", "10000"], //"int/fload/double/string" input
  ["number", "10001"], //"Double"
  ["select", "10000"], //"string" select
  ["checkbox", "10004"], //"string" checkbox
  ["radio", "10001"],
  ["switch", "10001"],
  ["time", "10002"],
  ["time-range", "10003"],
  ["data-range", "10002"],
  ["date", "10002"],
]);

/**
 * 1、控件是在条件节点 选择条件时候否显示
 * 2、对应后端数据解析
 * Mapping: 1-string 2-int 3-date 4-time 5-text/长字符串 6-boolean 7-二进制/byte
 * 与后端约定的值
 */
export const condition_filedTypeMap = new Map([
  ["input", "1"], //"String"
  ["number", "4"], //"time"
  ["select", "2"], //"int" select
  ["checkbox", "1"], //"String" checkbox
  //['radio', '2'], //  int radio
  ["switch", "6"], // boolean switch
  ["time", "1"],
  // ['time-range', '1'],
  // ['data-range', '1'],
  ["date", "1"],
]);
/**
 * 判断控件的值的类型
 * 对应如何在表中存储
 * 与后端约定的值
 */
export const condition_filedValueTypeMap = new Map([
  ["input", "String"], //"Double"
  ["number", "String"], //"Double"
  ["select", "Int"], //"Int" select
  ["checkbox", "String"], //checkbox 对应 VForm 是Array
  ["radio", "Int"],
  ["switch", "Boolean"],
  ["time", "String"],
  ["time-range", "String"],
  ["data-range", "String"],
  ["date", "String"],
]);
