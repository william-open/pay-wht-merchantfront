<template>
  <div class="admin">
<!--    <el-card class="!border-none" shadow="never">-->
<!--      <el-form class="mb-[-16px]" :model="formData" inline>-->
<!--        <el-form-item label="钱包地址">-->
<!--          <el-input-->
<!--            v-model="formData.keyword"-->
<!--            class="w-[280px]"-->
<!--            clearable-->
<!--            @keyup.enter="resetPage"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="状态">-->
<!--          <el-select class="w-[280px]" v-model="formData.status">-->
<!--            <el-option label="全部" value="" />-->
<!--            <el-option-->
<!--              v-for="(item, index) in optionsData.role"-->
<!--              :key="index"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="resetPage">查询</el-button>-->
<!--          <el-button @click="resetParams">重置</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </el-card>-->
    <el-card v-loading="pager.loading" class="mt-4 !border-none" shadow="never">
      <div class="mt-4">
        <el-table :data="pager.lists" size="large">
          <el-table-column label="货币" prop="currencySymbol" min-width="100" />
          <el-table-column label="余额" prop="amount" min-width="100" />
          <el-table-column label="更新时间" prop="updateTime" min-width="180" />
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

<script lang="ts" setup name="wallet">
import { walletBalance } from "@/api/biz/collection_address";
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
const { query } = useRoute()
const queryParams = reactive({
  address: String(query.address),
})
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: walletBalance,
  params: queryParams,
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
