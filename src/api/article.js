import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lv/mobile/article/list',
    method: 'get',
    params: params
  })
}

export function add(params) {
  return request({
    url: '/lv/mobile/article/add',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/lv/mobile/article/edit',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/lv/mobile/article/del',
    method: 'post',
    data: params
  })
}

export function detail(params) {
  return request({
    url: '/lv/mobile/article/detail',
    method: 'get',
    params: params
  })
}
