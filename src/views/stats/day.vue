<template>
  <div class="admin">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="queryData" inline>
        <el-form-item label="日期">
          <daterange-picker
              v-model:startTime="queryData.startTime"
              v-model:endTime="queryData.endTime"
          />
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
          <el-table-column label="日期" prop="id" min-width="100" />
          <el-table-column label="商户名" prop="currency" min-width="100" />
          <el-table-column label="余额" prop="country" min-width="100" />
          <el-table-column label="代收笔数" prop="orderNo" min-width="100" />
          <el-table-column label="代收总金额" prop="oldBalance" min-width="100" />
          <el-table-column label="代收费用" prop="money" min-width="100" />
          <el-table-column label="代付笔数" prop="balance" min-width="100" />
          <el-table-column label="代付金额" prop="dept" min-width="100" />
          <el-table-column label="代付费用" prop="dept" min-width="100" />
          <el-table-column label="提现笔数" prop="dept" min-width="100" />
          <el-table-column label="提现金额" prop="dept" min-width="100" />
          <el-table-column label="充值笔数" prop="dept" min-width="100" />
          <el-table-column label="充值金额" prop="dept" min-width="100" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                v-perms="['biz:stats:view']"
                type="primary"
                link
                icon="view"
                @click="handleView(row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex mt-4 justify-end">
        <pagination v-model="pager" @change="getLists" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup name="accountRecords">
import {day } from "@/api/biz/stats";
import { usePaging } from "@/hooks/usePaging";

// 查询条件
const queryData = reactive<any>({

});
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: day,
  params: queryData,
});
const handleView = (row:any) => {

};
onMounted(() => {
  getLists();
});
</script>
