import request from '@/utils/request'

// 资金日志列表
export function financeAccountRecords(params: any) {
    return request.get({ url: '/biz/finance/account_records', params })
}

