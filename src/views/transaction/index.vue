<template>
  <div class="admin">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="输入流水号/TXID/钱包地址">
          <el-input
            v-model="formData.keyword"
            class="w-[300px]"
            clearable
            @keyup.enter="resetPage"
          />
        </el-form-item>
<!--        <el-form-item label="交易时间">-->
<!--          <daterange-picker-->
<!--              v-model:startTime="formData.startTime"-->
<!--              v-model:endTime="formData.endTime"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="业务类型">-->
<!--          <el-select class="w-[280px]" v-model="formData.bizType">-->
<!--            <el-option label="全部" value="" />-->
<!--            <el-option-->
<!--              v-for="(item, index) in optionsData.role"-->
<!--              :key="index"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="交易类型">-->
<!--          <el-select class="w-[280px]" v-model="formData.tradeType">-->
<!--            <el-option label="全部" value="" />-->
<!--            <el-option-->
<!--                v-for="(item, index) in optionsData.role"-->
<!--                :key="index"-->
<!--                :label="item.name"-->
<!--                :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="交易状态">-->
<!--          <el-select class="w-[280px]" v-model="formData.status">-->
<!--            <el-option label="全部" value="" />-->
<!--            <el-option-->
<!--                v-for="(item, index) in optionsData.role"-->
<!--                :key="index"-->
<!--                :label="item.name"-->
<!--                :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="pager.loading" class="mt-4 !border-none" shadow="never">
      <div class="mt-4">
        <el-table :data="pager.lists" size="large">
          <el-table-column label="流水号" prop="bizNo" min-width="100" />
          <el-table-column label="TXID" prop="txId" min-width="100" />
          <el-table-column label="货币" prop="symbol" min-width="100" />
          <el-table-column label="发起地址" prop="fromAddress" min-width="100" />
          <el-table-column label="接收地址" prop="toAddress" min-width="100" />
          <el-table-column label="交易数量" prop="amount" min-width="100" />
<!--          <el-table-column label="交易类型" prop="dept" min-width="100" />-->
<!--          <el-table-column label="交易状态" min-width="100">-->
<!--            <template #default="{ row }">-->
<!--              <el-switch-->
<!--                  v-perms="['system:admin:disable']"-->
<!--                  v-if="row.id != 1"-->
<!--                  :model-value="row.isDisable"-->
<!--                  :active-value="0"-->
<!--                  :inactive-value="1"-->
<!--                  @change="changeStatus($event, row.id)"-->
<!--              />-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="业务类型" prop="dept" min-width="100" />-->
          <el-table-column label="完成时间" prop="createTime" min-width="180" />
<!--          <el-table-column label="创建时间" prop="createTime" min-width="180" />-->

<!--          <el-table-column label="操作" width="120" fixed="right">-->
<!--            <template #default="{ row }">-->
<!--              <el-button-->
<!--                v-perms="['system:admin:edit']"-->
<!--                type="primary"-->
<!--                link-->
<!--                @click="handleEdit(row)"-->
<!--              >-->
<!--                详情-->
<!--              </el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
      </div>
      <div class="flex mt-4 justify-end">
        <pagination v-model="pager" @change="getLists" />
      </div>
    </el-card>
    <edit-popup
      v-if="showEdit"
      ref="editRef"
      @success="getLists"
      @close="showEdit = false"
    />
  </div>
</template>

<script lang="ts" setup name="admin">
import { transactionLists, transactionDetail } from "@/api/biz/transaction";
import { roleAll } from "@/api/perms/role";
import { useDictOptions } from "@/hooks/useDictOptions";
import { usePaging } from "@/hooks/usePaging";
import feedback from "@/utils/feedback";
import EditPopup from "./edit.vue";
const editRef = shallowRef<InstanceType<typeof EditPopup>>();
// 表单数据
const formData = reactive<any>({

});
const showEdit = ref(false);
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: transactionLists,
  params: formData,
});

const changeStatus = async (active: any, id: number) => {
  try {
    await feedback.confirm(`确定${active ? "停用" : "开启"}当前管理员？`);
    // await adminStatus({ id });
    feedback.msgSuccess("修改成功");
    getLists();
  } catch (error) {
    getLists();
  }
};
const handleAdd = async () => {
  showEdit.value = true;
  await nextTick();
  editRef.value?.open("add");
};

const handleEdit = async (data: any) => {
  showEdit.value = true;
  await nextTick();
  editRef.value?.open("edit");
  editRef.value?.setFormData(data);
};

const handleDelete = async (id: number) => {
  await feedback.confirm("确定要删除？");
  // await adminDelete({ id });
  feedback.msgSuccess("删除成功");
  getLists();
};

const { optionsData } = useDictOptions<{
  role: any[];
}>({
  role: {
    api: roleAll,
  },
});

onMounted(() => {
  getLists();
});
</script>
