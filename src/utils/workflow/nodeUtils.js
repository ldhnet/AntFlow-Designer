//import {  NodeUtils } from '@/utils/nodeUtils'

import { version } from "vue";
import { NodeType as NodeTypeEnum } from "@/utils/workflow/constant.js";
export class NodeUtils {
  /**
   * 根据自增数生成64进制id
   * @returns 64进制id字符串
   */
  static idGenerator() {
    let qutient = new Date() - new Date("2024-05-01");
    qutient += Math.ceil(Math.random() * 1000); // 防止重複
    const chars =
      "0123456789ABCDEFGHIjKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charArr = chars.split("");
    const radix = chars.length;
    const res = [];
    do {
      let mod = qutient % radix;
      qutient = (qutient - mod) / radix;
      res.push(charArr[mod]);
    } while (qutient);
    return res.join("").toUpperCase();
  }
  /**
   * 初始化流程数据
   * @returns object
   */
  static initNode() {
    const initNodesObj = {
      name: "请假申请流程",
      key: "BIZ_RTWHMN",
      flowCode: "BIZ_QA",
      frmType: 1,
      frmValue:
        '{"widgetList":[],"formConfig":{"modelName":"formData","refName":"vForm","rulesName":"rules","labelWidth":80,"labelPosition":"left","size":"","labelAlign":"label-left-align","cssCode":"","customClass":[],"functions":"","layoutType":"PC","jsonVersion":3,"onFormCreated":"","onFormMounted":"","onFormDataChange":""}}',
      frmUrl: "",
      distinctType: 1,
      isActive: true,
      version: "1.0",
      Remark: "",
      formData: null,
      nodes: [
        {
          nodeId: "Gb2",
          nodeName: "发起人",
          nodeDisplayName: "发起人",
          nodeType: NodeTypeEnum.StartNode,
          nodeFrom: "",
          nodeTo: ["4FIHMN"],
          nodeWeight: 0,
          nodeProperty: null,
          error: false,
        },
      ],
    };
    return initNodesObj;
  }
  static createBaseNode({
    nodeName = "",
    nodeDisplayName = nodeName,
    nodeType,
    nodeFrom = "",
    nodeTo = [],
    nodeWeight = 0,
    childNode = null,
    error = true,
  }) {
    return {
      nodeId: this.idGenerator(),
      nodeName,
      nodeDisplayName,
      nodeType,
      nodeFrom,
      nodeTo,
      nodeWeight,
      childNode,
      error,
    };
  }
  /**
   * 创建审批人对象
   */
  static createApproveBaseNode({ nodeType, childNode }) {
    const approveNode = {
      ...this.createBaseNode({
        nodeName: "审核人",
        nodeDisplayName: "审核人",
        nodeType: nodeType || NodeTypeEnum.ApproveNode,
        childNode: childNode,
      }),
      nodeProperty: {
        assigneeType: 1,
        signType: 1,
        noHeaderAction: 1,
        directorLevel: 0, //主管层级 1、直属主管 2、上级主管 3、最高主管
        IsDistinct: 0, //是否去重 1、去重 0、不去重
        sort: 0,
        assigneeList: [],
        fieldPrems: [], //字段权限
        buttons: {
          startPage: [1],
          approvalPage: [3, 4],
          viewPage: [0],
        },
      },
    };
    return approveNode;
  }
  /**
   * 创建审批人对象
   */
  static createApproveNode(child) {
    const approveNode = {
      ...this.createApproveBaseNode({
        nodeType: NodeTypeEnum.ApproveNode,
        childNode: child,
      }),
    };
    return approveNode;
  }
  /**
   * 创建并行审批人对象
   */
  static createParallelApproveNode(child) {
    const approveNode = {
      ...this.createApproveBaseNode({
        nodeType: NodeTypeEnum.ParallelApproveNode,
        childNode: child,
      }),
    };
    return approveNode;
  }

