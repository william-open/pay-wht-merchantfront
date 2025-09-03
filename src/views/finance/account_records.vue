<template>
  <div class="admin">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="输入订单号">
          <el-input
              v-model="formData.keyword"
              class="w-[300px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
                <el-form-item label="交易时间">
                  <daterange-picker
                      v-model:startTime="formData.startTime"
                      v-model:endTime="formData.endTime"
                  />
                </el-form-item>
                <el-form-item label="交易类型">
                  <el-select class="w-[280px]" v-model="formData.type">
                    <el-option label="全部" value="" />
                    <el-option
                        v-for="(item, index) in transactionType"
                        :key="index"
                        :label="item.name"
                        :value="item.type"
                    />
                  </el-select>
                </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="pager.loading" class="mt-4 !border-none" shadow="never">
      <div class="mt-4">
        <el-table :data="pager.lists" size="large">
          <el-table-column label="编号" prop="id" min-width="100" />
                <el-table-column label="类型" prop="type" min-width="80">
                    <template #default="{ row }">
                      <el-tag v-if="row.type == AccountFinanceType.RECEIVE" type="success">代收</el-tag>
                      <el-tag v-if="row.type == AccountFinanceType.PAYOUT" type="info">代付</el-tag>
                    </template>
                </el-table-column>
          <el-table-column label="货币" prop="currency" min-width="100" />
          <el-table-column label="国家" prop="country" min-width="100" />
          <el-table-column label="订单号" prop="orderNo" min-width="100" />
          <el-table-column label="原金额" prop="oldBalance" min-width="100" />
          <el-table-column label="变动金额" prop="money" min-width="100" />
          <el-table-column label="变动后金额" prop="balance" min-width="100" />
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

          <el-table-column label="备注" prop="description" min-width="100" />
          <el-table-column label="操作人" prop="operator" min-width="100" />
          <el-table-column label="创建时间" prop="createTime" min-width="180" />
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

<script lang="ts" setup name="accountRecords">
import {financeAccountRecords } from "@/api/biz/finance";
// import { roleAll } from "@/api/perms/role";
import { useDictOptions } from "@/hooks/useDictOptions";
import { usePaging } from "@/hooks/usePaging";
import { AccountFinanceType } from '@/enums/appEnums'

// 定义接口类型
interface Transaction {
  name: string
  type: number
}

// 表单数据
const formData = reactive<any>({

});
// 使用 reactive 包装数组
const transactionType = reactive<Transaction[]>([
  {
    name: "代收",
    type: 1
  },
  {
    name: "代付",
    type: 2
  }
])
const showEdit = ref(false);
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: financeAccountRecords,
  params: formData,
});


// const { optionsData } = useDictOptions<{
//   role: any[];
// }>({
//   role: {
//     api: roleAll,
//   },
// });

onMounted(() => {
  getLists();
});
</script>
