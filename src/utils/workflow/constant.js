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
  [NodeType.GatewayNode]: "条件", //网关
  [NodeType.ConditionNode]: "条件",
  [NodeType.ApproveNode]: "审核人",
  [NodeType.ParallelApproveWayNode]: "并行审核人", //网关
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
