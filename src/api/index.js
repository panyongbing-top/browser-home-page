import request from '@/utils/request'

const api = {
  getTabList: '/tablist',
  getAppList: '/appList',
  tab: '/tabs',
  URL: '/URL',
}

/**
 * 获取标签列表
 */
export function getTabList(params) {
  return request({
    url: api.getTabList,
    method: 'get',
    params,
  })
}

/**
 * 获取标签下item列表
 */
export function getAppList(params) {
  return request({
    url: api.getAppList,
    method: 'get',
    params,
  })
}

/**
 * 新增标签页
 */
export function addTab(params) {
  return request({
    url: api.tab,
    method: 'post',
    params,
  })
}

/**
 * 修改标签页
 */
export function editTab(params) {
  return request({
    url: api.tab,
    method: 'put',
    params,
  })
}

/**
 * 删除标签页
 */
export function delTab(Id) {
  return request({
    url: api.tab + '/' + Id,
    method: 'delete',
  })
}

/**
 * 新增url
 */
export function addURL(params) {
  return request({
    url: api.URL,
    method: 'post',
    params,
  })
}

/**
 * 修改url
 */
export function updateURL(params) {
  return request({
    url: api.URL,
    method: 'put',
    params,
  })
}

/**
 * 删除url
 */
export function delURL(Id) {
  return request({
    url: api.URL + '/' + Id,
    method: 'delete',
  })
}
