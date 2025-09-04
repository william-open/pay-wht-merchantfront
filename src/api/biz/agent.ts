import request from '@/utils/request'

// 通道费率列表
export function channelLists(params: any) {
    return request.get({ url: '/biz/agent/channel', params })
}

// 代收单列表
export function collectLists(params: any) {
    return request.get({ url: '/biz/agent/collect', params })
}

// 代付订单列表
export function payoutLists(params: any) {
    return request.get({ url: '/biz/agent/payout', params })
}

// 商户账单列表
export function merchantBillLists(params: any) {
    return request.get({ url: '/biz/agent/merchant_bill', params })
}