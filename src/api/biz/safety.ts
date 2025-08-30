import request from '@/utils/request'


// 生成google秘钥
export function generateGoogleSecret() {
    return request.post({ url: '/biz/safety/gen/google_code' })
}

// 保存google秘钥
export function saveGoogleSecret(params: any) {
    return request.post({ url: '/biz/safety/save/google_code', params })
}

// 保存支付密码更改信息
export function savePayPassword(params: any) {
    return request.post({ url: '/biz/safety/save/pay_password', params })
}
