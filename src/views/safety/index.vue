<template>
  <div class="workbench">
    <div class="md:flex">
      <el-card class="!border-none mb-4 flex-1" shadow="never">
        <template #header>
          <div>
            <span class="card-title">安全项</span>
          </div>
        </template>

        <div class="flex flex-wrap">
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">支付密码</div>
            <div class="text-tx-secondary text-xs">
              <el-button type="success" size="small" @click="handlePayPwd">
                修改
              </el-button>
            </div>
          </div>
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">谷歌验证码</div>
            <div class="text-tx-secondary text-xs">
              <el-button type="success" size="small" @click="handleGoogleCode">修改</el-button>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 子组件始终存在 -->
      <EditPayPopup ref="editPayPwdRef" />
      <EditGooglePopup ref="editGoogleRef" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import EditPayPopup from './edit_pay_pwd.vue'
import EditGooglePopup from './edit_google_code.vue'

const editPayPwdRef = shallowRef<InstanceType<typeof EditPayPopup>>()
const editGoogleRef = shallowRef<InstanceType<typeof EditGooglePopup>>()

  // 修改支付密码
const handlePayPwd = () => {
  // 子组件已暴露 open 方法，可以直接调用
  editPayPwdRef.value?.open()
}
//修改谷歌验证码
const handleGoogleCode = () => {
  // 子组件已暴露 open 方法，可以直接调用
  editGoogleRef.value?.open()
}
</script>
