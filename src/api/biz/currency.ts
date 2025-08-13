import request from '@/utils/request'

// 平台所有货币
export function currencyAll(params: any) {
    return request.get({ url: '/biz/currency/all', params })
}

// 货币列表
export function currencyLists(params: any) {
    return request.get({ url: '/biz/currency/m/list', params })
}

// 货币添加
export function currencyAdd(params: any) {
    return request.post({ url: '/biz/currency/m/add', params })
}

// 货币详情
export function currencyDetail(params: any) {
    return request.get({ url: '/biz/currency/detail', params })
}

// 货币编辑
export function currencyEdit(params: any) {
    return request.post({ url: '/biz/currency/edit', params })
}

// 货币删除
export function currencyDelete(params: any) {
    return request.post({ url: '/biz/currency/m/del', params })
}

// 货币禁用
export function currencyStatus(params: any) {
    return request.post({ url: '/biz/currency/disable', params })
}
