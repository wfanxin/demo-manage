import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lv/mobile/slide/list',
    method: 'get',
    params: params
  })
}

export function add(params) {
  return request({
    url: '/lv/mobile/slide/add',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/lv/mobile/slide/edit',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/lv/mobile/slide/del',
    method: 'post',
    data: params
  })
}
