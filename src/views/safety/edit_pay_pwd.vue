<template>
    <div class="edit-pay-popup">
        <popup
            ref="popupRef"
            title="修改支付密码"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="120px" :rules="formRules">
                <el-divider content-position="center">新支付密码</el-divider>
                <el-form-item label="新支付密码" prop="newPayPassword">
                    <el-input v-model="formData.newPayPassword" type="password" autocomplete="off" placeholder="请输入新支付密码" />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPayPassword">
                    <el-input v-model="formData.confirmPayPassword" type="password" autocomplete="off" placeholder="请输入确认密码" />
                </el-form-item>
                <el-divider content-position="center">安全验证</el-divider>
                <el-form-item label="原支付密码" prop="oldPayPassword">
                    <el-input v-model="formData.oldPayPassword" type="password" autocomplete="off" placeholder="请输入原支付密码" />
                </el-form-item>
                <el-form-item label="谷歌验证码" prop="googleCode">
                    <el-input v-model="formData.googleCode" placeholder="用于验证，没有可以不填" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import {savePayPassword } from '@/api/biz/safety'
import type { FormInstance, FormRules } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
const emit = defineEmits(['success'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formData = reactive({
    oldPayPassword: '',
    googleCode: '',
    newPayPassword: '',
    confirmPayPassword: '',
})

// 验证规则
const formRules: FormRules = {
    oldPayPassword: [
        { required: true, message: '请输入原支付密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    newPayPassword: [
        { required: true, message: '请输入新支付密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
        { max: 20, message: '密码长度不能超过20位', trigger: 'blur' },
        { 
            validator: (rule, value, callback) => {
                if (value && formData.oldPayPassword && value === formData.oldPayPassword) {
                    callback(new Error('新密码不能与原密码相同'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    confirmPayPassword: [
        { required: true, message: '请确认新支付密码', trigger: 'blur' },
        { 
            validator: (rule, value, callback) => {
                if (value !== formData.newPayPassword) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    googleCode: [
        { 
            validator: (rule, value, callback) => {
                if (value && !/^\d{6}$/.test(value)) {
                    callback(new Error('谷歌验证码必须是6位数字'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    // 使用解构赋值创建新对象，排除 confirmPayPassword
    const { confirmPayPassword, ...submitData } = formData
    await savePayPassword(submitData)
    feedback.msgSuccess('操作成功')
    popupRef.value?.close()
    emit('success')
}


const open = () => {
    popupRef.value?.open()
}

const handleClose = () => {
    formRef.value?.resetFields()
}

defineExpose({
    open
})
</script>
