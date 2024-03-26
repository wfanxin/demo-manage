import request from '@/utils/request'

export function edit(params) {
  return request({
    url: '/lv/website/option/edit',
    method: 'post',
    data: params
  })
}

export function detail(params) {
  return request({
    url: '/lv/website/option/detail',
    method: 'get',
    params: params
  })
}
