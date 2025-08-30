<template>
  <div class="admin">
    <el-card v-loading="pager.loading" class="mt-4 !border-none" shadow="never">
      <div class="mt-4">
        <el-table :data="pager.lists" size="large">
          <el-table-column label="IP地址">
            <template #default="{ row }">
              <el-tag v-if="row.iPAddress == '0.0.0.0'">全部IP</el-tag>
              <el-tag v-else >{{row.iPAddress}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="后台登录">
            <template #default="{ row }">
              <el-tag v-if="row.canAdmin == 1" type="success">开启</el-tag>
              <el-tag v-else type="info">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="收款API">
            <template #default="{ row }">
              <el-tag v-if="row.canReceive == 1" type="success">开启</el-tag>
              <el-tag v-else type="info">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="付款API">
            <template #default="{ row }">
              <el-tag v-if="row.canPayout == 1" type="success">开启</el-tag>
              <el-tag v-else type="info">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" prop="createTime" min-width="180" />
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

<script lang="ts" setup name="dockingIpWhitelist">
import { ipWhiteLists } from "@/api/biz/docking";
import { roleAll } from "@/api/perms/role";
import { useDictOptions } from "@/hooks/useDictOptions";
import { usePaging } from "@/hooks/usePaging";
import feedback from "@/utils/feedback";
// 表单数据
const formData = reactive<any>({

});
const showEdit = ref(false);
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: ipWhiteLists,
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