  /**
   * 创建并行网关对象
   * @returns object
   */
  static createParallelWayNode(child) {
    const parallelwayNode = {
      ...this.createBaseNode({
        nodeName: "并行审核网关",
        nodeType: NodeTypeEnum.ParallelApproveWayNode,
        nodeWeight: 1,
        childNode: this.createParallelApproveNode(null),
        error: false,
      }),
      nodeProperty: {
        parallelNodes: [
          this.createParallelApproveNode(child),
          this.createParallelApproveNode(null),
        ],
        assigneeType: 1,
        signType: 1,
        noHeaderAction: 1,
        directorLevel: 0, //主管层级 1、直属主管 2、上级主管 3、最高主管
        IsDistinct: 0, //是否去重 1、去重 0、不去重
        sort: 0,
        assigneeList: [],
        fieldPrems: [], //字段权限
        buttons: {
          startPage: [1],
          approvalPage: [3, 4],
          viewPage: [0],
        },
      },
    };
    return parallelwayNode;
  }

  /**
   * 创建抄送人对象
   * @returns object
   */
  static createCopyNode(child) {
    const copyNode = {
      ...this.createBaseNode({
        nodeName: "抄送人",
        nodeDisplayName: "抄送人",
        nodeType: NodeTypeEnum.CopyNode,
        childNode: child,
      }),
      nodeProperty: {
        assigneeType: 1,
        ccFlag: 0,
        fieldPrems: [], //字段权限
        assigneeList: [],
        buttons: {
          startPage: [],
          approvalPage: [],
          viewPage: [],
        },
      },
    };
    return copyNode;
  }
  /**
   * 创建网关对象
   * @returns object
   */
  static createGatewayNode(child) {
    const gatewayNode = {
      ...this.createBaseNode({
        nodeName: "网关",
        nodeType: NodeTypeEnum.GatewayNode,
        nodeWeight: 1,
        error: false,
      }),
      nodeProperty: {
        groupRelation: false, //审批组关系 true 且 false 或
        isDefault: 0, //是否默认分支 1、默认 0、非默认
        sort: 0,
        conditionNodes: [
          this.createConditionNode("条件1", child, 1, 0),
          this.createConditionNode("默认条件分支", null, 2, 1),
        ],
      },
    };
    return gatewayNode;
  }
  /**
   * 创建动态网关对象
   * @returns object
   */
  static createDynamicConditionWayNode(child) {
    const dynamicGatewayNode = {};
    return dynamicGatewayNode;
  }
  /**
   * 创建条件并行网关对象
   * @returns object
   */
  static createParallelConditionWayNode(child) {
    const gatewayNode = {};
    return gatewayNode;
  }
  /**
   * 创建条件对象
   * @returns object
   */
  static createConditionNode(name, childNode, nodeWeight, isDefault) {
    const conditionNode = {
      ...this.createBaseNode({
        nodeName: name || "条件1",
        nodeDisplayName: name || "条件1",
        nodeType: NodeTypeEnum.ConditionNode,
        nodeWeight,
        childNode: childNode,
        error: isDefault !== 1,
      }),
      nodeProperty: {
        groupRelation: false, //审批组关系 true 且 false 或
        isDefault: isDefault || 0,
        groupConditions: [
          {
            groupId: "groupid1",
            condRelation: true, //条件关系 true 且 false 或
            sort: 0,
            conditionList: [],
          },
        ],
      },
    };
    return conditionNode;
  }

  /**
   * 条件判断对象
   * @param {*} key 字段key
   * @param {*} label 显示名称.
   * @param {*} type 字段类型
   * @param {*} columnDbName  DB字段名称
   * @param {*} columnType  DB字段类型
   * @param {*} fixedDownBoxValue 条件选项
   * @returns
   */
  static createJudgeNode(
    key,
    label,
    type,
    columnDbName,
    columnType,
    fixedDownBoxValue,
  ) {
    const judgeNode = {
      key: key,
      label: label,
      type: type,
      optType: "=",
      zdy1: "",
      opt1: "<",
      zdy2: "",
      opt2: "<",
      columnDbName: columnDbName,
      columnType: columnType,
      fixedDownBoxValue: fixedDownBoxValue,
    };
    return judgeNode;
  }
}

/**
 * 添模拟数据
 */
export function getMockData() {
  const startNode = ""; //NodeUtils.createNode("start", "");
  return startNode;
}
