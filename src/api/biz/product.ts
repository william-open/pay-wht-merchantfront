import request from '@/utils/request'

// 通道产品列表
export function productLists(params: any) {
    return request.get({ url: '/biz/pay_channel/product', params })
}
