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
                v-for="(item, index) in auditStatus"
                :key="index"
                :label="item.name"
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
          <el-table-column label="提款编码" prop="orderNo" min-width="210" />
          <el-table-column label="用户名" prop="username" min-width="80"/>
          <el-table-column label="金额" prop="money" min-width="100" />
          <el-table-column label="货币类型" prop="currency" min-width="100" />
          <el-table-column label="国家" prop="country" min-width="100" />
          <el-table-column label="收款卡号" prop="bankAccount" min-width="100" />
          <el-table-column label="收款姓名" prop="bankUsername" min-width="100" />
          <el-table-column label="银行编码" prop="bankCode" min-width="100" />
          <el-table-column label="下发备注" prop="remark" min-width="180" />
          <el-table-column label="审核状态" prop="auditStatus" min-width="100" >
            <template #default="{ row }">
              <el-tag v-if="row.auditStatus == AuditStatus.PENDING" type="primary">待审核</el-tag>
              <el-tag v-if="row.auditStatus == AuditStatus.SUCCESS" type="success">审核通过</el-tag>
              <el-tag v-if="row.auditStatus == AuditStatus.REFUND" type="danger">退回</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" prop="createTime" min-width="180" />
          <el-table-column label="审核时间" prop="auditTime" min-width="180" />
          <el-table-column label="审核人名称" prop="operator" min-width="180" />
          <el-table-column label="审核说明" prop="auditRemark" min-width="180" />
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

<script lang="ts" setup name="Records">
import {withdrawRecords } from "@/api/biz/withdraw";

import { usePaging } from "@/hooks/usePaging";

import {AuditStatus} from "@/enums/appEnums";

// 定义接口类型
interface AuditStatus {
  name: string
  value: number
}

// 表单数据
const formData = reactive<any>({

});
// 使用 reactive 包装数组
const auditStatus = reactive<AuditStatus[]>([
  {
    name: "待审核",
    value: 1
  },
  {
    name: "审核通过",
    value: 2
  },
  {
    name: "退回",
    value: 3
  }
])
const showEdit = ref(false);
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: withdrawRecords,
  params: formData,
});



onMounted(() => {
  getLists();
});
</script>
