import request from '@/utils/request'
import configs from '@/config'

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

// 对账单导出
export function accountLogExport(params: any) {
    return request.get({
        url: '/biz/finance/export',
        params,
        responseType: 'blob', // 告诉 Axios 返回文件流
        requestOptions: {
            // ✅ 以下是完整结构，继承默认配置
            isParamsToData: false,
            isReturnDefaultResponse: true,
            isTransformResponse: false, // 不做结构化处理
            urlPrefix: configs.urlPrefix,
            ignoreCancelToken: false,
            withToken: true,
            isOpenRetry: false, // 下载文件一般不重试
            retryCount: 0,
        }
    })
}