<template>
  <div class="admin">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="货币名称">
          <el-input
            v-model="formData.currency"
            class="w-[280px]"
            clearable
            @keyup.enter="resetPage"
          />
        </el-form-item>
<!--        <el-form-item label="货币类型">-->
<!--          <el-select class="w-[280px]" v-model="formData.role">-->
<!--            <el-option label="全部" value="" />-->
<!--            <el-option-->
<!--              v-for="(item, index) in optionsData.role"-->
<!--              :key="index"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="pager.loading" class="mt-4 !border-none" shadow="never">
      <el-button
        v-perms="['biz:currency:m:add']"
        type="primary"
        @click="handleAdd"
      >
        <template #icon>
          <icon name="el-icon-Plus" />
        </template>
        添加货币
      </el-button>
      <div class="mt-4">
        <el-table :data="pager.lists" size="large">
<!--          <el-table-column label="ID" prop="id" min-width="60" />-->
          <el-table-column label="Logo" min-width="100">
            <template #default="{ row }">
              <el-avatar :size="50" :src="row.logo"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="货币" prop="currency" min-width="100" />
          <el-table-column label="货币符号" prop="symbol" min-width="100" />
          <el-table-column label="货币类型" prop="currencyType" min-width="100" />
          <el-table-column label="主货币编号" min-width="100">
            <template #default="{ row }">
              <span>{{ row.pId > 0 ? row.pId : row.currencyId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编号/合约地址">
            <template #default="{row}">
              <span>{{row.currencyType == 'token'?row.contractAddress:row.currencyId}}</span>
            </template>
          </el-table-column>
          <el-table-column label="地址数量" prop="dept" min-width="100" />
          <el-table-column label="精度" prop="decimals" min-width="100" />
<!--          <el-table-column label="添加时间" prop="createTime" min-width="180" />-->
<!--          <el-table-column label="操作" width="120" fixed="right">-->
<!--            <template #default="{ row }">-->
<!--              <el-button-->
<!--                v-perms="['biz:currency:detail']"-->
<!--                type="primary"-->
<!--                link-->
<!--                @click="handleEdit(row)"-->
<!--              >-->
<!--                详情-->
<!--              </el-button>-->
<!--              <el-button-->
<!--                v-if="row.id != 1"-->
<!--                v-perms="['biz:currency:m:del']"-->
<!--                type="danger"-->
<!--                link-->
<!--                @click="handleDelete(row.id)"-->
<!--              >-->
<!--                删除-->
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
    <select-popup
        v-if="showSelect"
        ref="selectRef"
        @success="getLists"
        @close="showSelect = false"
    />
  </div>
</template>

<script lang="ts" setup name="currency">
import {currencyLists, currencyDelete, currencyStatus, currencyAll} from "@/api/biz/currency";
import { roleAll } from "@/api/perms/role";
import { useDictOptions } from "@/hooks/useDictOptions";
import { usePaging } from "@/hooks/usePaging";
import feedback from "@/utils/feedback";
import EditPopup from "./edit.vue";
import SelectPopup from "./select.vue";
const editRef = shallowRef<InstanceType<typeof EditPopup>>();
const selectRef = shallowRef<InstanceType<typeof SelectPopup>>();
// 表单数据
const formData = reactive<any>({});
const showEdit = ref(false);
const showSelect = ref(false);
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun:currencyLists,
  params: formData,
});

const changeStatus = async (active: any, id: number) => {
  try {
    await feedback.confirm(`确定${active ? "停用" : "开启"}当前管理员？`);
    await currencyStatus({ id });
    feedback.msgSuccess("修改成功");
    getLists();
  } catch (error) {
    getLists();
  }
};
const handleAdd = async () => {
  showSelect.value = true;
  await nextTick();
  selectRef.value?.open("add");
};

const handleEdit = async (data: any) => {
  showEdit.value = true;
  await nextTick();
  editRef.value?.open("edit");
  editRef.value?.setFormData(data);
};

const handleDelete = async (id: number) => {
  await feedback.confirm("确定要删除？");
  await currencyDelete({ id });
  feedback.msgSuccess("删除成功");
  getLists();
};

const { optionsData } = useDictOptions<{
  currency: any[];
}>({
  currency: {
    api: currencyAll,
  },
});

onMounted(() => {
  getLists();
});
</script>
