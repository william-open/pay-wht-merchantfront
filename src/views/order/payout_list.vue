<template>
  <div class="admin">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="关键字">
          <el-input
            v-model="formData.keyword"
            class="w-[300px]"
            clearable
            placeholder="请输入订单号/姓名/卡号/通道订单号"
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
       <el-form-item label="交易状态">
         <el-select class="w-[280px]" v-model="formData.status">
    
           <el-option
               v-for="(item, index) in statusData"
               :key="index"
               :label="item.title"
               :value="item.value"
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
          <el-table-column label="订单类型" prop="channelTitle" min-width="100" />
          <el-table-column label="订单号" prop="mOrderId" min-width="100" />
          <el-table-column label="国家" prop="country" min-width="100" />
          <el-table-column label="货币" prop="currency" min-width="100" />
          <el-table-column label="通道订单号" prop="orderId" min-width="100" />
          <el-table-column label="金额" prop="amount" min-width="100" />
          <el-table-column label="佣金" prop="fees" min-width="100" />
          <el-table-column label="状态" prop="status" min-width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status == 1" type="info">处理中</el-tag>
              <el-tag v-else-if="row.status == 2" type="success">成功</el-tag>
              <el-tag v-else-if="row.status == 3" type="warning">冲正退回</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="卡号信息" prop="fees" min-width="100">
            <template #default="{ row }">
              <div>持卡人：{{ row.accountName }}</div>
              <div>卡号：{{ row.accountNo }}</div>
              <div>银行名称：{{ row.bankName }}</div>
              <div>银行编码{{ row.bankCode }}</div>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" prop="createTime" min-width="180" />
          <el-table-column label="完成时间" prop="finishTime" min-width="180" />
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

<script lang="ts" setup name="payoutList">
import { payOutLists } from "@/api/biz/order";
import { roleAll } from "@/api/perms/role";
import { useDictOptions } from "@/hooks/useDictOptions";
import { usePaging } from "@/hooks/usePaging";
import feedback from "@/utils/feedback";
// 表单数据
const formData = reactive<any>({

});
// 交易状态
const statusData = reactive<any>([{
    title: "全部",
    value:"0"

},{
    title: "处理中",
    value:"1"
},{
    title: "成功",
    value:"2"
},{
    title: "冲正退回",
    value:"3"
  }
  ]
  );
const showEdit = ref(false);
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: payOutLists,
  params: formData,
});



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
