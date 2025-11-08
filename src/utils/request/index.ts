import { merge } from 'lodash'
import configs from '@/config'
import { Axios } from './axios'
import { ContentTypeEnum, RequestCodeEnum, RequestMethodsEnum } from '@/enums/requestEnums'
import type { AxiosHooks } from './type'
import { clearAuthInfo, getToken } from '../auth'
import feedback from '../feedback'
import NProgress from 'nprogress'
import { AxiosError, type AxiosRequestConfig } from 'axios'
import router from '@/router'
import { PageEnum } from '@/enums/pageEnum'
import { usePopupStore } from '@/stores/popup'
import { eventBus } from "@/utils/eventBus"

// ========================== Axios 钩子函数 ==========================
const axiosHooks: AxiosHooks = {
    // 请求前拦截器
    requestInterceptorsHook(config) {
        NProgress.start()
        const { withToken, isParamsToData } = config.requestOptions
        const params = config.params || {}
        const headers = config.headers || {}

        // ✅ 自动携带 Token
        if (withToken) {
            const token = getToken()
            headers.token = token
        }

        // ✅ POST 请求时，如果没有 data，把 params 视为 data
        if (
            isParamsToData &&
            !Reflect.has(config, 'data') &&
            config.method?.toUpperCase() === RequestMethodsEnum.POST
        ) {
            config.data = params
            config.params = {}
        }

        config.headers = headers
        return config
    },

    // 请求异常
    requestInterceptorsCatchHook(err) {
        NProgress.done()
        return err
    },

    // ========================== 响应拦截器 ==========================
    async responseInterceptorsHook(response) {
        NProgress.done()

        // ✅ 1️⃣ 如果是文件流（Excel 导出、PDF、图片等），直接返回 Blob
        if (response.config.responseType === 'blob') {
            return response.data
        }

        // 取出扩展选项
        const { isTransformResponse, isReturnDefaultResponse } = response.config.requestOptions

        // ✅ 2️⃣ 直接返回完整响应体（通常不处理）
        if (isReturnDefaultResponse) {
            return response
        }

        // ✅ 3️⃣ 不需要转换数据时直接返回 data
        if (!isTransformResponse) {
            return response.data
        }

        // ✅ 4️⃣ 统一业务返回结构解析
        const { code, data, show, msg } = response.data
        console.log('响应 code:', code)

        switch (code) {
            case RequestCodeEnum.SUCCESS:
                if (show) {
                    msg && feedback.msgSuccess(msg)
                }
                return data

            // 常规错误
            case RequestCodeEnum.PARAMS_TYPE_ERROR:
            case RequestCodeEnum.PARAMS_VALID_ERROR:
            case RequestCodeEnum.REQUEST_METHOD_ERROR:
            case RequestCodeEnum.ASSERT_ARGUMENT_ERROR:
            case RequestCodeEnum.ASSERT_MYBATIS_ERROR:
            case RequestCodeEnum.LOGIN_ACCOUNT_ERROR:
            case RequestCodeEnum.LOGIN_DISABLE_ERROR:
            case RequestCodeEnum.NO_PERMISSTION:
            case RequestCodeEnum.FAILED:
            case RequestCodeEnum.GOOGLE_VERIFY_INVALID:
            case RequestCodeEnum.SYSTEM_ERROR:
                msg && feedback.msgError(msg)
                return Promise.reject(data)

            // Token 失效
            case RequestCodeEnum.TOKEN_INVALID:
            case RequestCodeEnum.TOKEN_EMPTY:
                clearAuthInfo()
                router.push(PageEnum.LOGIN)
                return Promise.reject()

            // 谷歌验证弹窗
            case RequestCodeEnum.Need_Bind_GOOGLE_VERIFY:
                console.log("拦截器触发 Google 二次验证弹窗")
                eventBus.emit('open-google-popup')
                return Promise.reject()

            default:
                return data
        }
    },

    // 响应异常
    responseInterceptorsCatchHook(error) {
        NProgress.done()
        if (error.code !== AxiosError.ERR_CANCELED) {
            error.message && feedback.msgError(error.message)
        }
        return Promise.reject(error)
    }
}

// ========================== 默认配置 ==========================
const defaultOptions: AxiosRequestConfig = {
    timeout: configs.timeout,
    baseURL: configs.baseUrl,
    headers: { 'Content-Type': ContentTypeEnum.JSON, version: configs.version },

    axiosHooks: axiosHooks,
    requestOptions: {
        isParamsToData: true, // POST 时把 params 视为 data
        isReturnDefaultResponse: false, // 默认返回 data
        isTransformResponse: true, // 是否处理返回数据
        urlPrefix: configs.urlPrefix,
        ignoreCancelToken: false,
        withToken: true, // 默认携带 token
        isOpenRetry: true, // 启用失败重试
        retryCount: 2 // 重试次数
    }
}

// ========================== 实例构造函数 ==========================
function createAxios(opt?: Partial<AxiosRequestConfig>) {
    return new Axios(
        // 深度合并
        merge(defaultOptions, opt || {})
    )
}

const request = createAxios()
export default request
