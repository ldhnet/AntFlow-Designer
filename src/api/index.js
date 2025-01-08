/*
 * @Date:  2024-05-25 14:06:59
 * @LastEditors: LDH 574427343@qq.com
 * @LastEditTime: 2023-03-29 15:52:57
 * @FilePath: /flow-designer/src/api/index.js
 */

import http from '@/utils/axios'
let baseUrl = import.meta.env.BASE_URL

/**
 * 获取角色
 * @param {*} data 
 * @returns 
 */
export function getRoles(data) {
  return http.get(`${baseUrl}roles.json`, { params: data })
} 

/**
 * 获取职员
 * @param {*} data 
 * @returns 
 */
export function getEmployees(data) {
  return http.get(`${baseUrl}employees.json`, { params: data })
}
/**
 * 获取条件字段
 * @param {*} data 
 * @returns 
 */
export function getConditions(data) {
  return http.get(`${baseUrl}conditions.json`, { params: data })
}

/**
 * 获取审批数据
 * @param {*} data 
 * @returns 
 */
export function getWorkFlowData(data) {
  return http.get(`${baseUrl}data.json`, { params: data })
}
/**
 * 流程设计 提交到后端
 * @param {*} data 
 * @returns 
 */
export function setWorkFlowData(data) {
  const headers = {
    "Userid": 1,
    "Username": '%E5%BC%A0%E4%B8%89'
  } 
  return http.post(`http://117.72.70.166:7001/bpmnConf/edit`, data, { headers })
}
 