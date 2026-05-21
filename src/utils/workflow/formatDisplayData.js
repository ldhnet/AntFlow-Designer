import { NodeType as NodeTypeEnum } from "@/utils/workflow/constant.js";
const isEmpty = (data) => data === null || data === undefined || data === "";
const isEmptyArray = (data) => (Array.isArray(data) ? data.length === 0 : true);

export class FormatDisplayUtils {
  /**
   * 格式化显示数据
   * @param {Array} parmData
   * @returns Object
   */
  static getToTree(parmData) {
    const node = this.createNodeDisplay(parmData);
    const formatList = this.formatDisplayStructNodeList(node.nodes);
    node.nodeConfig = this.depthConverterToTree(formatList);
    const { nodes, ...result } = node; //移除nodes属性
    return result;
  }

  /**
   * 创建Node Data 数据
   * @param { Object } nodeData - 源节点数据
   * @returns Object
   */
  static createNodeDisplay(nodeData) {
    const displayObj = {
      ...nodeData,
      nodeConfig: {},
    };
    return displayObj;
  }
  /**
   * List 转成tree结构
   * @param {Array} parmData
   * @returns
   */
  static depthConverterToTree(parmData) {
    if (isEmptyArray(parmData)) return;
    let nodesGroup = {},
      startNode = {};
    for (const t of parmData) {
      if (nodesGroup.hasOwnProperty(t.nodeFrom)) {
        nodesGroup[t.nodeFrom].push(t);
      } else {
        nodesGroup[t.nodeFrom] = [t];
      }
    }
    for (const node of parmData) {
      if (NodeTypeEnum.StartNode == node.nodeType) {
        startNode = node;
      }
      if (NodeTypeEnum.GatewayNode == node.nodeType) {
        Object.assign(node, { nodeProperty: { conditionNodes: [] } });
      }
      if (NodeTypeEnum.ParallelApproveWayNode == node.nodeType) {
        Object.assign(node, { nodeProperty: { parallelNodes: [] } });
      }
      const currNodeId = node.nodeId;
      if (nodesGroup.hasOwnProperty(currNodeId)) {
        const itemNodes = nodesGroup[currNodeId];
        for (const itemNode of itemNodes) {
          if (NodeTypeEnum.ConditionNode == itemNode.nodeType) {
            node.nodeProperty.conditionNodes.push(itemNode);
          } else {
            Object.assign(node, { childNode: itemNode });
            //node.childNode = itemNode;
          }
        }
      }
    }
    return startNode;
  }
  static formatDisplayStructNodeList(nodeList) {
    if (isEmptyArray(nodeList)) return nodeList;
    for (const node of nodeList) {
      if (node && node.nodeProperty) {
        if (
          !isEmpty(node.nodeProperty) &&
          typeof node.nodeProperty !== "object"
        ) {
          node.nodeProperty = JSON.parse(node.nodeProperty);
        }
      }
    }
    return nodeList;
  }
}
