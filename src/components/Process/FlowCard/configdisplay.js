export default {
  start: {
    type: "start",
    content: "所有人",
    properties: { title: '发起人', initiator: 'ALL' }
  },
  approver: {
    type: "approver",
    content: "请设置审批人",
    properties: { title: '审批人',approvers: [] }

  },
  copy:{
    type: 'copy',
    content: '发起人自选',
    properties: {
      title: '抄送人',
      menbers: [],
      userOptional: true
    }
  },
  condition: {
    type: "condition",
    content: "请设置条件",
    properties: { title: '条件', conditions: [], initiator: null,priority:0 }
  },
  branch: { type: "branch", content: "", properties: {} },
  empty: { type: "empty", content: "", properties: {} },
  gateway: { type: "gateway", content: "网关节点", properties: {} }
}