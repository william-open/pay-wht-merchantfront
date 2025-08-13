<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="550px"  @confirm="handleSubmit" @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="84px" :rules="formRules">

                <el-form-item label="货币" prop="role">
                    <el-select v-model="formData.currencyId"  class="flex-1" clearable placeholder="请选择货币"
                        multiple>
                        <el-option v-for="(item, index) in optionsData.currency" :key="index" :label="item.currency"
                            :value="item.currencyId" />
                    </el-select>
                </el-form-item>


            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { adminAdd, adminEdit, adminDetail } from '@/api/perms/admin'
import { useDictOptions } from '@/hooks/useDictOptions'
import feedback from '@/utils/feedback'
import {currencyAdd, currencyAll} from "@/api/biz/currency";
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑货币' : '新增货币'
})

const formData = reactive({
    currencyId: '',
})


const formRules = reactive({
    currencyId: [
        {
            required: true,
            message: '请选择货币',
            trigger: ['blur']
        }
    ],
})

const { optionsData } = useDictOptions<{
  currency: any[]
}>({
  currency: {
        api: currencyAll
    },
})

const handleSubmit = async () => {
    await formRef.value?.validate()
    await currencyAdd(formData)
    popupRef.value?.close()
    feedback.msgSuccess('操作成功')
    emit('success')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = async (row: any) => {
    const data = await adminDetail({
        id: row.id
    })
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //后端返回string类型做处理
            if (key === 'role') {
                //@ts-ignore
                formData[key] = Number(data[key])
                return
            }
            //@ts-ignore
            formData[key] = data[key]
        }
    }
    formRules.currencyId = []
}

const handleClose = () => {
    emit('close')
}

defineExpose({
    open,
    setFormData
})
</script>
