import request from '@/utils/request'

// IP白名单列表
export function ipWhiteLists(params: any) {
    return request.get({ url: '/biz/docking/ip_whitelist', params })
}

// 添加IP白名单
export const getRealApiKey = (data: { payPassword: string; googleCode: string }) => {
    return request.post({ url: '/biz/docking/view_key', data })
}

// 获取对接配置
export const getApiConfig = () => {
    return request.get({ url: '/biz/docking/config_info' })
}
