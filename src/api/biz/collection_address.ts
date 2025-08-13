import request from '@/utils/request'


// 归集账户列表
export function collectionAddressLists(params: any) {
    return request.get({ url: '/biz/collection_address/list', params })
}

// 归集账户添加
export function collectionAddressAdd(params: any) {
    return request.post({ url: '/biz/collection_address/add', params })
}

// 归集账户详情
export function collectionAddressDetail(params: any) {
    return request.get({ url: '/biz/collection_address/detail', params })
}

// 归集账户编辑
export function currencyAddressEdit(params: any) {
    return request.post({ url: '/biz/collection_address/edit', params })
}

// 归集账户删除
export function collectionAddressDelete(params: any) {
    return request.post({ url: '/biz/collection_address/del', params })
}

// 归集账户禁用
export function collectionAddressStatus(params: any) {
    return request.post({ url: '/biz/collection_address/disable', params })
}


// 归集账户余额
export function walletBalance(params: any) {
    return request.get({ url: '/biz/collection_address/balance', params })
}