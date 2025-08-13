import request from '@/utils/request'

// 钱包列表
export function walletLists(params: any) {
    return request.get({ url: '/biz/address/list', params })
}

// 钱包详情
export function walletDetail(params: any) {
    return request.get({ url: '/biz/address/detail', params })
}

// 钱包余额
export function walletBalance(params: any) {
    return request.get({ url: '/biz/address/balance', params })
}