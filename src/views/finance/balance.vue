<template>
  <div class="admin">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
                <el-form-item label="货币">
                  <el-select class="w-[280px]" v-model="formData.currency">
                    <el-option label="全部" value="" />
                    <el-option
                        v-for="(item, index) in optionsData.currencyList"
                        :key="index"
                        :label="item.country + ' - ' + item.currency"
                        :value="item.currency"
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
          <el-table-column label="货币" prop="currency" min-width="100" />
          <el-table-column label="国家" prop="country" min-width="100" />
          <el-table-column label="余额" prop="money" min-width="100" />
          <el-table-column label="冻结金额" prop="freezeMoney" min-width="100" />
          <el-table-column label="创建时间" prop="createTime" min-width="180" />
          <el-table-column label="更新时间" prop="updateTime" min-width="180" />
        </el-table>
      </div>
      <div class="flex mt-4 justify-end">
        <pagination v-model="pager" @change="getLists" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup name="finance-balance">
import {financeBalance,financeCurrency } from "@/api/biz/finance";
import { useDictOptions } from "@/hooks/useDictOptions";
import { usePaging } from "@/hooks/usePaging";

// 表单数据
const formData = reactive<any>({

});
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: financeBalance,
  params: formData,
});


const { optionsData } = useDictOptions<{
  currencyList: any[];
}>({
  currencyList: {
    api: financeCurrency,
  },
});

onMounted(() => {
  getLists();
});
</script>
