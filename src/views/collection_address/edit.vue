<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="84px" :rules="formRules">
                <el-form-item label="主链网络">
                  <el-select class="flex-1" clearable v-model="formData.chainSymbol" placeholder="请选择主链网络">
                          <el-option v-for="(item, index) in mainNetData" :key="index" :label="item.name"
                              :value="item.key" />
                  </el-select>
                </el-form-item>
<!--                <el-form-item label="货币符号" prop="postId">-->
<!--                    <el-select class="flex-1" clearable v-model="formData.postId" placeholder="请选择岗位" multiple>-->
<!--                        <el-option v-for="(item, index) in optionsData.post" :key="index" :label="item.name"-->
<!--                            :value="item.id" />-->
<!--                    </el-select>-->
<!--                </el-form-item>-->


                <el-form-item label="归集地址">
                    <el-input v-model.trim="formData.address"  clearable placeholder="请输入归集钱包地址" />
                </el-form-item>

              <el-form-item label="归集区间">
                <el-row :gutter="10">
                  <el-col :span="11">
                    <el-input
                        v-model.trim="formData.minAmount"
                        clearable
                        placeholder="最小归集"
                    />
                  </el-col>
                  <el-col :span="2" style="text-align: center; line-height: 38px;">-</el-col>
                  <el-col :span="11">
                    <el-input
                        v-model.trim="formData.maxAmount"
                        clearable
                        placeholder="最大归集"
                    />
                  </el-col>
                </el-row>
              </el-form-item>


            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { collectionAddressAdd, currencyAddressEdit } from  "@/api/biz/collection_address";
import { useDictOptions } from '@/hooks/useDictOptions'
import { roleAll } from '@/api/perms/role'
import { postAll } from '@/api/org/post'
import { deptLists } from '@/api/org/department'
import feedback from '@/utils/feedback'
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑归集账户' : '新增归集账户'
})

const formData = reactive({
    id: '',
    chainSymbol: '',
    address: '',
    minAmount: '',
    maxAmount: '',
})

// 主链网络
const mainNetData = reactive([{
  key: 'TRON',
  name: '波场',
},
  {
    key: 'BSC',
    name: '币安',
  }
])


const formRules = reactive({
    address: [
        {
            required: true,
            message: '请输入归集地址',
            trigger: ['blur']
        }
    ],
    minAmount: [
        {
            required: true,
            message: '请输入最小归集金额',
            trigger: ['blur']
        }
    ],
    maxAmount: [
        {
            required: true,
            message: '请输入最大归集金额',
            trigger: ['blur']
        }
    ],
})


const handleSubmit = async () => {
    await formRef.value?.validate()
    mode.value == 'edit' ? await currencyAddressEdit(formData) : await collectionAddressAdd(formData)
    popupRef.value?.close()
    feedback.msgSuccess('操作成功')
    emit('success')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}


const handleClose = () => {
    emit('close')
}

defineExpose({
    open,
})
</script>
