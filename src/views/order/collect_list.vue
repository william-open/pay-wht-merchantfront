<template>
  <div class="admin">
    <!-- 查询表单 -->
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <!-- 关键字 -->
        <el-form-item label="关键字">
          <el-input
              v-model="formData.keyword"
              class="w-[300px]"
              clearable
              placeholder="请输入订单号/通道订单号"
              @keyup.enter="resetPage"
          />
        </el-form-item>

        <!-- ✅ 交易时间区间 -->
        <el-form-item label="交易时间">
          <el-date-picker
              v-model="formData.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="w-[380px]"
          />
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="交易状态">
          <el-select class="w-[200px]" v-model="formData.status" placeholder="请选择状态">
            <el-option
                v-for="(item, index) in statusData"
                :key="index"
                :label="item.title"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- 按钮操作区 -->
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
          <el-button type="success" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card v-loading="pager.loading" class="mt-4 !border-none" shadow="never">
      <el-table :data="pager.lists" size="large" stripe>
        <el-table-column label="订单类型" prop="channelTitle" min-width="120" />
        <el-table-column label="订单号" prop="mOrderId" min-width="160" />
        <el-table-column label="国家" prop="country" min-width="100" />
        <el-table-column label="货币" prop="currency" min-width="100" />
        <el-table-column label="通道订单号" prop="orderId" min-width="160" />
        <el-table-column label="金额" prop="amount" min-width="100" />
        <el-table-column label="佣金" prop="fees" min-width="100" />

        <!-- 状态 -->
        <el-table-column label="状态" prop="status" min-width="120">
          <template #default="{ row }">
            <el-tag v-if="row.status == 1" type="info">处理中</el-tag>
            <el-tag v-else-if="row.status == 2" type="success">成功</el-tag>
            <el-tag v-else-if="row.status == 3" type="warning">冲正退回</el-tag>
            <el-tag v-else-if="row.status == 5" type="danger">下单失败</el-tag>
            <el-tag v-else type="default">未知</el-tag>
          </template>
        </el-table-column>

        <!-- 时间 -->
        <el-table-column label="开始时间" prop="createTime" min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" prop="finishTime" min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.finishTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex mt-4 justify-end">
        <pagination v-model="pager" @change="getLists" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup name="collectOrderList">
import { parseTime } from "@/utils/timeDate";
import { collectLists, collectExport } from "@/api/biz/order";
import { usePaging } from "@/hooks/usePaging";
import { ElMessage } from "element-plus";

// ✅ 表单数据
const formData = reactive<any>({
  keyword: "",
  status: "",
  dateRange: [], // [startTime, endTime]
});

// 状态选项
const statusData = reactive<any>([
  { title: "全部", value: "" }, // ✅ 不传代表全部
  { title: "处理中", value: "1" },
  { title: "成功", value: "2" },
  { title: "冲正退回", value: "3" },
  { title: "下单失败", value: "5" },
]);

// ✅ 分页 Hook（动态拼接 startTime / endTime）
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: (params: any) => {
    const payload: any = { ...params };
    delete payload.dateRange; // ✅ 避免 axios 转成 dateRange[]=xxx

    if (formData.dateRange && formData.dateRange.length === 2) {
      payload.startTime = formData.dateRange[0];
      payload.endTime = formData.dateRange[1];
    }

    return collectLists(payload);
  },
  params: formData,
});

// 导出逻辑
const handleExport = async () => {
  if (!formData.dateRange || formData.dateRange.length !== 2) {
    ElMessage.warning("请选择导出时间区间");
    return;
  }

  const [startTime, endTime] = formData.dateRange;

  try {
    const res = await collectExport({
      startTime,
      endTime,
      keyword: formData.keyword,
      status: formData.status,
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
    link.download = `collect_orders_${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出错误:", error);
    ElMessage.error("导出失败，请稍后再试");
  }
};

// 初始化加载
onMounted(() => {
  getLists();
});
</script>

<style scoped>
.text-gray-700 {
  color: #374151;
}
</style>
