<template>
  <div class="workbench">
    <div class="md:flex">
      <el-card class="!border-none mb-4 md:mr-4" shadow="never">
        <template #header>
          <span class="card-title">商户信息</span>
        </template>
        <div>
          <div class="flex leading-9">
            <div class="w-20 flex-none">应用ID</div>
            <span>{{ configData.appId }}</span>
          </div>

          <div class="flex leading-9 items-center">
            <div class="w-20 flex-none">API KEY</div>
            <span>{{ showApiKey ? configData.apiKey : '************' }}</span>
            <el-button type="primary" size="small" class="ml-2" @click="openDialog">查看</el-button>
          </div>

          <div class="flex leading-9">
            <div class="w-20 flex-none">下单网关</div>
            <span>{{ configData.apiGateway }}</span>
          </div>

          <div class="flex leading-9">
            <div class="w-20 flex-none">接口文档</div>
            <span>
              <a
                :href="configData.apiDoc"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline"
              >
                <el-button type="success" size="small">查看接口文档</el-button>
              </a>
            </span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 弹框 -->
    <el-dialog v-model="dialogVisible" title="验证身份" width="400px">
      <el-form :model="verifyForm" :rules="rules" ref="verifyFormRef" label-width="100px">
        <el-form-item label="支付密码" prop="payPassword">
          <el-input v-model="verifyForm.payPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="verifyForm.googleCode" maxlength="6" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitVerify">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script lang="ts" setup name="workbench">
import { getRealApiKey,getApiConfig } from '@/api/biz/docking'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const configData: any = reactive({
    appId: '',
    apiKey: '',
    apiDoc: '',
    apiGateway: '',
})

// 掩码控制
const showApiKey = ref(false)

// 弹框控制
const dialogVisible = ref(false)
const verifyFormRef = ref()
const verifyForm = reactive({
  payPassword: '',
  googleCode: ''
})
const rules = {
  payPassword: [{ required: true, message: '请输入支付密码', trigger: 'blur' }],
  // googleCode: [{ required: true, message: '请输入谷歌验证码', trigger: 'blur' }]
}

// 打开弹框
const openDialog = () => {
  dialogVisible.value = true
  verifyForm.payPassword = ''
  verifyForm.googleCode = ''
}

// 提交验证
const submitVerify = async () => {
  await verifyFormRef.value?.validate()
  try {
    const res = await getRealApiKey({
      payPassword: verifyForm.payPassword,
      googleCode: verifyForm.googleCode
    })
    configData.apiKey = res.apiKey
    showApiKey.value = true
    dialogVisible.value = false
    ElMessage.success('API Key 获取成功')
  } catch (err) {
    // ElMessage.error('验证失败，请检查支付密码或谷歌验证码')
  }
}

// 获取数据
const getData = async () => {
  const res = await getApiConfig()

  configData.apiDoc = res.apiDoc
  configData.appId = res.appId
  configData.apiKey = res.apiKey
  configData.apiGateway = res.apiGateway

}

getData()
</script>

<style lang="scss" scoped></style>
