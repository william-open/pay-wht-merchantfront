<template>
  <div class="withdraw-container p-6">
    <el-steps :active="currentStep" finish-status="success" align-center>
      <el-step title="选择提款类型" />
      <el-step title="输入入款信息" />
      <el-step title="安全验证" />
      <el-step title="完成" />
    </el-steps>

    <!-- Step 1 -->
    <div v-if="currentStep === 1" class="step-content mt-8">
      <el-form label-width="120px">
        <el-form-item label="提款货币类型">
          <el-select v-model="form.currencyType" placeholder="请选择提款货币类型">
            <el-option
              v-for="(item, index) in optionsData.currency"
              :key="index"
              :label="`${item.country} - ${item.currency} (${item.money})`"
              :value="item.currency"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>

    <!-- Step 2 -->
    <div v-if="currentStep === 2" class="step-content mt-8">
      <el-form label-width="120px">
        <el-form-item label="账户余额">
          <span>{{ selectedBalance }}</span>
        </el-form-item>
        <el-form-item label="提款类型">
          <span>{{ displayCurrencyType }}</span>
        </el-form-item>
        <el-form-item label="收款人账号">
          <el-input v-model="form.recipientAccount" placeholder="请输入收款人账号" />
        </el-form-item>
        <el-form-item label="收款人姓名">
          <el-input v-model="form.recipientName" placeholder="请输入收款人姓名" />
        </el-form-item>
        <el-form-item label="银行编码">
          <el-input v-model="form.bankCode" placeholder="请输入银行编码" />
        </el-form-item>
        <el-form-item label="提款金额">
          <el-input-number
            v-model="form.amount"
            :min="1"
            :max="selectedBalance"
            :step="1"
            placeholder="请输入提款金额"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入入款备注" />
        </el-form-item>
      </el-form>
      <el-button @click="prevStep">上一步</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>

    <!-- Step 3 -->
    <div v-if="currentStep === 3" class="step-content mt-8">
      <el-form label-width="120px">
        <el-form-item label="收款人账号">
          <span>{{ form.recipientAccount }}</span>
        </el-form-item>
        <el-form-item label="收款人姓名">
          <span>{{ form.recipientName }}</span>
        </el-form-item>
        <el-form-item label="提款金额">
          <span>{{ form.amount }}</span>
        </el-form-item>
        <el-form-item label="支付密码">
          <el-input v-model="form.payPassword" type="password" placeholder="请输入支付密码" />
        </el-form-item>
        <el-form-item label="谷歌验证码">
          <el-input v-model="form.googleCode" placeholder="请输入谷歌验证码" />
        </el-form-item>
      </el-form>
      <el-button @click="prevStep">上一步</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>

    <!-- Step 4 -->
    <div v-if="currentStep === 4" class="step-content mt-8 text-center">
      <el-result
        icon="success"
        title="提交成功"
        sub-title="您的下发申请已提交，等待审核。"
      >
        <template #extra>
          <el-button type="primary" @click="resetForm">再入一笔</el-button>
          <el-button type="info" @click="goBill">查看账单</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts" name="Apply">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage,ElLoading } from "element-plus";
import { withdrawApply, mCurrencyCodeAll } from "@/api/biz/withdraw";
import { useDictOptions } from "@/hooks/useDictOptions";
import feedback from '@/utils/feedback'
const router = useRouter()

interface WithdrawForm {
  currencyType: string;
  recipientAccount: string;
  recipientName: string;
  bankCode: string;
  amount: number | null;
  remarks: string;
  payPassword: string;
  googleCode: string;
}

interface MCurrencyCode {
  country: string;
  currency: string;
  money: string;
}

const currentStep = ref(1);

const form = reactive<WithdrawForm>({
  currencyType: "",
  recipientAccount: "",
  recipientName: "",
  bankCode: "",
  amount: null,
  remarks: "",
  payPassword: "",
  googleCode: ""
});

const { optionsData } = useDictOptions<{
  currency: MCurrencyCode[]
}>({
  currency: {
    api: mCurrencyCodeAll
  }
});

const selectedBalance = computed(() => {
  const item = optionsData.currency.find(i => i.currency === form.currencyType);
  return item ? Number(item.money) : 0;
});

const displayCurrencyType = computed(() => {
  const item = optionsData.currency.find(i => i.currency === form.currencyType);
  return item ? `${item.country} - ${item.currency} (${item.money})` : "";
});

const nextStep = () => {
  if (currentStep.value === 1 && !form.currencyType) {
    ElMessage.warning("请选择提款货币类型");
    return;
  }
  if (currentStep.value === 2) {
    if (
      !form.recipientAccount ||
      !form.recipientName ||
      !form.bankCode ||
      !form.amount ||
      !form.remarks
    ) {
      ElMessage.warning("请完整填写收款信息");
      return;
    }
    if (form.amount > selectedBalance.value) {
      ElMessage.warning("提款金额不能超过账户余额");
      return;
    }
  }
  currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const submitForm = async () => {
  if (!form.payPassword || !form.googleCode) {
    ElMessage.warning("请输入支付密码和谷歌验证码");
    return;
  }

  const loading = ElLoading.service({
    lock: true,
    text: "提交中，请稍候...",
    background: "rgba(0, 0, 0, 0.3)"
  });

  try {
    await withdrawApply(form);
    feedback.msgSuccess('操作成功')
    currentStep.value = 4;
  } catch (error) {
    console.error("提交异常：", error);
    feedback.msgError("提交失败，请重试");
  } finally {
    loading.close();
  }
};


const resetForm = () => {
  Object.assign(form, {
    currencyType: "",
    recipientAccount: "",
    recipientName: "",
    bankCode: "",
    amount: null,
    remarks: "",
    payPassword: "",
    googleCode: ""
  });
  currentStep.value = 1;
};

const goBill = () => {
   router.push({ path: '/withdraw/records' });
};

onMounted(() => {
  // 可选初始化逻辑
});
</script>

<style scoped>
.withdraw-container {
  max-width: 800px;
  margin: 0 auto;
}
.step-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
</style>
