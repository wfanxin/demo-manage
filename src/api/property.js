import request from '@/utils/request'

export function propertyList(params) {
  return request({
    url: '/lv/property/propertyList',
    method: 'get',
    params: params
  })
}

export function addProperty(params) {
  return request({
    url: '/lv/property/addProperty',
    method: 'post',
    data: params
  })
}

export function editProperty(params) {
  return request({
    url: '/lv/property/editProperty',
    method: 'post',
    data: params
  })
}

export function delProperty(params) {
  return request({
    url: '/lv/property/delProperty',
    method: 'post',
    data: params
  })
}

export function exportExcel(params) {
  return request({
    url: '/lv/property/exportExcel',
    method: 'post',
    data: params
  })
}

export function exportImage(params) {
  return request({
    url: '/lv/property/exportImage',
    method: 'post',
    data: params
  })
}

export function saveImage(params) {
  return request({
    url: '/lv/property/saveImage',
    method: 'post',
    data: params
  })
}
