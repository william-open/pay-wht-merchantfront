import request from '@/utils/request'

// 资金日志列表
export function day(params: any) {
    return request.get({ url: '/biz/stats/day', params })
}
