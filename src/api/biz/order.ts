import request from '@/utils/request'
import configs from '@/config'

// ========================== 代收订单 ==========================

// 收款订单列表
export function collectLists(params: any) {
    return request.get({
        url: '/biz/order/collect_list',
        params
    })
}

// ✅ 收款订单导出
export function collectExport(params: any) {
    return request.get({
        url: '/biz/order/collect_export',
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

// ========================== 代付订单 ==========================

// 付款订单列表
export function payOutLists(params: any) {
    return request.get({
        url: '/biz/order/payout_list',
        params
    })
}

// ✅ 付款订单导出
export function payOutExport(params: any) {
    return request.get({
        url: '/biz/order/payout_export',
        params,
        responseType: 'blob',
        requestOptions: {
            isParamsToData: false,
            isReturnDefaultResponse: true,
            isTransformResponse: false,
            urlPrefix: configs.urlPrefix,
            ignoreCancelToken: false,
            withToken: true,
            isOpenRetry: false,
            retryCount: 0,
        }
    })
}
