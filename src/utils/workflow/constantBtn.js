/**审批按钮lable-value */
export const approvalButtonEnum = Object.freeze({
  preview: 0, // 预览
  submit: 1, // 提交
  resubmit: 2, // 重新提交
  agree: 3, // 同意
  noAgree: 4, // 不同意/拒绝
  repulsePrev: 6, // 退回上节点修改
  invalid: 7, // 作废
  print: 8, // 打印
  undertake: 10, // 承办
  changeApprove: 11, // 变更处理人
  terminate: 12, // 终止
  forward: 15, // 转发
  repulse: 18, // 退回
  addApproval: 19, // 加批
  transfer: 21, // 转办
  selectApprove: 22, // 自选审批人
  backToAnyNode: 23, // 退回任意节点
  currentNodeReduceSign: 24, // 当前节点减签
  currentNodeAddSign: 25, // 当前节点加签
  futureNodeChangeApprove: 26, // 未来节点变更处理人
  futureNodeReduceSign: 27, // 未来节点减签
  futureNodeAddSign: 28, // 未来节点加签
  withdraw: 29, // 流程撤回
  inApproval: 99, // 处理中
  completed: 100, // 已完成
});

const buttonMetaByKey = {
  preview: { label: "预览", color: "info" },
  submit: { label: "提交", color: "primary" },
  resubmit: { label: "重新提交", color: "primary" },
  agree: { label: "同意", color: "success" },
  noAgree: { label: "不同意", color: "danger" },
  repulsePrev: { label: "退回上节点修改", color: "danger" },
  invalid: { label: "作废", color: "danger" },
  print: { label: "打印", color: "primary" },
  undertake: { label: "承办", color: "primary" },
  changeApprove: { label: "当前节点变更处理人", color: "warning" },
  terminate: { label: "终止", color: "danger" },
  forward: { label: "转发", color: "primary" },
  repulse: { label: "退回", color: "danger" },
  addApproval: { label: "加批", color: "primary" },
  transfer: { label: "转办", color: "primary" },
  selectApprove: { label: "自选审批人", color: "primary" },
  backToAnyNode: { label: "退回任意节点", color: "warning" },
  currentNodeReduceSign: { label: "当前节点减签", color: "warning" },
  currentNodeAddSign: { label: "当前节点加签", color: "warning" },
  futureNodeChangeApprove: { label: "未来节点变更处理人", color: "warning" },
  futureNodeReduceSign: { label: "未来节点减签", color: "warning" },
  futureNodeAddSign: { label: "未来节点加签", color: "warning" },
  withdraw: { label: "流程撤回", color: "danger" },
  inApproval: { label: "处理中", color: "success" },
  completed: { label: "已完成", color: "info" },
};

const createButtonOption = (enumKey, extra = {}) => ({
  value: approvalButtonEnum[enumKey],
  label: buttonMetaByKey[enumKey]?.label || enumKey,
  ...extra,
});

// 根据 approvalButtonEnum 自动生成按钮文案，减少手工硬编码 & 避免与枚举脱节
export const buttonLabelMap = Object.entries(buttonMetaByKey).reduce((acc, [enumKey, meta]) => {
  acc[approvalButtonEnum[enumKey]] = meta.label;
  return acc;
}, {});

/**
 * 流程设计审批按钮显示
 */
export const approvalPageButtons = [
  createButtonOption("agree", {
    description: "审批通过，流转到下一个节点",
    type: "default",
  }),
  createButtonOption("noAgree", {
    description: "当不同意任务时，当前任务被终止，并结束整个流程",
    type: "default",
  }),
  createButtonOption("repulse", {
    description: "退回到(发起人或任意节点)，流程重新开始或者回到当前审批人",
  }),
  createButtonOption("transfer", {
    description: "显示【转办】，转办选择审批人，转办后自己将不再进行审批",
  }),
  createButtonOption("addApproval", {
    description:
      "在当前任务上额外添加新人员，以处理相关事项或提供必要的审批或意见",
  }),
];
export const startPageButtons = [
  createButtonOption("submit", { type: "default" }),
  createButtonOption("resubmit", { type: "default" }),
  createButtonOption("terminate"),
];
export const viewPageButtons = [
  createButtonOption("preview", { type: "default" }),
  createButtonOption("print"),
  createButtonOption("forward"),
];

/**审批按钮颜色显示 */
export const approveButtonColor = Object.entries(buttonMetaByKey).reduce((acc, [enumKey, meta]) => {
  acc[approvalButtonEnum[enumKey]] = meta.color;
  return acc;
}, {});
