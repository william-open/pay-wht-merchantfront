<template>
  <div class="admin">
    <!-- 搜索条件 -->
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="平台/商户订单号">
          <el-input
            v-model="formData.keyword"
            class="w-[300px]"
            clearable
            placeholder="请输入平台或商户订单号"
            @keyup.enter="resetPage"
          />
        </el-form-item>

        <!-- 时间区间 -->
        <el-form-item label="交易时间">
          <daterange-picker
            v-model:startTime="formData.startTime"
            v-model:endTime="formData.endTime"
          />
        </el-form-item>

        <!-- 类型筛选 -->
        <el-form-item label="交易类型">
          <el-select class="w-[240px]" v-model="formData.type" placeholder="请选择类型">
            <el-option label="全部" :value="''" />
            <el-option
              v-for="(item, index) in transactionType"
              :key="index"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
          <el-button type="success" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card v-loading="pager.loading" class="mt-4 !border-none" shadow="never">
      <el-table :data="pager.lists" size="large" border stripe>
        <el-table-column label="编号" prop="id" min-width="80" />
<el-table-column label="类型" prop="type" min-width="100">
  <template #default="{ row }">
    <el-tag :type="getFinanceTypeLabel(row.type).tag">
      {{ getFinanceTypeLabel(row.type).text }}
    </el-tag>
  </template>
</el-table-column>

        <el-table-column label="货币" prop="currency" min-width="100" />
        <el-table-column label="国家" prop="country" min-width="100" />
        <el-table-column label="平台订单号" prop="orderNo" min-width="150" />
        <el-table-column label="商户订单号" prop="mOrderNo" min-width="150" />
        <el-table-column label="原金额" prop="oldBalance" min-width="120" />
        <el-table-column label="变动金额" prop="money" min-width="120" />
        <el-table-column label="变动后金额" prop="balance" min-width="120" />
        <el-table-column label="备注" prop="description" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作人" prop="operator" min-width="120" />
        <el-table-column label="创建时间" prop="createTime" min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex mt-4 justify-end">
        <pagination v-model="pager" @change="getLists" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup name="accountRecords">
import { financeAccountRecords, accountLogExport } from "@/api/biz/finance";
import { usePaging } from "@/hooks/usePaging";
import { parseTime } from "@/utils/timeDate";
import { AccountFinanceType } from "@/enums/appEnums";
import { ElMessage } from "element-plus";

// =============== 表单数据 ===============
const formData = reactive({
  keyword: "",
  startTime: "",
  endTime: "",
  type: "",
});

// 交易类型选项
const transactionType = reactive([
  { name: "代收", type: 1 },
  { name: "代付", type: 2 },
  { name: "充值", type: 3 },
  { name: "提现", type: 4 },
  { name: "后台添加", type: 5 },
  { name: "后台扣除", type: 6 },
  { name: "后台冻结", type: 7 },
  { name: "后台解冻", type: 8 },
  { name: "代收收益", type: 11 },
  { name: "代付收益", type: 21 },
  { name: "解冻资金", type: 61 },
  { name: "删除冻结", type: 62 },
]);

const getFinanceTypeLabel = (type: number): { text: string; tag: string } => {
  switch (type) {
    case AccountFinanceType.RECEIVE:
      return { text: "代收", tag: "success" }
    case AccountFinanceType.PAYOUT:
      return { text: "代付", tag: "info" }

    case AccountFinanceType.BACK_RECHARGE:
      return { text: "后台充值", tag: "primary" }
    case AccountFinanceType.BACK_WITHDRAW:
      return { text: "后台提现", tag: "danger" }
    case AccountFinanceType.BACK_ADD_BALANCE:
      return { text: "后台加款", tag: "success" }
    case AccountFinanceType.BACK_SUB_BALANCE:
      return { text: "后台扣款", tag: "warning" }
    case AccountFinanceType.BACK_FREEZE:
      return { text: "后台冻结", tag: "danger" }
    case AccountFinanceType.BACK_UNFREEZE:
      return { text: "后台解冻", tag: "success" }

    case AccountFinanceType.API_PAY_AWARD:
      return { text: "代收收益", tag: "success" }
    case AccountFinanceType.API_PAYOUT_AWARD:
      return { text: "代付收益", tag: "success" }
    case AccountFinanceType.API_FREEZE:
      return { text: "API冻结", tag: "danger" }
    case AccountFinanceType.API_UNFREEZE:
      return { text: "API解冻", tag: "success" }
    case AccountFinanceType.API_DELETE_FREEZE:
      return { text: "API删除冻结", tag: "warning" }
    default:
      return { text: "其他", tag: "info" }
  }
}

// 分页 Hook
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: financeAccountRecords,
  params: formData,
});

// =============== 导出功能 ===============
const handleExport = async () => {
  if (!formData.startTime || !formData.endTime) {
    ElMessage.warning("请选择导出时间区间");
    return;
  }

  try {
    const res = await accountLogExport({
      startTime: formData.startTime,
      endTime: formData.endTime,
      keyword: formData.keyword,
      type: formData.type,
    });

    const blob = new Blob([res], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    if (blob.size === 0) {
      ElMessage.warning("导出结果为空，请检查筛选条件");
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `account_log_${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出错误:", error);
    ElMessage.error("导出失败，请稍后再试");
  }
};

onMounted(() => {
  getLists();
});
</script>
