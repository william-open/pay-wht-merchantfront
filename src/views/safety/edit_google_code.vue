<template>
    <div class="edit-google-popup">
        <popup
            ref="popupRef"
            title="修改谷歌验证码"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="120px" :rules="formRules">
                <el-divider content-position="center">新谷歌秘钥</el-divider>
            <!-- 顶部展示只读数据 -->
            <el-descriptions :column="1" border class="mb-2">
                <el-descriptions-item label="谷歌秘钥">{{secret}}</el-descriptions-item>
                <el-descriptions-item label="二维码"> <img :src="qrcode" alt="Google QR Code" v-if="qrcode.length>0"/></el-descriptions-item>
            </el-descriptions>


                <el-divider content-position="center">安全验证</el-divider>
                <el-form-item label="支付密码" prop="payPassword">
                    <el-input v-model="formData.payPassword"  type="password" autocomplete="off" placeholder="输入支付密码" />
                </el-form-item>
                <el-form-item label="谷歌验证码" prop="googleCode">
                    <el-input v-model="formData.googleCode" placeholder="用于验证，没有可以不填" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import { generateGoogleSecret,saveGoogleSecret } from '@/api/biz/safety'
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
const emit = defineEmits(['success'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const qrcode = ref('')
const secret = ref('')
const formData = reactive({
    payPassword: '',
    googleCode: '',
    googleSecret:''
})

const formRules = {
    payPassword: [
        {
            required: true,
            message: '请输入支付密码',
            trigger: 'blur'
        }
    ],
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    await saveGoogleSecret(formData)
    feedback.msgSuccess('操作成功')
    popupRef.value?.close()
    emit('success')
}

const open = () => {
    popupRef.value?.open()
    genGoogleCode()
}

const handleClose = () => {
    formRef.value?.resetFields()
}

const genGoogleCode = ()=>{
    generateGoogleSecret().then(res=>{
        secret.value=res.secret
        qrcode.value=res.qrcode
        formData.googleSecret=res.secret
    })
}

defineExpose({
    open
})
</script>
