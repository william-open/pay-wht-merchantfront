<template>
  <div class="admin">
    <!-- <el-card class="!border-none" shadow="never"> -->
      <!-- <el-form class="mb-[-16px]" :model="formData" inline> -->
        <!-- <el-form-item label="输入流水号/TXID/钱包地址">
          <el-input
            v-model="formData.keyword"
            class="w-[300px]"
            clearable
            @keyup.enter="resetPage"
          />
        </el-form-item> -->
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
        <!-- <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form> -->
    <!-- </el-card> -->
    <el-card v-loading="pager.loading" class="mt-4 !border-none" shadow="never">
      <div class="mt-4">
        <el-table :data="pager.lists" size="large">
         <el-table-column label="商户名称" prop="merchantName"/>
          <el-table-column label="通道类型" prop="channelType" min-width="100">
            <template #default="{ row }">
              <el-tag v-if="row.channelType == 1">代收</el-tag>
              <el-tag v-else-if="row.channelType == 2">代付</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="通道编码" prop="channelCode"/>
          <el-table-column label="通道名称" prop="channelName" />
          <el-table-column label="国家" prop="country"/>
          <el-table-column label="货币符号" prop="currency"/>
          <el-table-column label="代理费率" prop="toAddress">
            <template #default="{ row }">
              <span>{{ row.defaultRate }}% + {{row.singleFee}}</span>
            </template>
          </el-table-column>
         <el-table-column label="备注" prop="remark"/>
         <el-table-column label="创建时间" prop="createTime" min-width="180" />
        
  
<!--          <el-table-column label="交易数量" prop="amount" min-width="100" />-->
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
          <!-- <el-table-column label="完成时间" prop="createTime" min-width="180" /> -->
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

<script lang="ts" setup name="channelProduct">
import { channelLists } from "@/api/biz/agent";
import { roleAll } from "@/api/perms/role";
import { useDictOptions } from "@/hooks/useDictOptions";
import { usePaging } from "@/hooks/usePaging";
import feedback from "@/utils/feedback";
// 表单数据
const formData = reactive<any>({

});
const showEdit = ref(false);
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: channelLists,
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
