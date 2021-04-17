/*
 * @Author: lemon
 * @Date: 2021-03-15 21:34:03
 * @LastEditTime: 2021-03-22 21:31:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */

import request from '@/utils/request'

const api = {
  // 工单上报列表查询
  getWorkOrderList: (data) => {
    return request({
      url: '/system/order/list',
      method: 'get',
      params: data
    })
  },
  getWorkOrderListById: (data) => {
    return request({
      url: `/system/order/query/${data}`,
      method: 'get'
    })
  },
  // 工单上报列表编辑
  editWorkOrderListById: (data) => {
    return request({
      url: `/system/order/edit`,
      method: 'put',
      data
    })
  },
  // 导出工单
  exportWorkOrder: (data) => {
    return request({
      url: '/system/order/export',
      method: 'get',
      data
    })
  },


  // 物资采购列表查询
  getProcurementList: (data) => {
    return request({
      url: '/system/procurement/list',
      method: 'get',
      params: data
    })
  },
  // 新增物资采购数据
  postProcurement: (data) => {
    return request({
      url: '/system/procurement/add',
      method: 'post',
      data
    })
  },
  getProcurementListById: (data) => {
    return request({
      url: `/system/procurement/query/${data}`,
      method: 'get'
    })
  },
  // 物资采购列表编辑
  editProcurementListById: (data) => {
    return request({
      url: `/system/procurement/edit`,
      method: 'put',
      data
    })
  },
  // 导出物资采购
  exportProcurement: (data) => {
    return request({
      url: '/system/procurement/export',
      method: 'get',
      data
    })
  },


  // 报账列表查询
  getSendAccountList: (data) => {
    return request({
      url: '/system/Reimbursement/list',
      method: 'get',
      params: data
    })
  },
  // 新增报账数据
  posSendAccount: (data) => {
    return request({
      url: '/system/Reimbursement/add',
      method: 'post',
      data
    })
  },
  getSendAccountListById: (data) => {
    return request({
      url: `/system/Reimbursement/query/${data}`,
      method: 'get'
    })
  },
  // 报账列表编辑
  editSendAccountListById: (data) => {
    return request({
      url: `/system/Reimbursement/edit`,
      method: 'put',
      data
    })
  },
  // 导出报账信息
  exportSendAccount: (data) => {
    return request({
      url: '/system/Reimbursement/export',
      method: 'get',
      data
    })
  }
}


export default api
