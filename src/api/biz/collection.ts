import request from '@/utils/request'

// 归集列表
export function collectionLists(params: any) {
    return request.get({ url: '/biz/collection/list', params })
}

// 归集详情
export function collectionDetail(params: any) {
    return request.get({ url: '/biz/collection/detail', params })
}
