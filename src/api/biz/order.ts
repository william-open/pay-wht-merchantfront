import request from '@/utils/request'

// 收款订单列表
export function collectLists(params: any) {
    return request.get({ url: '/biz/order/collect_list', params })
}

// 付款订单列表
export function payOutLists(params: any) {
    return request.get({ url: '/biz/order/payout_list', params })
}
