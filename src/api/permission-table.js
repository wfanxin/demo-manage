import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lv/permissions',
    method: 'get',
    params: params
  })
}

export function getTotal(params) {
  return request({
    url: '/lv/permissions/total',
    method: 'get',
    params: params
  })
}

export function editPermission(params) {
  return request({
    url: '/lv/permissions/' + params['id'],
    method: 'patch',
    data: params
  })
}

export function refresh() {
  return request({
    url: '/lv/permissions',
    method: 'put'
  })
}
