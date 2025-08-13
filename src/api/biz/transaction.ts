import request from '@/utils/request'

// 交易列表
export function transactionLists(params: any) {
    return request.get({ url: '/biz/transaction/list', params })
}

// 交易详情
export function transactionDetail(params: any) {
    return request.get({ url: '/biz/transaction/detail', params })
}
