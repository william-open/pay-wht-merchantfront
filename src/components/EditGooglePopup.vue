<template>
  <el-dialog
      v-model="visible"
      title="绑定谷歌验证码"
      width="550px"
      :close-on-click-modal="false"
      @close="handleClose"
  >
    <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
    >
      <el-divider content-position="center">新谷歌秘钥</el-divider>
      <el-descriptions :column="1" border class="mb-2">
        <el-descriptions-item label="谷歌秘钥">{{ secret }}</el-descriptions-item>
        <el-descriptions-item label="二维码">
          <img
              :src="qrcode"
              alt="Google QR Code"
              v-if="qrcode.length > 0"
              style="max-width: 200px"
          />
        </el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="center">安全验证</el-divider>
      <el-form-item label="支付密码" prop="payPassword">
        <el-input
            v-model="formData.payPassword"
            type="password"
            autocomplete="off"
            placeholder="输入支付密码"
        />
      </el-form-item>
      <el-form-item label="谷歌验证码" prop="googleCode">
        <el-input
            v-model="formData.googleCode"
            placeholder="用于验证，没有可以不填"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确认绑定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, shallowRef } from 'vue'
import type { FormInstance } from 'element-plus'
import { generateGoogleSecret, saveGoogleSecret } from '@/api/biz/safety'
import feedback from '@/utils/feedback'
import { usePopupStore } from '@/stores/popup'

// const popupStore = usePopupStore()
//
// watch(
//     () => popupStore.showGoogleBindPopup,
//     (val) => {
//       visible.value = val
//       if (val) genGoogleCode()
//     }
// )
const emit = defineEmits(['success'])

const visible = ref(false)
const loading = ref(false)
const formRef = shallowRef<FormInstance>()
const secret = ref('')
const qrcode = ref('')

const formData = reactive({
  payPassword: '',
  googleCode: '',
  googleSecret: ''
})

const formRules = {
  payPassword: [
    {
      required: true,
      message: '请输入支付密码',
      trigger: 'blur'
    }
  ]
}

const open = () => {
  visible.value = true
  resetForm()
  genGoogleCode()
}

const handleClose = () => {
  visible.value = false
  resetForm()
}

const resetForm = () => {
  formRef.value?.resetFields()
  formData.payPassword = ''
  formData.googleCode = ''
  formData.googleSecret = ''
  secret.value = ''
  qrcode.value = ''
}

const genGoogleCode = async () => {
  try {
    const res = await generateGoogleSecret()
    secret.value = res.secret
    qrcode.value = res.qrcode
    formData.googleSecret = res.secret
  } catch (err) {
    feedback.msgError('获取谷歌秘钥失败')
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  loading.value = true
  try {
    await saveGoogleSecret(formData)
    feedback.msgSuccess('绑定成功')
    visible.value = false
    emit('success')
  } catch (err) {
    // 错误提示由 axios 拦截器处理
  } finally {
    loading.value = false
  }
}

defineExpose({
  open
})
</script>

<style scoped>
.mb-2 {
  margin-bottom: 20px;
}
</style>
