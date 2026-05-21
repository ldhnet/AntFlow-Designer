import { NodeType } from "@/utils/workflow/constant.js";
// import { NodeUtils } from '@/utils/nodeUtils'
const isEmpty = (data) => data === null || data === undefined || data === "";
const isEmptyArray = (data) => (Array.isArray(data) ? data.length === 0 : true);

export class FormatUtils {
  /**
   * 对基础设置,高级设置等设置页内容进行格式化
   * @param params
   */
  static formatSettings(param) {
    const cloneParam = JSON.parse(JSON.stringify(param));
    console.log("cloneParam===", { ...cloneParam });
    const treeList = this.flattenMapTreeToList(cloneParam);
    const combinationList = this.getEndpointNodeId(treeList);
    const finalList = this.cleanNodeList(combinationList);
    return finalList;
  }
  /**
   * 展平树结构
   * @param {Object} treeData  - 节点数据
   * @returns Array - 节点数组
   */
  static flattenMapTreeToList(treeData) {
    const nodeData = [];
    function traverse(node) {
      if (node.nodeType == NodeType.GatewayNode) {
        if (node.childNode) {
          node.childNode.nodeFrom = node.nodeId;
          traverse(node.childNode);
        }

        if (!isEmptyArray(node.nodeProperty?.conditionNodes)) {
          for (const child of node.nodeProperty?.conditionNodes) {
            child.nodeFrom = node.nodeId;
            traverse(child);
          }
          node.nodeTo = node.nodeProperty?.conditionNodes.map(
            (item) => item.nodeId,
          );
          delete node.nodeProperty?.conditionNodes;
        }
      } else if (node.nodeType == NodeType.ParallelApproveWayNode) {
        if (node.childNode) {
          node.childNode.nodeFrom = node.nodeId;
          traverse(node.childNode);
        }
        if (!isEmptyArray(node.nodeProperty?.parallelNodes)) {
          for (const child of node.nodeProperty?.parallelNodes) {
            child.nodeFrom = node.nodeId;
            traverse(child);
          }
          node.nodeTo = node.nodeProperty?.parallelNodes.map(
            (item) => item.nodeId,
          );
          delete node.nodeProperty?.parallelNodes;
        }
      } else if (node.childNode) {
        node.nodeTo = [node.childNode.nodeId];
        node.childNode.nodeFrom = node.nodeId;
        traverse(node.childNode);
      }
      delete node.childNode;
      nodeData.push(node);
    }
    traverse(treeData);
    return nodeData;
  }
  /**
   * 递归处理网关节点下属子节点的nodeTo数据
   * @param { Array } parmData -节点关系数组
   * @returns
   */
  static getEndpointNodeId(parmData) {
    if (isEmptyArray(parmData)) return parmData;

    const getwayList = parmData.filter((c) => {
      return c.nodeType == NodeType.GatewayNode;
    });

    if (isEmptyArray(getwayList)) return parmData;

    const nodesGroup = {};
    for (const t of parmData) {
      if (nodesGroup.hasOwnProperty(t.nodeFrom)) {
        nodesGroup[t.nodeFrom].push(t);
      } else {
        nodesGroup[t.nodeFrom] = [t];
      }
    }
    for (const getway of getwayList) {
      if (nodesGroup.hasOwnProperty(getway.nodeId)) {
        const itemNodes = nodesGroup[getway.nodeId];
        const comNode = itemNodes.find((c) => {
          return c.nodeType != NodeType.ConditionNode;
        });
        if (!comNode) continue;
        const conditionList = itemNodes.filter((c) => {
          return c.nodeId != comNode.nodeId;
        });
        for (const itemNode of conditionList) {
          function internalTraverse(info) {
            if (info) {
              if (!nodesGroup[info.nodeId]) {
                info.nodeTo = [comNode.nodeId];
              } else {
                const tempNode = nodesGroup[info.nodeId];
                if (Array.isArray(tempNode)) {
                  for (const t_item of tempNode) {
                    internalTraverse(t_item);
                  }
                } else {
                  internalTraverse(tempNode);
                }
              }
            }
          }
          internalTraverse(itemNode);
        }
      }
    }
    return parmData;
  }
  /**
   * 清理节点数据
   * @param { Array } arr -节点数组
   * @returns
   */
  static cleanNodeList(arr) {
    const nodeIds = arr.map((c) => {
      return c.nodeId;
    });
    for (const node of arr) {
      node.nodeTo = Array.from(new Set(node.nodeTo));
      if (!isEmptyArray(node.nodeTo)) {
        node.nodeTo = node.nodeTo.filter((key) => {
          return nodeIds.indexOf(key) > -1;
        });
      }
      if (
        !isEmpty(node.nodeProperty) &&
        typeof node.nodeProperty === "object"
      ) {
        node.nodeProperty = JSON.stringify(node.nodeProperty);
      }
    }
    return arr;
  }
}
