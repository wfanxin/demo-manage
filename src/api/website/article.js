import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lv/website/article/list',
    method: 'get',
    params: params
  })
}

export function add(params) {
  return request({
    url: '/lv/website/article/add',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/lv/website/article/edit',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/lv/website/article/del',
    method: 'post',
    data: params
  })
}

export function detail(params) {
  return request({
    url: '/lv/website/article/detail',
    method: 'get',
    params: params
  })
}
