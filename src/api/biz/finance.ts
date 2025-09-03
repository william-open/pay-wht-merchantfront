import request from '@/utils/request'

// 资金日志列表
export function financeAccountRecords(params: any) {
    return request.get({ url: '/biz/finance/account_records', params })
}

// 商户账户余额列表
export function financeBalance(params: any) {
    return request.get({ url: '/biz/finance/balance',params })
}

// 商户货币列表
export function financeCurrency() {
    return request.get({ url: '/biz/finance/currency' })
}
