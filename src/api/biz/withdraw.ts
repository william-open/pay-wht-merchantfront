import request from '@/utils/request'

// 申请资金下发
export function withdrawApply(params: any) {
    return request.post({ url: '/biz/withdraw/apply', params })
}


// 申请资金下发申请记录
export function withdrawRecords(params: any) {
    return request.get({ url: '/biz/withdraw/records', params })
}

// 商户货币列表
export function mCurrencyCodeAll() {
    return request.get({ url: '/biz/merchant/currency_code/all' })
}
