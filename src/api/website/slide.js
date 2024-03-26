import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lv/website/slide/list',
    method: 'get',
    params: params
  })
}

export function add(params) {
  return request({
    url: '/lv/website/slide/add',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/lv/website/slide/edit',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/lv/website/slide/del',
    method: 'post',
    data: params
  })
}
